"use client";

import { useState } from "react";

const faqs = [
  ["What happens if I don't like the revealed location?", "You can cancel within the posted rules, and future matching learns from your feedback."],
  ["Can I go with a group?", "Yes. Groups can join with shared codes and see which friends are attending a mystery event."],
  ["Are there hidden fees?", "No. You set hard price limits before RSVP'ing, and anything paid is shown before confirmation."]
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Frequently Asked Questions</h2>
      </div>
      <div className="faq-list">
        {faqs.map(([q, a], index) => {
          const open = openIndex === index;
          return (
            <div className={`faq ${open ? "open" : ""}`} key={q}>
              <button
                className="faq-trigger"
                type="button"
                onClick={() => setOpenIndex((current) => current === index ? null : index)}
                aria-expanded={open}
                aria-controls={`faq-panel-${index}`}
              >
                <span>{q}</span>
                <span className="faq-plus" aria-hidden="true">+</span>
              </button>
              <div id={`faq-panel-${index}`} className="faq-panel" aria-hidden={!open}>
                <div className="faq-panel-inner">
                  <p>{a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
