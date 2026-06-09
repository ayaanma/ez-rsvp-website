import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | e-z.rsvp",
  description: "How e-z.rsvp handles account, event, location, and payment-related information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      kicker="Privacy"
      title="Privacy Policy"
      subtitle="A clear overview of what information e-z.rsvp uses to create safer, easier mystery-event experiences."
      updated="June 2026"
      sections={[
        {
          title: "Information we collect",
          body: [
            "When you use e-z.rsvp, we may collect information you provide directly, such as your name, email address, phone number, default address, category preferences, group choices, and RSVP activity.",
            "We may also use approximate location or address information that you enter into filters so we can estimate which mystery events fall inside your selected radius.",
          ],
        },
        {
          title: "How we use information",
          body: [
            "We use your information to help you create an account, sign in, find events, RSVP, join groups, manage preferences, and receive event-related updates.",
            "Location filters are used to calculate distance from available mystery-event locations. Hidden event addresses are not shown to users before reveal time.",
          ],
        },
        {
          title: "Payments and third-party services",
          body: [
            "If you purchase tickets, payment processing may be handled by Stripe. e-z.rsvp does not store full card numbers in the application.",
            "Authentication may be handled through services like Google and Supabase. Those providers may process information according to their own policies.",
          ],
        },
        {
          title: "Sharing and safety",
          body: [
            "We do not sell personal information. We may share limited information with service providers only when needed to operate core app functionality, such as authentication, payments, hosting, analytics, or safety review.",
            "We may use event, organizer, and account information to prevent abuse, investigate suspicious activity, and keep mystery-event experiences safe.",
          ],
        },
        {
          title: "Your choices",
          body: [
            "You can update account preferences from your account page. You can also log out, stop using the service, or request support related to account information." 
          ],
        },
      ]}
    />
  );
}
