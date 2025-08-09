import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { customerLoginSchema, customerRegisterSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { zammadService } from "../services/zammad";

// Hash password
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

// Compare password
export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

// Customer registration
export async function registerCustomer(req: Request, res: Response) {
  try {
    const userData = customerRegisterSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if username exists
    const existingUsername = await storage.getUserByUsername(userData.username);
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Create user with hashed password
    const hashedPassword = hashPassword(userData.password);
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
      role: "customer",
      status: "pending" // Requires admin approval
    });

    res.status(201).json({
      message: "Registration successful. Your account is pending approval.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        status: user.status
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error('Customer registration error:', error);
    return res.status(500).json({ message: "Registration failed" });
  }
}

// Customer login with Zammad sync
export async function loginCustomer(req: Request, res: Response) {
  try {
    const { email, password } = customerLoginSchema.parse(req.body);

    // Find user by email in our database
    let user = await storage.getUserByEmail(email);
    
    // If user not found locally, check Zammad
    if (!user) {
      try {
        const zammadCustomer = await zammadService.findCustomerByEmail(email);
        
        if (zammadCustomer) {
          // Create local account for existing Zammad customer
          const hashedPassword = hashPassword(password);
          user = await storage.createUser({
            username: email.split('@')[0], // Use email prefix as username
            email: email,
            password: hashedPassword,
            fullName: `${zammadCustomer.firstname || ''} ${zammadCustomer.lastname || ''}`.trim() || email,
            companyName: zammadCustomer.organization || '',
            role: "customer",
            status: "active" // Auto-approve synced users
          });
          
          console.log(`Created local account for existing Zammad customer: ${email}`);
        } else {
          return res.status(401).json({ message: "Invalid credentials" });
        }
      } catch (zammadError) {
        console.error('Zammad sync error during login:', zammadError);
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    if (!comparePassword(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is active
    if (user.status !== "active") {
      return res.status(401).json({ 
        message: "Account is not active. Please contact administrator." 
      });
    }

    // Create session
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await storage.createSession(user.id, null, expiresAt);
    
    // Set session in request
    if (req.session) {
      req.session.user = user;
      req.session.isAuthenticated = true;
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error('Customer login error:', error);
    return res.status(500).json({ message: "Login failed" });
  }
}

// Logout
export async function logout(req: Request, res: Response) {
  try {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      res.status(200).json({ message: "Already logged out" });
    }
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: "Logout failed" });
  }
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.isAuthenticated && (req.session.user || req.session.adUser)) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
}

// Middleware to check if user is admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
}

// Get pending customers (admin only)
export async function getPendingCustomers(req: Request, res: Response) {
  try {
    const pendingUsers = await storage.getAllPendingUsers();
    const usersWithoutPasswords = pendingUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error('Error getting pending customers:', error);
    res.status(500).json({ message: "Server error" });
  }
}

// Approve customer (admin only)
export async function approveCustomer(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.updateUser(userId, { status: "active" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ 
      message: "Customer approved successfully", 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Error approving customer:', error);
    res.status(500).json({ message: "Server error" });
  }
}