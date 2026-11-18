export function SkeletonGrid({ n = 6 }) {
  return (
    <div className="grid" style={{ marginTop: 22 }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="card skel-card">
          <div className="skel" style={{ height: 100, marginBottom: 16 }} />
          <div className="skel" style={{ height: 14, width: "40%", marginBottom: 12 }} />
          <div className="skel" style={{ height: 20, width: "80%", marginBottom: 12 }} />
          <div className="skel" style={{ height: 12, marginBottom: 8 }} />
          <div className="skel" style={{ height: 12, width: "70%" }} />
        </div>
      ))}
    </div>
  );
}
