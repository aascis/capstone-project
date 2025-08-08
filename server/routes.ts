import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, customerLoginSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

// Active Directory configuration
const AD_CONFIG = {
  // These would be configured based on the local AD setup
  server: process.env.AD_SERVER || "localhost",
  baseDN: process.env.AD_BASE_DN || "dc=company,dc=local",
};

// Zammad configuration  
const ZAMMAD_CONFIG = {
  baseUrl: process.env.ZAMMAD_URL || "http://10.171.132.90:5432",
  apiToken: process.env.ZAMMAD_API_TOKEN || "",
};

async function authenticateEmployee(username: string, password: string): Promise<boolean> {
  try {
    // In a real implementation, this would use the activedirectory2 package
    // For now, we'll create a simple check against stored users
    const user = await storage.getUserByUsername(username);
    if (!user || user.userType !== 'employee') {
      return false;
    }
    
    if (user.password) {
      return await bcrypt.compare(password, user.password);
    }
    
    // TODO: Implement actual Active Directory authentication using activedirectory2
    // const ActiveDirectory = require('activedirectory2');
    // const ad = new ActiveDirectory(AD_CONFIG);
    // return new Promise((resolve) => {
    //   ad.authenticate(username, password, (err, auth) => {
    //     resolve(!err && auth);
    //   });
    // });
    
    return false;
  } catch (error) {
    console.error('Employee authentication error:', error);
    return false;
  }
}

async function authenticateCustomer(email: string, password: string): Promise<any> {
  try {
    // Authenticate with Zammad API
    const response = await fetch(`${ZAMMAD_CONFIG.baseUrl}/api/v1/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return userData;
    }
    
    return null;
  } catch (error) {
    console.error('Customer authentication error:', error);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Employee login endpoint
  app.post("/api/auth/employee/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse({
        ...req.body,
        userType: "employee"
      });

      const isAuthenticated = await authenticateEmployee(username, password);
      
      if (!isAuthenticated) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      let user = await storage.getUserByUsername(username);
      
      // Create user if doesn't exist (for AD users)
      if (!user) {
        user = await storage.createUser({
          username,
          userType: "employee",
          fullName: username, // In real AD integration, get full name from AD
          isActive: true,
        });
      }

      // Create session
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const session = await storage.createSession(user.id, expiresAt);
      
      // Set session cookie
      res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ 
        user: {
          id: user.id,
          username: user.username,
          userType: user.userType,
          fullName: user.fullName,
        }
      });
    } catch (error) {
      console.error('Employee login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Customer login endpoint
  app.post("/api/auth/customer/login", async (req, res) => {
    try {
      const { email, password } = customerLoginSchema.parse(req.body);

      const zammadUser = await authenticateCustomer(email, password);
      
      if (!zammadUser) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      let user = await storage.getUserByEmail(email);
      
      // Create or update user from Zammad data
      if (!user) {
        user = await storage.createUser({
          username: email,
          email,
          userType: "customer",
          fullName: `${zammadUser.firstname} ${zammadUser.lastname}`,
          isActive: true,
        });
      }

      // Create session
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const session = await storage.createSession(user.id, expiresAt);
      
      // Set session cookie
      res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          userType: user.userType,
          fullName: user.fullName,
        }
      });
    } catch (error) {
      console.error('Customer login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get current user endpoint
  app.get("/api/auth/me", async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      
      if (!sessionId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const session = await storage.getSession(sessionId);
      
      if (!session) {
        return res.status(401).json({ message: "Invalid session" });
      }

      const user = await storage.getUser(session.userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          userType: user.userType,
          fullName: user.fullName,
        }
      });
    } catch (error) {
      console.error('Auth check error:', error);
      res.status(500).json({ message: "Authentication check failed" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      
      if (sessionId) {
        await storage.deleteSession(sessionId);
      }
      
      res.clearCookie('sessionId');
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Clean expired sessions periodically
  setInterval(async () => {
    try {
      await storage.deleteExpiredSessions();
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }, 60 * 60 * 1000); // Every hour

  const httpServer = createServer(app);
  return httpServer;
}
