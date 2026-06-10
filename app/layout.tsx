import type { Metadata } from "next";
import "./globals.css";
import "./ui-repair.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProfileOverlayRoot } from "@/components/ProfileOverlayRoot";

export const metadata: Metadata = {
  title: "e-z.rsvp",
  description: "Surprise local events revealed two hours before they begin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <Navbar />
          <ProfileOverlayRoot />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
