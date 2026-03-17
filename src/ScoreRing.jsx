const ScoreRing = ({ score, verdict }) => {
  const r = 54, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#63ffb4" : score >= 50 ? "#ffd166" : score >= 30 ? "#ff9f43" : "#ff6b6b";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#1a1a2e" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 65 65)" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
        <text x="65" y="60" textAnchor="middle" fontSize="26" fontWeight="700" fill="white" fontFamily="'DM Mono', monospace">{score}</text>
        <text x="65" y="78" textAnchor="middle" fontSize="10" fill="#6666aa" fontFamily="'DM Sans', sans-serif">/ 100</text>
      </svg>
      <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color, fontFamily: "'DM Mono', monospace", padding: "4px 12px", border: `1px solid ${color}`, borderRadius: "20px", background: `${color}15` }}>{verdict}</span>
    </div>
  );
};
export default ScoreRing;
