import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/mock-data";

const STRIPE_DESCRIPTION = "It's time to get ready for the best event of your life.";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { eventId?: string; price?: number }
    | null;

  const event = body?.eventId
    ? events.find((item) => item.id === body.eventId)
    : null;

  const price = typeof body?.price === "number" ? body.price : event?.price;

  if (typeof price !== "number") {
    return NextResponse.json(
      { error: "Missing ticket information." },
      { status: 400 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel to enable checkout.",
      },
      { status: 501 }
    );
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set(
    "success_url",
    `${siteUrl}/dashboard?checkout=success&eventId=${encodeURIComponent(
      body?.eventId ?? "event"
    )}`
  );
  params.set("cancel_url", `${siteUrl}/create-rsvp?checkout=cancelled`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set(
    "line_items[0][price_data][unit_amount]",
    String(Math.max(50, Math.round(price * 100)))
  );
  params.set("line_items[0][price_data][product_data][name]", "Event Ticket");
  params.set(
    "line_items[0][price_data][product_data][description]",
    STRIPE_DESCRIPTION
  );

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await stripeResponse.json().catch(() => ({}));

  if (!stripeResponse.ok || !data.url) {
    return NextResponse.json(
      { error: data.error?.message || "Stripe checkout failed." },
      { status: stripeResponse.status || 500 }
    );
  }

  return NextResponse.json({ url: data.url });
}
