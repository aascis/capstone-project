import { 
  users, 
  adUsers,
  applicationLinks,
  sessions,
  type User, 
  type InsertUser,
  type ADUser,
  type InsertADUser,
  type ApplicationLink,
  type InsertApplicationLink,
  type Session
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getAllPendingUsers(): Promise<User[]>;
  
  // AD User methods
  getADUser(id: number): Promise<ADUser | undefined>;
  getADUserByUsername(username: string): Promise<ADUser | undefined>;
  createADUser(user: InsertADUser): Promise<ADUser>;
  updateADUser(id: number, user: Partial<ADUser>): Promise<ADUser | undefined>;
  
  // Session methods
  createSession(userId: number | null, adUserId: number | null, expiresAt: Date): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  deleteSession(sessionId: string): Promise<void>;
  deleteExpiredSessions(): Promise<void>;
  
  // Ticket methods removed - all handled by Zammad API directly
  
  // Subscription methods removed - not needed
  
  // Application Link methods
  getApplicationLink(id: number): Promise<ApplicationLink | undefined>;
  getAllApplicationLinks(): Promise<ApplicationLink[]>;
  createApplicationLink(applicationLink: InsertApplicationLink): Promise<ApplicationLink>;
  updateApplicationLink(id: number, applicationLink: Partial<ApplicationLink>): Promise<ApplicationLink | undefined>;
  clearApplicationLinks(): Promise<void>;
  initializeAndGetApplicationLinks(): Promise<ApplicationLink[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        updatedAt: new Date()
      })
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getAllPendingUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.status, 'pending'));
  }

  // AD User methods
  async getADUser(id: number): Promise<ADUser | undefined> {
    const [user] = await db.select().from(adUsers).where(eq(adUsers.id, id));
    return user || undefined;
  }

  async getADUserByUsername(username: string): Promise<ADUser | undefined> {
    const [user] = await db.select().from(adUsers).where(eq(adUsers.username, username));
    return user || undefined;
  }

  async createADUser(insertUser: InsertADUser): Promise<ADUser> {
    const [user] = await db
      .insert(adUsers)
      .values({
        ...insertUser,
        updatedAt: new Date()
      })
      .returning();
    return user;
  }

  async updateADUser(id: number, userData: Partial<ADUser>): Promise<ADUser | undefined> {
    const [user] = await db
      .update(adUsers)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(adUsers.id, id))
      .returning();
    return user || undefined;
  }

  // Session methods
  async createSession(userId: number | null, adUserId: number | null, expiresAt: Date): Promise<Session> {
    const sessionId = randomUUID();
    const [session] = await db
      .insert(sessions)
      .values({
        id: sessionId,
        userId,
        adUserId,
        expiresAt,
      })
      .returning();
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));
    return session || undefined;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  async deleteExpiredSessions(): Promise<void> {
    await db.delete(sessions).where(sql`${sessions.expiresAt} <= NOW()`);
  }

  // Ticket methods removed - all ticket operations handled by Zammad API directly

  // Subscription methods removed - not needed for this website



  // Application Link methods
  async getApplicationLink(id: number): Promise<ApplicationLink | undefined> {
    const [link] = await db.select().from(applicationLinks).where(eq(applicationLinks.id, id));
    return link || undefined;
  }

  async getAllApplicationLinks(): Promise<ApplicationLink[]> {
    return await db
      .select()
      .from(applicationLinks)
      .where(eq(applicationLinks.isActive, true))
      .orderBy(applicationLinks.order);
  }

  async createApplicationLink(insertApplicationLink: InsertApplicationLink): Promise<ApplicationLink> {
    const [link] = await db
      .insert(applicationLinks)
      .values(insertApplicationLink)
      .returning();
    return link;
  }

  async updateApplicationLink(id: number, applicationLinkData: Partial<ApplicationLink>): Promise<ApplicationLink | undefined> {
    const [link] = await db
      .update(applicationLinks)
      .set(applicationLinkData)
      .where(eq(applicationLinks.id, id))
      .returning();
    return link || undefined;
  }

  async clearApplicationLinks(): Promise<void> {
    await db.delete(applicationLinks);
  }

  async initializeAndGetApplicationLinks(): Promise<ApplicationLink[]> {
    // Initialize with default application links
    const defaultLinks = [
      {
        name: "Prometheus",
        url: "https://prometheus.tecknet.ca",
        description: "Monitoring and alerting system",
        icon: "bar-chart-2",
        isActive: true,
        order: 1
      },
      {
        name: "Wazuh",
        url: "https://wazuh.tecknet.ca",
        description: "Security information and event management",
        icon: "shield",
        isActive: true,
        order: 2
      },
      {
        name: "Calendar",
        url: "https://calendar.tecknet.ca",
        description: "Company-wide calendar and scheduling",
        icon: "calendar",
        isActive: true,
        order: 3
      },
      {
        name: "Documentation",
        url: "https://docs.tecknet.ca",
        description: "Product and internal documentation",
        icon: "file-text",
        isActive: true,
        order: 4
      }
    ];

    // Insert default links
    for (const link of defaultLinks) {
      await this.createApplicationLink(link);
    }

    return this.getAllApplicationLinks();
  }
}

export const storage = new DatabaseStorage();
