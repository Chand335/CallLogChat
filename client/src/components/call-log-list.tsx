import { CallLogItem } from "@/components/call-log-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Phone, AlertCircle, RefreshCw } from "lucide-react";
import type { CallLog } from "@shared/schema";

interface CallLogListProps {
  callLogs: CallLog[];
  isLoading: boolean;
  isError: boolean;
  onWhatsAppClick: (callLog: CallLog) => void;
  onRetry?: () => void;
}

function CallLogSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 rounded-lg bg-card border border-card-border"
        >
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="w-9 h-9 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4"
      data-testid="empty-state"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Phone className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No call logs yet
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Add your first call log entry using the button below to start sending
        WhatsApp messages
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4"
      data-testid="error-state"
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Failed to load call logs
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
        Something went wrong while fetching your call logs. Please try again.
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}

export function CallLogList({
  callLogs,
  isLoading,
  isError,
  onWhatsAppClick,
  onRetry,
}: CallLogListProps) {
  if (isLoading) {
    return <CallLogSkeleton />;
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (callLogs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2" data-testid="call-log-list">
      {callLogs.map((callLog) => (
        <CallLogItem
          key={callLog.id}
          callLog={callLog}
          onWhatsAppClick={onWhatsAppClick}
        />
      ))}
    </div>
  );
}
