import { useState, useCallback } from "react";
import { StripeEmbeddedCheckoutForm } from "@/components/StripeEmbeddedCheckout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CheckoutOptions {
  priceId: string;
  customerEmail?: string;
  userId?: string;
  returnUrl?: string;
  title?: string;
}

export function useStripeCheckout() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<CheckoutOptions | null>(null);

  const openCheckout = useCallback((opts: CheckoutOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);

  const checkoutElement = (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeCheckout()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{options?.title ?? "Completar pago"}</DialogTitle>
        </DialogHeader>
        {isOpen && options ? <StripeEmbeddedCheckoutForm {...options} /> : null}
      </DialogContent>
    </Dialog>
  );

  return { openCheckout, closeCheckout, isOpen, checkoutElement };
}