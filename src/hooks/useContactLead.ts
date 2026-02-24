import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContactLeadInput {
  project_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  message?: string;
  lead_type?: string;
}

export const useSubmitLead = () => {
  return useMutation({
    mutationFn: async (input: ContactLeadInput) => {
      const { error } = await supabase.from("contact_leads").insert(input);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("¡Mensaje enviado! Te contactaremos pronto.");
    },
    onError: () => {
      toast.error("Error al enviar. Intentá nuevamente.");
    },
  });
};
