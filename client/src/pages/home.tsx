import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBar } from "@/components/search-bar";
import { FilterPills } from "@/components/filter-pills";
import { CallLogList } from "@/components/call-log-list";
import { AddCallForm } from "@/components/add-call-form";
import { WhatsAppComposer } from "@/components/whatsapp-composer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CallLog, InsertCallLog, CallType } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<CallType | "all">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);
  const { toast } = useToast();

  const { data: callLogs = [], isLoading, isError, refetch } = useQuery<CallLog[]>({
    queryKey: ["/api/call-logs"],
  });

  const createCallLogMutation = useMutation({
    mutationFn: async (data: InsertCallLog) => {
      const response = await apiRequest("POST", "/api/call-logs", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/call-logs"] });
      setShowAddForm(false);
      toast({
        title: "Call log added",
        description: "Your call log entry has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add call log. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredCallLogs = useMemo(() => {
    let filtered = [...callLogs];

    if (selectedFilter !== "all") {
      filtered = filtered.filter((log) => log.callType === selectedFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.contactName.toLowerCase().includes(query) ||
          log.phoneNumber.includes(query)
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [callLogs, selectedFilter, searchQuery]);

  const handleWhatsAppClick = (callLog: CallLog) => {
    setSelectedCallLog(callLog);
    setShowWhatsApp(true);
  };

  const handleAddCallLog = (data: InsertCallLog) => {
    createCallLogMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between gap-4 px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Call Log</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-4 space-y-4 border-b border-border bg-background">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or number..."
          />
          <FilterPills
            selectedFilter={selectedFilter}
            onChange={setSelectedFilter}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <CallLogList
            callLogs={filteredCallLogs}
            isLoading={isLoading}
            isError={isError}
            onWhatsAppClick={handleWhatsAppClick}
            onRetry={() => refetch()}
          />
        </div>
      </main>

      <Button
        size="icon"
        className="fixed bottom-6 right-4 w-14 h-14 rounded-full shadow-lg z-40"
        onClick={() => setShowAddForm(true)}
        data-testid="button-add-call"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <AddCallForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSubmit={handleAddCallLog}
        isPending={createCallLogMutation.isPending}
      />

      <WhatsAppComposer
        open={showWhatsApp}
        onOpenChange={setShowWhatsApp}
        callLog={selectedCallLog}
      />
    </div>
  );
}
