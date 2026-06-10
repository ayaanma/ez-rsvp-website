import styles from "./download.module.css";

const screenshots = [
  { src: "/app-images/img1.PNG", alt: "e-z.rsvp app mystery event discovery screen" },
  { src: "/app-images/img2.PNG", alt: "e-z.rsvp app event reveal screen" },
  { src: "/app-images/img3.PNG", alt: "e-z.rsvp app social plans screen" },
];

const infoRows = [
  ["Seller", "e-z.rsvp"],
  ["Category", "Lifestyle"],
  ["Compatibility", "iPhone"],
  ["Languages", "English"],
  ["Age Rating", "17+"],
];

export default function DownloadPage() {
  return (
    <main className={styles.pageShell}>
      <section className={styles.storePanel}>
        <div className={styles.heroGrid}>
          <div className={styles.iconWrap}>
            <img className={styles.appIcon} src="/app-images/logo.png" alt="e-z.rsvp app icon" />
          </div>

          <div className={styles.appSummary}>
            <div>
              <p className={styles.eyebrow}>Coming soon on iPhone</p>
              <h1>e-z.rsvp</h1>
              <p className={styles.subtitle}>Mystery plans, easy tickets, and social reveals.</p>
              <p className={styles.developer}>e-z.rsvp, Inc.</p>
            </div>

            <button className={styles.downloadButton} type="button">
              Notify me
            </button>
          </div>
        </div>

        <div className={styles.statsGrid} aria-label="App highlights">
          <div className={styles.statItem}>
            <p>4.9</p>
            <span>★★★★★</span>
          </div>
          <div className={styles.statItem}>
            <p>17+</p>
            <span>Age</span>
          </div>
          <div className={styles.statItem}>
            <p>#12</p>
            <span>Lifestyle</span>
          </div>
          <div className={styles.statItem}>
            <p>Free</p>
            <span>Download</span>
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <h2>Preview</h2>
          <span>iPhone</span>
        </div>
        <div className={styles.screenshotRail}>
          {screenshots.map((screenshot) => (
            <div className={styles.phoneFrame} key={screenshot.src}>
              <img src={screenshot.src} alt={screenshot.alt} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.editorialGrid}>
        <article className={styles.sectionCard}>
          <h2>About this app</h2>
          <p>
            Pick the date, time, budget, radius, and vibe. e-z.rsvp handles the rest by matching you to a mystery
            event that stays hidden until reveal time.
          </p>
          <p>
            Join solo, coordinate with friends, track clues, and discover plans without overthinking where to go next.
          </p>
        </article>

        <article className={styles.sectionCard}>
          <h2>What’s New</h2>
          <p className={styles.versionText}>Version 1.0</p>
          <p>Early access preview with mystery ticket discovery, social planning, group coordination, and profile tools.</p>
        </article>
      </section>

      <section className={styles.sectionCard}>
        <h2>App Privacy</h2>
        <p>
          The developer indicates that location preferences, account details, and RSVP activity may be used to power
          recommendations, safety features, and social planning.
        </p>
        <div className={styles.privacyGrid}>
          <div>
            <span>Location</span>
            <p>Used for radius-based event matching</p>
          </div>
          <div>
            <span>Contact Info</span>
            <p>Used for account and safety features</p>
          </div>
          <div>
            <span>Purchases</span>
            <p>Used for ticket checkout and RSVP history</p>
          </div>
        </div>
      </section>

      <section className={styles.sectionCard}>
        <h2>Information</h2>
        <div className={styles.infoList}>
          {infoRows.map(([label, value]) => (
            <div className={styles.infoRow} key={label}>
              <span>{label}</span>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
