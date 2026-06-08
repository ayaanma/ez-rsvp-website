import { NextResponse } from "next/server";
import Stripe from "stripe";
import { events } from "@/lib/mock-data";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { eventId } = (await request.json()) as { eventId?: string };
  const event = events.find((item) => item.id === eventId);

  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const appUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, "https://") ??
    "http://localhost:3000";

  if (!secretKey) {
    return NextResponse.json({
      demo: true,
      message:
        "Demo purchase complete. Add STRIPE_SECRET_KEY to enable real Stripe Checkout.",
    });
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.max(0, Math.round(event.price * 100)),
          product_data: {
            name: event.name === "Location Hidden" ? "Mystery RSVP ticket" : event.name,
            description: event.description,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      eventId: event.id,
      source: "ez-rsvp",
    },
    success_url: `${appUrl}/dashboard?checkout=success&event=${event.id}`,
    cancel_url: `${appUrl}/create-rsvp?checkout=cancelled&event=${event.id}`,
  });

  return NextResponse.json({ url: session.url });
}
