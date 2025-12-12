import { useState } from "react";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { InsertMessageTemplate, MessageTemplate } from "@shared/schema";

interface TemplateManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplateManager({ open, onOpenChange }: TemplateManagerProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("Hi {name}, ");
  const { toast } = useToast();

  const { data: templates = [] } = useQuery<MessageTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: InsertMessageTemplate) => {
      const response = await apiRequest("POST", "/api/templates", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setName("");
      setMessage("Hi {name}, ");
      toast({
        title: "Template added",
        description: "Your message template has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add template.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/templates/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Template deleted",
        description: "Your message template has been removed.",
      });
    },
  });

  const handleAddTemplate = () => {
    if (!name.trim() || !message.trim()) return;
    addMutation.mutate({ name, message });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl h-auto max-h-[90vh] flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold">Message Templates</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Template Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Quick greeting"
                data-testid="input-template-name"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[100px]"
                data-testid="textarea-template-message"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use &#123;name&#125; for contact name and &#123;number&#125; for phone number
              </p>
            </div>

            <Button
              onClick={handleAddTemplate}
              disabled={!name.trim() || !message.trim() || addMutation.isPending}
              className="w-full"
              data-testid="button-save-template"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Template
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Your Templates</h3>
            {templates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No templates yet</p>
            ) : (
              templates.map((template) => (
                <Card key={template.id} className="p-3" data-testid={`card-template-${template.id}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{template.message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(template.id)}
                      data-testid={`button-delete-template-${template.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
