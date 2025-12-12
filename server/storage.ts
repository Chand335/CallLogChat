import { type User, type InsertUser, type CallLog, type InsertCallLog, type MessageTemplate, type InsertMessageTemplate } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCallLogs(): Promise<CallLog[]>;
  getCallLog(id: string): Promise<CallLog | undefined>;
  createCallLog(callLog: InsertCallLog): Promise<CallLog>;
  updateCallLog(id: string, callLog: Partial<InsertCallLog>): Promise<CallLog | undefined>;
  deleteCallLog(id: string): Promise<boolean>;

  getMessageTemplates(): Promise<MessageTemplate[]>;
  createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate>;
  deleteMessageTemplate(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private callLogs: Map<string, CallLog>;
  private messageTemplates: Map<string, MessageTemplate>;

  constructor() {
    this.users = new Map();
    this.callLogs = new Map();
    this.messageTemplates = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCallLogs(): Promise<CallLog[]> {
    return Array.from(this.callLogs.values());
  }

  async getCallLog(id: string): Promise<CallLog | undefined> {
    return this.callLogs.get(id);
  }

  async createCallLog(insertCallLog: InsertCallLog): Promise<CallLog> {
    const id = randomUUID();
    const callLog: CallLog = {
      ...insertCallLog,
      id,
      duration: insertCallLog.duration || 0,
      isFavorite: insertCallLog.isFavorite || false,
      timestamp: insertCallLog.timestamp || new Date(),
    };
    this.callLogs.set(id, callLog);
    return callLog;
  }

  async updateCallLog(id: string, updateData: Partial<InsertCallLog>): Promise<CallLog | undefined> {
    const existingLog = this.callLogs.get(id);
    if (!existingLog) return undefined;
    
    const updatedLog: CallLog = {
      ...existingLog,
      ...updateData,
      timestamp: updateData.timestamp || existingLog.timestamp,
    };
    this.callLogs.set(id, updatedLog);
    return updatedLog;
  }

  async deleteCallLog(id: string): Promise<boolean> {
    return this.callLogs.delete(id);
  }

  async getMessageTemplates(): Promise<MessageTemplate[]> {
    return Array.from(this.messageTemplates.values());
  }

  async createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate> {
    const id = randomUUID();
    const messageTemplate: MessageTemplate = {
      ...template,
      id,
    };
    this.messageTemplates.set(id, messageTemplate);
    return messageTemplate;
  }

  async deleteMessageTemplate(id: string): Promise<boolean> {
    return this.messageTemplates.delete(id);
  }
}

export const storage = new MemStorage();
