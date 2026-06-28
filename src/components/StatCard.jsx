export default function StatCard({ icon, value, label, color = 'var(--color-accent-primary)', gradient }) {
  return (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div
        className="stat-icon"
        style={{ background: gradient || `linear-gradient(135deg, ${color}33, ${color}11)`, color }}
      >
        {icon}
      </div>
      <div>
        <div className="stat-value">{value ?? '—'}</div>
        <div className="stat-label">{label}</div>
      </div>
      <div
        style={{
          position: 'absolute', top: -30, right: -30, width: 100, height: 100,
          borderRadius: '50%', background: color, opacity: 0.06,
        }}
      />
    </div>
  );
}
