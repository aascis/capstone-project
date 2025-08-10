import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Customer users table (PostgreSQL authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password: text("password"),
  fullName: text("full_name"),
  companyName: text("company_name"),
  phone: text("phone"),
  role: text("role").notNull().default("customer"), // 'customer', 'admin'
  status: text("status").notNull().default("pending"), // 'pending', 'active', 'inactive'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Active Directory users table (separate from customers)
export const adUsers = pgTable("ad_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  fullName: text("full_name"),
  role: text("role").notNull().default("employee"), // 'employee', 'admin'
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions table
export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  adUserId: integer("ad_user_id").references(() => adUsers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tickets removed - all ticket operations handled by Zammad API directly

// Subscriptions removed - not needed for this website

// Application links for employees
export const applicationLinks = pgTable("application_links", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").default(true),
  order: integer("order").notNull().default(0),
});

// Relations
// Relations simplified - tickets handled by Zammad API
export const userRelations = relations(users, ({ many }) => ({
  // No ticket relations - tickets handled by Zammad
}));

export const adUserRelations = relations(adUsers, ({ many }) => ({
  // No ticket relations - tickets handled by Zammad  
}));

// Subscription relations removed

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertADUserSchema = createInsertSchema(adUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Ticket schema removed - using Zammad API directly

// Subscription schema removed

export const insertApplicationLinkSchema = createInsertSchema(applicationLinks).omit({
  id: true,
});

// Login schemas
export const customerLoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const employeeLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const customerRegisterSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Valid email is required"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ADUser = typeof adUsers.$inferSelect;
export type InsertADUser = z.infer<typeof insertADUserSchema>;
// Ticket types removed - using Zammad API objects directly
// Subscription types removed
export type ApplicationLink = typeof applicationLinks.$inferSelect;
export type InsertApplicationLink = z.infer<typeof insertApplicationLinkSchema>;
export type Session = typeof sessions.$inferSelect;
export type CustomerLoginData = z.infer<typeof customerLoginSchema>;
export type EmployeeLoginData = z.infer<typeof employeeLoginSchema>;
export type CustomerRegisterData = z.infer<typeof customerRegisterSchema>;
