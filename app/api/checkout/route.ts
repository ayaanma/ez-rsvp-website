import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as {
    eventId?: string;
    name?: string;
    price?: number;
    description?: string;
  } | null;

  if (!body?.name || typeof body.price !== "number") {
    return NextResponse.json({ error: "Missing ticket information." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json({
      demo: true,
      url: `/dashboard?checkout=demo&eventId=${encodeURIComponent(body.eventId ?? "event")}`
    });
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${siteUrl}/dashboard?checkout=success&eventId=${encodeURIComponent(body.eventId ?? "event")}`);
  params.set("cancel_url", `${siteUrl}/create-rsvp?checkout=cancelled`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(Math.max(0, Math.round(body.price * 100))));
  params.set("line_items[0][price_data][product_data][name]", body.name);
  params.set("line_items[0][price_data][product_data][description]", body.description || "e-z.rsvp ticket");

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const data = await stripeResponse.json().catch(() => ({}));

  if (!stripeResponse.ok) {
    return NextResponse.json({ error: data.error?.message || "Stripe checkout failed." }, { status: stripeResponse.status });
  }

  return NextResponse.json({ url: data.url });
}
