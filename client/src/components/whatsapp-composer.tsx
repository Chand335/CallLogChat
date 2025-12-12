import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CallLog } from "@shared/schema";

interface WhatsAppComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callLog: CallLog | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-primary/20",
    "bg-chart-2/20",
    "bg-chart-3/20",
    "bg-chart-4/20",
    "bg-chart-5/20",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function formatPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

const templateVariables = [
  { key: "{name}", label: "Name" },
  { key: "{number}", label: "Number" },
];

export function WhatsAppComposer({
  open,
  onOpenChange,
  callLog,
}: WhatsAppComposerProps) {
  const [message, setMessage] = useState("Hi {name}, ");
  const maxChars = 4096;

  if (!callLog) return null;

  const insertVariable = (variable: string) => {
    setMessage((prev) => prev + variable);
  };

  const getProcessedMessage = () => {
    return message
      .replace(/{name}/g, callLog.contactName)
      .replace(/{number}/g, callLog.phoneNumber);
  };

  const handleSendToWhatsApp = () => {
    const processedMessage = getProcessedMessage();
    const phoneNumber = formatPhoneForWhatsApp(callLog.phoneNumber);
    const encodedMessage = encodeURIComponent(processedMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl h-auto max-h-[90vh] flex flex-col"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold">
            Send WhatsApp Message
          </SheetTitle>
        </SheetHeader>

        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Avatar className={`w-12 h-12 ${getAvatarColor(callLog.contactName)}`}>
            <AvatarFallback className="text-sm font-semibold bg-transparent">
              {getInitials(callLog.contactName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p
              className="font-semibold text-foreground"
              data-testid="text-composer-contact-name"
            >
              {callLog.contactName}
            </p>
            <p
              className="text-sm text-muted-foreground"
              data-testid="text-composer-phone-number"
            >
              {callLog.phoneNumber}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 py-4 overflow-y-auto">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Your Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[120px] resize-none text-base"
              maxLength={maxChars}
              data-testid="textarea-whatsapp-message"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2 flex-wrap">
                {templateVariables.map((variable) => (
                  <Badge
                    key={variable.key}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => insertVariable(variable.key)}
                    data-testid={`badge-variable-${variable.label.toLowerCase()}`}
                  >
                    {variable.label}
                  </Badge>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {message.length}/{maxChars}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Preview</label>
            <div className="p-4 rounded-lg bg-muted text-sm whitespace-pre-wrap">
              {getProcessedMessage() || (
                <span className="text-muted-foreground">
                  Your message will appear here...
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border pb-6">
          <Button
            size="lg"
            className="w-full font-semibold gap-2"
            onClick={handleSendToWhatsApp}
            disabled={!message.trim()}
            data-testid="button-send-whatsapp"
          >
            <SiWhatsapp className="w-5 h-5" />
            Open in WhatsApp
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
