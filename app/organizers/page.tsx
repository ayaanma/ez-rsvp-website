"use client";

import { useState } from "react";
import { categories } from "@/lib/mock-data";
import styles from "./organizers.module.css";

export default function OrganizersPage() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState(categories[0] ?? "food");

  return (
    <main className="main-shell">
      <section className={styles.heroSection}>
        <p className="page-kicker">For organizers.</p>
        <h1 className="page-title">Organizer submission.</h1>
        <p className="page-subtitle">
          Submit your event and venue for our team to verify and list it. This process may take up to 5 days.
        </p>
      </section>

      <section className={styles.formCard}>
        <div className={styles.formGrid}>
          <label className={styles.fieldGroup}>
            <span className="small-label">Event name</span>
            <input className="input" placeholder="Ex: Sunset social night" />
          </label>

          <div className={styles.fieldGroup}>
            <span className="small-label">Category</span>
            <div
              className={`${styles.customSelect} ${categoryOpen ? styles.customSelectOpen : ""}`}
              tabIndex={0}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setCategoryOpen(false);
                }
              }}
            >
              <button
                type="button"
                className={styles.customSelectTrigger}
                aria-haspopup="listbox"
                aria-expanded={categoryOpen}
                onClick={() => setCategoryOpen((current) => !current)}
              >
                <span>{category}</span>
                <span className={styles.customSelectArrow} aria-hidden="true">
                  ▾
                </span>
              </button>

              {categoryOpen && (
                <div className={styles.customSelectMenu} role="listbox">
                  {categories.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.customSelectOption} ${category === option ? styles.customSelectOptionSelected : ""}`}
                      role="option"
                      aria-selected={category === option}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setCategory(option);
                        setCategoryOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <label className={styles.fieldGroup}>
            <span className="small-label">Date/time</span>
            <input className="input" type="datetime-local" />
          </label>

          <label className={styles.fieldGroup}>
            <span className="small-label">Venue</span>
            <input className="input" placeholder="Venue name and address" />
          </label>

          <label className={styles.fieldGroup}>
            <span className="small-label">Price</span>
            <input className="input" type="number" min="0" placeholder="Ex: 35" />
          </label>

          <label className={styles.fieldGroup}>
            <span className="small-label">Capacity</span>
            <input className="input" type="number" min="1" placeholder="Ex: 75" />
          </label>

          <label className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <span className="small-label">Safety notes</span>
            <textarea className="input" rows={5} placeholder="Share entry rules, accessibility notes, staffing, age restrictions, or safety details." />
          </label>
        </div>

        <button className="btn btn-primary" type="button">
          Submit event
        </button>
      </section>
    </main>
  );
}
