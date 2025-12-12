import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Call log types
export const callTypes = ["incoming", "outgoing", "missed"] as const;
export type CallType = typeof callTypes[number];

export const callLogs = pgTable("call_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactName: text("contact_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  callType: text("call_type").notNull().$type<CallType>(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertCallLogSchema = createInsertSchema(callLogs).omit({
  id: true,
}).extend({
  contactName: z.string().min(1, "Contact name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  callType: z.enum(callTypes),
  timestamp: z.coerce.date().optional(),
});

export type InsertCallLog = z.infer<typeof insertCallLogSchema>;
export type CallLog = typeof callLogs.$inferSelect;

// WhatsApp message schema
export const whatsappMessageSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required"),
});

export type WhatsAppMessage = z.infer<typeof whatsappMessageSchema>;
