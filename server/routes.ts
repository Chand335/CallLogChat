import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCallLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all call logs
  app.get("/api/call-logs", async (_req, res) => {
    try {
      const callLogs = await storage.getCallLogs();
      res.json(callLogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch call logs" });
    }
  });

  // Get single call log
  app.get("/api/call-logs/:id", async (req, res) => {
    try {
      const callLog = await storage.getCallLog(req.params.id);
      if (!callLog) {
        return res.status(404).json({ message: "Call log not found" });
      }
      res.json(callLog);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch call log" });
    }
  });

  // Create call log
  app.post("/api/call-logs", async (req, res) => {
    try {
      const result = insertCallLogSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: result.error.errors 
        });
      }
      const callLog = await storage.createCallLog(result.data);
      res.status(201).json(callLog);
    } catch (error) {
      res.status(500).json({ message: "Failed to create call log" });
    }
  });

  // Update call log
  app.patch("/api/call-logs/:id", async (req, res) => {
    try {
      const existingLog = await storage.getCallLog(req.params.id);
      if (!existingLog) {
        return res.status(404).json({ message: "Call log not found" });
      }
      const result = insertCallLogSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: result.error.errors 
        });
      }
      const updatedLog = await storage.updateCallLog(req.params.id, result.data);
      res.json(updatedLog);
    } catch (error) {
      res.status(500).json({ message: "Failed to update call log" });
    }
  });

  // Delete call log
  app.delete("/api/call-logs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCallLog(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Call log not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete call log" });
    }
  });

  return httpServer;
}
