type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageProps = {
  kicker: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
};

export function LegalPage({ kicker, title, subtitle, updated, sections }: LegalPageProps) {
  return (
    <main className="main-shell">
      <section className="section" style={{ paddingTop: 36 }}>
        <p className="page-kicker">{kicker}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </section>

      <section className="card" style={{ maxWidth: 900, margin: "0 auto" }}>
        <p className="small-label" style={{ marginTop: 0 }}>
          Last updated: {updated}
        </p>

        <div className="stack" style={{ marginTop: 26, gap: 30 }}>
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="section-title" style={{ fontSize: "clamp(1.45rem, 2.4vw, 2rem)", marginBottom: 12 }}>
                {section.title}
              </h2>

              <div className="stack" style={{ gap: 12 }}>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="section-copy">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
