import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { CallLog } from "@shared/schema";
import { formatDistanceToNow, format } from "date-fns";

interface CallLogItemProps {
  callLog: CallLog;
  onWhatsAppClick: (callLog: CallLog) => void;
}

const callTypeIcons = {
  incoming: PhoneIncoming,
  outgoing: PhoneOutgoing,
  missed: PhoneMissed,
};

const callTypeColors = {
  incoming: "text-primary",
  outgoing: "text-chart-2",
  missed: "text-destructive",
};

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

export function CallLogItem({ callLog, onWhatsAppClick }: CallLogItemProps) {
  const Icon = callTypeIcons[callLog.callType];
  const colorClass = callTypeColors[callLog.callType];
  const timestamp = new Date(callLog.timestamp);
  const isToday = new Date().toDateString() === timestamp.toDateString();

  return (
    <Card
      className="px-4 py-3 hover-elevate active-elevate-2"
      data-testid={`card-call-log-${callLog.id}`}
    >
      <div className="flex items-center gap-3">
        <Avatar className={`w-12 h-12 ${getAvatarColor(callLog.contactName)}`}>
          <AvatarFallback className="text-sm font-semibold bg-transparent">
            {getInitials(callLog.contactName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-foreground truncate"
              data-testid={`text-contact-name-${callLog.id}`}
            >
              {callLog.contactName}
            </span>
            <Icon className={`w-4 h-4 flex-shrink-0 ${colorClass}`} />
          </div>
          <p
            className="text-sm text-muted-foreground truncate"
            data-testid={`text-phone-number-${callLog.id}`}
          >
            {callLog.phoneNumber}
          </p>
          <p className="text-xs text-muted-foreground">
            {isToday
              ? formatDistanceToNow(timestamp, { addSuffix: true })
              : format(timestamp, "MMM d, h:mm a")}
          </p>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="flex-shrink-0 text-primary"
          onClick={() => onWhatsAppClick(callLog)}
          data-testid={`button-whatsapp-${callLog.id}`}
        >
          <SiWhatsapp className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}
