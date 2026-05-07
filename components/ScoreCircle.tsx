interface ScoreCircleProps {
  score: number;
  status: 'Pre-Qualified' | 'Needs Review' | 'Not Qualified';
}

export default function ScoreCircle({ score, status }: ScoreCircleProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  // Determine color based on status
  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: '#42B0A8', text: 'text-[#42B0A8]' };
    if (score >= 60) return { stroke: '#f97316', text: 'text-[#f97316]' };
    return { stroke: '#ef4444', text: 'text-[#ef4444]' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
        {/* Background track */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="12"
        />
        {/* Progress arc */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${colors.text}`}>{score}%</span>
      </div>
    </div>
  );
}
