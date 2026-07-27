const StatCard = ({ label, value, tone = "blue" }) => (
  <section className={`stat-card ${tone}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </section>
);

export default StatCard;
