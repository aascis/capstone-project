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

// Tickets table (integrates with Zammad)
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  ticketId: text("ticket_id").unique(), // Zammad ticket ID
  subject: text("subject"),
  description: text("description"),
  status: text("status").notNull().default("open"), // 'open', 'in_progress', 'pending', 'resolved', 'closed'
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high', 'critical'
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  adUserId: integer("ad_user_id").references(() => adUsers.id, { onDelete: "cascade" }),
  assignedTo: integer("assigned_to").references(() => adUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Subscriptions table for customers
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  subscriptionId: text("subscription_id").unique(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // 'active', 'inactive', 'expired'
  licenseType: text("license_type"),
  renewalDate: timestamp("renewal_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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
export const userRelations = relations(users, ({ many }) => ({
  tickets: many(tickets),
  subscriptions: many(subscriptions),
}));

export const adUserRelations = relations(adUsers, ({ many }) => ({
  tickets: many(tickets),
  assignedTickets: many(tickets),
}));

export const ticketRelations = relations(tickets, ({ one }) => ({
  user: one(users, { fields: [tickets.userId], references: [users.id] }),
  adUser: one(adUsers, { fields: [tickets.adUserId], references: [adUsers.id] }),
  assignedUser: one(adUsers, { fields: [tickets.assignedTo], references: [adUsers.id] }),
}));

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

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

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastUpdated: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

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
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type ApplicationLink = typeof applicationLinks.$inferSelect;
export type InsertApplicationLink = z.infer<typeof insertApplicationLinkSchema>;
export type Session = typeof sessions.$inferSelect;
export type CustomerLoginData = z.infer<typeof customerLoginSchema>;
export type EmployeeLoginData = z.infer<typeof employeeLoginSchema>;
export type CustomerRegisterData = z.infer<typeof customerRegisterSchema>;
