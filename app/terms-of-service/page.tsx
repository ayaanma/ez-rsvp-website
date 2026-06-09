import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | e-z.rsvp",
  description: "Terms for using the e-z.rsvp mystery-event platform.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      kicker="Terms"
      title="Terms of Service"
      subtitle="The basic rules for using e-z.rsvp, joining groups, and reserving mystery events."
      updated="June 2026"
      sections={[
        {
          title: "Using e-z.rsvp",
          body: [
            "e-z.rsvp helps users discover and RSVP to mystery events based on timing, budget, location radius, and broad preferences.",
            "By using the service, you agree to provide accurate information, follow event rules, and use the platform responsibly.",
          ],
        },
        {
          title: "Mystery-event details",
          body: [
            "Some event details may remain hidden until the reveal window. You understand that the exact venue, event name, or activity may not be visible at the time you RSVP.",
            "Event cards may show limited information such as price, remaining tickets, category, timing, safety notes, and reveal countdowns.",
          ],
        },
        {
          title: "Payments and reservations",
          body: [
            "Purchases may be processed through Stripe or another payment provider. Ticket prices, refunds, and cancellation windows may vary depending on event rules and organizer requirements.",
            "A reservation is not guaranteed until the purchase or RSVP flow is completed successfully.",
          ],
        },
        {
          title: "Groups and conduct",
          body: [
            "Users may create groups, join groups with codes, leave groups, and share event plans with friends. You are responsible for how you use group codes and shared information.",
            "You may not use e-z.rsvp to harass others, bypass event safety rules, misuse hidden venue information, or interfere with other users’ experiences.",
          ],
        },
      ]}
    />
  );
}
