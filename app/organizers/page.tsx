export default function OrganizersPage() {
  return (
    <main className="main-shell">
      <h1 className="page-title">Organizer submission.</h1>
      <p className="page-kicker">Submit a verified public event for future mystery RSVPs.</p>
      <section className="card" style={{maxWidth:820, margin:"0 auto"}}>
        <div className="grid-2">
          <div className="form-section"><label className="small-label">Event name</label><input className="input" /></div>
          <div className="form-section"><label className="small-label">Category</label><select className="select"><option>Music</option><option>Dining</option><option>Culture</option></select></div>
          <div className="form-section"><label className="small-label">Date/time</label><input className="input" type="datetime-local" /></div>
          <div className="form-section"><label className="small-label">Venue</label><input className="input" /></div>
          <div className="form-section"><label className="small-label">Price</label><input className="input" type="number" /></div>
          <div className="form-section"><label className="small-label">Capacity</label><input className="input" type="number" /></div>
        </div>
        <div className="form-section"><label className="small-label">Safety notes</label><textarea className="textarea" rows={5} /></div>
        <button className="btn btn-primary">Submit event</button>
      </section>
    </main>
  );
}
