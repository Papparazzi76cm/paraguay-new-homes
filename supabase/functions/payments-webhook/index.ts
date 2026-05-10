import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient, getWebhookSecret } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "stripe-signature, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function upsertSubscription(env: StripeEnv, sub: any) {
  const stripe = createStripeClient(env);
  let userId = sub.metadata?.userId as string | undefined;
  if (!userId && sub.customer) {
    const customer = await stripe.customers.retrieve(sub.customer);
    if (!("deleted" in customer && customer.deleted)) {
      userId = (customer as any).metadata?.userId;
    }
  }
  if (!userId) {
    console.warn("No userId on subscription", sub.id);
    return;
  }

  const item = sub.items?.data?.[0];
  const stripePriceId = item?.price?.id;
  let priceLookupKey: string | null = null;
  let productId: string | null = item?.price?.product ?? null;
  if (stripePriceId) {
    const price = await stripe.prices.retrieve(stripePriceId);
    priceLookupKey = price.lookup_key ?? null;
    productId = (price.product as string) ?? productId;
  }

  const periodEnd = item?.current_period_end ?? sub.current_period_end;

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: sub.customer,
      stripe_subscription_id: sub.id,
      price_id: priceLookupKey,
      product_id: productId,
      status: sub.status,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
      environment: env,
    },
    { onConflict: "stripe_subscription_id" },
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const env = (url.searchParams.get("env") ?? "sandbox") as StripeEnv;
  if (env !== "sandbox" && env !== "live") {
    return new Response("Invalid env", { status: 400 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const rawBody = await req.text();
  const stripe = createStripeClient(env);
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      getWebhookSecret(env),
    );
  } catch (err) {
    console.error("Signature verification failed", err);
    return new Response("Bad signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "subscription.created":
      case "subscription.updated":
      case "subscription.canceled":
        await upsertSubscription(env, event.data.object);
        break;
      case "checkout.session.completed": {
        const session = event.data.object as any;
        if (session.mode === "subscription" && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          await upsertSubscription(env, sub);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error", err);
    return new Response("Handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});