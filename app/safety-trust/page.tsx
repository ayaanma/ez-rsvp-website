import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Safety & Trust | e-z.rsvp",
  description: "How e-z.rsvp approaches safe, reliable mystery-event planning.",
};

export default function SafetyTrustPage() {
  return (
    <LegalPage
      kicker="Safety"
      title="Safety & Trust"
      subtitle="Mystery should be fun, not risky. These are the principles behind the e-z.rsvp experience."
      updated="June 2026"
      sections={[
        {
          title: "Public venues only",
          body: [
            "e-z.rsvp is designed around public, established venues and experiences rather than private or unsafe locations.",
            "Hidden details should never mean hidden risk. The goal is to preserve surprise while keeping core safety boundaries clear.",
          ],
        },
        {
          title: "Verified organizer information",
          body: [
            "Events can include organizer details, capacity limits, age requirements, safety notes, accessibility notes, and dress-code expectations.",
            "Organizer and event information should be reviewed before experiences are made available to users.",
          ],
        },
        {
          title: "Budget and distance boundaries",
          body: [
            "Users can set maximum ticket price and location-radius preferences before RSVP. The app should respect those boundaries when matching events.",
            "Internal event addresses may be used for distance calculations, while the user-facing location can remain hidden until reveal time.",
          ],
        },
        {
          title: "Group transparency",
          body: [
            "Groups help users coordinate with friends, see RSVP statuses, and plan shared mystery experiences.",
            "Group codes should be shared only with people the group wants to invite.",
          ],
        },
        {
          title: "Report concerns",
          body: [
            "If something feels inaccurate, unsafe, or suspicious, users should contact support before attending the event.",
            "For emergencies or immediate safety concerns, contact local emergency services first.",
          ],
        },
      ]}
    />
  );
}
