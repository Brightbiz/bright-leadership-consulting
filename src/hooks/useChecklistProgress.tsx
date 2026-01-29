import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChecklistProgress {
  id: string;
  checked_items: string[];
  score: number;
  updated_at: string;
}

export const useChecklistProgress = () => {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<ChecklistProgress | null>(null);
  const { toast } = useToast();

  // Check auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ? { id: session.user.id } : null);
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { id: session.user.id } : null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load saved progress
  const loadProgress = useCallback(async (): Promise<string[] | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("checklist_results")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setLastSaved(data);
        return data.checked_items;
      }
      return null;
    } catch (error) {
      console.error("Error loading checklist progress:", error);
      return null;
    }
  }, [user]);

  // Save progress
  const saveProgress = useCallback(
    async (checkedItems: string[], score: number): Promise<boolean> => {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save your progress.",
          variant: "destructive",
        });
        return false;
      }

      setIsSaving(true);
      try {
        // Check if user already has a result
        const { data: existing } = await supabase
          .from("checklist_results")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        let result;
        if (existing) {
          // Update existing
          result = await supabase
            .from("checklist_results")
            .update({
              checked_items: checkedItems,
              score: score,
            })
            .eq("id", existing.id)
            .select()
            .single();
        } else {
          // Insert new
          result = await supabase
            .from("checklist_results")
            .insert({
              user_id: user.id,
              checked_items: checkedItems,
              score: score,
            })
            .select()
            .single();
        }

        if (result.error) throw result.error;

        setLastSaved(result.data);
        toast({
          title: "Progress saved!",
          description: "Your checklist results have been saved.",
        });
        return true;
      } catch (error) {
        console.error("Error saving checklist progress:", error);
        toast({
          title: "Error saving progress",
          description: "Could not save your progress. Please try again.",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [user, toast]
  );

  return {
    user,
    isLoading,
    isSaving,
    lastSaved,
    loadProgress,
    saveProgress,
  };
};
