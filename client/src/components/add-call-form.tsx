import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone, Clock, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertCallLogSchema, callTypes, type InsertCallLog, type CallType } from "@shared/schema";

interface AddCallFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertCallLog) => void;
  isPending: boolean;
}

const callTypeOptions: { value: CallType; label: string; icon: typeof PhoneIncoming }[] = [
  { value: "incoming", label: "Incoming", icon: PhoneIncoming },
  { value: "outgoing", label: "Outgoing", icon: PhoneOutgoing },
  { value: "missed", label: "Missed", icon: PhoneMissed },
];

export function AddCallForm({ open, onOpenChange, onSubmit, isPending }: AddCallFormProps) {
  const form = useForm<InsertCallLog>({
    resolver: zodResolver(insertCallLogSchema),
    defaultValues: {
      contactName: "",
      phoneNumber: "",
      callType: "incoming",
      duration: 0,
    },
  });

  const handleSubmit = (data: InsertCallLog) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl h-auto max-h-[85vh]">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold">Add Call Log</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pb-6">
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Contact Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="Enter contact name"
                        className="pl-10"
                        data-testid="input-contact-name"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="tel"
                        placeholder="Enter phone number with country code"
                        className="pl-10"
                        data-testid="input-phone-number"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Call Duration (seconds)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="0"
                        className="pl-10"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-duration"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="callType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Call Type</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {callTypeOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = field.value === option.value;
                        return (
                          <Button
                            key={option.value}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="lg"
                            className="flex-1 gap-2"
                            onClick={() => field.onChange(option.value)}
                            data-testid={`button-call-type-${option.value}`}
                          >
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </Button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold"
              disabled={isPending}
              data-testid="button-save-call"
            >
              {isPending ? "Saving..." : "Save Call Log"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
