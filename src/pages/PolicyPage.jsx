function PolicyPage({ title, children }) {
  return (
    <div className="page">
      <section className="section">
        <h1>{title}</h1>
        <div className="summary-card">
          {children}
        </div>
      </section>
    </div>
  );
}

export default PolicyPage;
