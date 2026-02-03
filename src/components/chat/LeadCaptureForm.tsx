import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface LeadCaptureFormProps {
  onSuccess: (name: string) => void;
  onCancel: () => void;
}

const LeadCaptureForm = ({ onSuccess, onCancel }: LeadCaptureFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("lead_magnet_downloads")
        .insert({
          name: name.trim(),
          email: email.trim(),
          lead_magnet_name: "Chat Discovery Call Request",
        });

      if (error) throw error;

      setIsSubmitted(true);
      setTimeout(() => {
        onSuccess(name.trim());
      }, 1500);
    } catch (error) {
      console.error("Error saving lead:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-primary/10 rounded-xl p-4 text-center animate-in fade-in">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
          <Check className="h-5 w-5 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">Thank you, {name}!</p>
        <p className="text-xs text-muted-foreground">We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-primary/5 rounded-xl p-4 space-y-3 animate-in slide-in-from-bottom-2">
      <div className="text-center mb-2">
        <p className="text-sm font-medium text-foreground">Book Your Free Discovery Call</p>
        <p className="text-xs text-muted-foreground">We'll reach out within 24 hours</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="chat-name" className="text-xs">Your Name</Label>
        <Input
          id="chat-name"
          type="text"
          placeholder="John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-9 text-sm"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="chat-email" className="text-xs">Email Address</Label>
        <Input
          id="chat-email"
          type="email"
          placeholder="john@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 text-sm"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="flex-1 h-9"
          disabled={isSubmitting}
        >
          Maybe Later
        </Button>
        <Button
          type="submit"
          size="sm"
          className="flex-1 h-9"
          disabled={isSubmitting || !name.trim() || !email.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              Submitting
            </>
          ) : (
            "Request Call"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LeadCaptureForm;
