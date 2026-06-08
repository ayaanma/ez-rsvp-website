"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { FAQSection } from "@/components/FAQSection";
import { RSVPCard } from "@/components/RSVPCard";
import { events } from "@/lib/mock-data";
import { isLoggedIn } from "@/lib/auth-client";

export default function HomePage() {
  const previewEvent = events[2];
  const anticipationEvent = events[0];
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const syncAuth = () => setAuthenticated(isLoggedIn());
    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("ez-auth-change", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("ez-auth-change", syncAuth);
    };
  }, []);

  const getStartedHref: Route = authenticated ? "/dashboard" : "/signup";

  return (
    <main className="main-shell home-page">
      <section className="hero">
        <div>
          <h1>
            RSVP now. Find out where <span className="later-blue">later.</span>
          </h1>
          <p>
            It&apos;s time to make going out easy. It&apos;s our job to plan the events.
            All you have to do is show up.
          </p>
          <div className="hero-actions">
            <Link href={getStartedHref} className="btn btn-primary">
              Let&apos;s get started →
            </Link>
            <span className="or-text">or</span>
            <Link href="/download" className="app-store-link" aria-label="Download in the App Store">
              <Image
                src="/homepage-images/app_store_badge.svg"
                alt="Download on the App Store"
                width={160}
                height={52}
                priority
              />
            </Link>
          </div>
        </div>

        <div className="showcase-card plain-showcase">
          <RSVPCard
            event={{ ...previewEvent, imageUrl: undefined, imageBlurred: false }}
            locked
            hideCategory
            hiddenTitle="Your next adventure."
          />
        </div>
      </section>

      <section className="section planning-section">
        <div className="section-head">
          <h2 className="section-title">
            Planning is hard. We<br />make it e-z.
          </h2>
          <p className="section-copy">
            e-z.rsvp makes going out a much more stress-free, streamlined experience.
            Choose your timing, budget, and relative location, and we&apos;ll handle venues,
            activities, and everything in between. You can get all the fun of spontaneity
            without the stress of planning every detail.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">How it works</h2>
          <p className="section-copy">
            The process is simple. The experience feels spontaneous, safe, and memorable.
          </p>
        </div>
        <div className="grid-3">
          <article className="card">
            <div className="step-number">1</div>
            <h3>Set preferences</h3>
            <p className="section-copy">Pick location, budget, timing, and vibe.</p>
          </article>
          <article className="card">
            <div className="step-number">2</div>
            <h3>Secure your spot</h3>
            <p className="section-copy">RSVP to a mystery event that fits your limits.</p>
          </article>
          <article className="card">
            <div className="step-number">3</div>
            <h3>Reveal the surprise</h3>
            <p className="section-copy">The venue and exact details unlock two hours before.</p>
          </article>
        </div>
      </section>

      <section className="section dashboard-grid">
        <div>
          <h2 className="section-title">Anticipation is part of the experience.</h2>
          <p className="section-copy">
            Mystery cards keep details hidden until the right moment. You always know the
            price, safety rules, and your hard limits before committing.
          </p>
          <div className="chip-row" style={{ marginTop: 22 }}>
            <span className="chip">Public venues only</span>
            <span className="chip">Verified organizers</span>
            <span className="chip">Hard budget limits</span>
          </div>
        </div>
        <RSVPCard event={anticipationEvent} locked hideCategory hiddenTitle="Awaiting reveal." />
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Safety &amp; Trust</h2>
        </div>
        <div className="grid-2">
          <article className="card">
            <div className="step-number icon-circle">
              <Image src="/homepage-images/eye.svg" alt="" width={26} height={26} />
            </div>
            <h3>Public venues only</h3>
            <p className="section-copy">
              No unsafe or private locations. Every plan is hosted at a vetted public space.
            </p>
          </article>
          <article className="card">
            <div className="step-number icon-circle">
              <Image src="/homepage-images/shield.svg" alt="" width={26} height={26} />
            </div>
            <h3>Verified organizers</h3>
            <p className="section-copy">
              Organizer details, capacity, age rules, and accessibility notes are tracked for every event.
            </p>
          </article>
        </div>
      </section>

      <FAQSection />
    </main>
  );
}
