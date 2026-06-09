import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Support | e-z.rsvp",
  description: "Get help with e-z.rsvp accounts, RSVPs, groups, tickets, and event questions.",
};

export default function SupportPage() {
  return (
    <>
      <LegalPage
        kicker="Help"
        title="Support"
        subtitle="Questions about an RSVP, ticket, group, account, or reveal? Start here."
        updated="June 2026"
        sections={[
          {
            title: "Account help",
            body: [
              "If you cannot sign in, try logging out fully, clearing old local session data, and signing in again with your chosen method.",
              "For account updates, visit your account settings page to review name, email, phone, preferences, and category choices.",
            ],
          },
          {
            title: "RSVP and ticket help",
            body: [
              "If a ticket purchase does not complete, check whether the checkout page opened and whether the payment provider confirmed the transaction.",
              "If the reveal countdown has ended but details are not visible, refresh the page or sign out and back in.",
            ],
          },
          {
            title: "Group help",
            body: [
              "Use Join with code to enter a group invite code. Group owners can manage or delete groups from the group detail overlay.",
              "If group status looks wrong, ask members to refresh their RSVP or group page.",
            ],
          },
          {
            title: "Contact support",
            body: [
              "For any reports regarding concerns, venue issues, or product bugs, please send an email to ayaansaeedmalik@gmail.com and matthewma256@gmail.com.",
            ],
          },
        ]}
      />
    </>
  );
}
