import React, { useEffect, useState } from "react";

interface TimerGraphicProps {
  startTime: number | null;
}

const TimerGraphic: React.FC<TimerGraphicProps> = ({ startTime }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const now = Date.now();
  const elapsed = startTime ? now - startTime : 0;
  const totalMs = 24 * 60 * 60 * 1000;

  // Overall 24h progress: outer ring (Blue) smoothly filled
  const hoursElapsedRaw = Math.min(elapsed / (60 * 60 * 1000), 24);
  const hoursAngle = (hoursElapsedRaw / 24) * 360;

  // Hours remaining for display (24:00 down to 00:00)
  const remainingMs = Math.max(0, totalMs - elapsed);
  const hoursRemaining = Math.floor(remainingMs / (60 * 60 * 1000));
  const minutesRemaining = Math.floor(
    (remainingMs % (60 * 60 * 1000)) / (60 * 1000)
  );

  // Minute sweep: middle ring (Green) fills 0-60 mins
  const minutesElapsedRaw = (elapsed % (60 * 60 * 1000)) / (60 * 1000);
  const minutesAngle = (minutesElapsedRaw / 60) * 360;

  // Seconds sweep: inner ring (Gray) fills 0-60 secs smoothly
  const secondsElapsedRaw = (elapsed % 60000) / 1000;
  const secondsAngle = (secondsElapsedRaw / 60) * 360;

  const CENTER = 124;
  const RADIUS_OUTER = 110;
  const RADIUS_MID = 90;
  const RADIUS_INNER = 70;
  const STROKE = 11;

  // Helper function to calculate arc path perimeter only
  const arcPath = (radius: number, angle: number) => {
    if (angle <= 0.001) return "";
    if (angle >= 359.99) {
      return `M ${CENTER} ${
        CENTER - radius
      } A ${radius} ${radius} 0 1 1 ${CENTER} ${
        CENTER + radius
      } A ${radius} ${radius} 0 1 1 ${CENTER} ${CENTER - radius}`;
    }

    const radians = (angle * Math.PI) / 180;
    const x = CENTER + radius * Math.cos(radians - Math.PI / 2);
    const y = CENTER + radius * Math.sin(radians - Math.PI / 2);
    const largeArc = angle > 180 ? 1 : 0;
    return `M ${CENTER} ${
      CENTER - radius
    } A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}`;
  };

  // Helper function to calculate dot position
  const dotPosition = (radius: number, angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: CENTER + radius * Math.cos(radians - Math.PI / 2),
      y: CENTER + radius * Math.sin(radians - Math.PI / 2),
    };
  };

  return (
    <div className="flex justify-center">
      <svg
        width="248"
        height="248"
        viewBox="0 0 248 248"
        style={{ display: "block" }}
      >
        {/* OUTER RING - Blue (Hours) */}
        {/* Background track */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS_OUTER}
          fill="none"
          stroke="#0F172A"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        {/* Arc */}
        <path
          d={arcPath(RADIUS_OUTER, hoursAngle)}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        {/* Endpoint dot */}
        {hoursAngle > 0 &&
          (() => {
            const pos = dotPosition(RADIUS_OUTER, hoursAngle);
            return (
              <>
                <circle cx={pos.x} cy={pos.y} r="4.5" fill="#3B82F6" />
                <circle cx={pos.x} cy={pos.y} r="2.5" fill="#1E293B" />
              </>
            );
          })()}

        {/* MIDDLE RING - Green (Tasks) */}
        {/* Background track */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS_MID}
          fill="none"
          stroke="#0F172A"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        {/* Arc */}
        <path
          d={arcPath(RADIUS_MID, minutesAngle)}
          fill="none"
          stroke="#22C55E"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        {/* Endpoint dot */}
        {minutesAngle > 0 &&
          (() => {
            const pos = dotPosition(RADIUS_MID, minutesAngle);
            return (
              <>
                <circle cx={pos.x} cy={pos.y} r="4.5" fill="#22C55E" />
                <circle cx={pos.x} cy={pos.y} r="2.5" fill="#1E293B" />
              </>
            );
          })()}

        {/* INNER RING - Gray (Seconds) */}
        {/* Background track */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS_INNER}
          fill="none"
          stroke="#0F172A"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        {/* Arc */}
        <path
          d={arcPath(RADIUS_INNER, secondsAngle)}
          fill="none"
          stroke="#334155"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        {/* Endpoint dot */}
        {secondsAngle > 0 &&
          (() => {
            const pos = dotPosition(RADIUS_INNER, secondsAngle);
            return (
              <>
                <circle cx={pos.x} cy={pos.y} r="4.5" fill="#334155" />
                <circle cx={pos.x} cy={pos.y} r="2.5" fill="#1E293B" />
              </>
            );
          })()}

        {/* CENTER TEXT */}
        <text
          x={CENTER}
          y={CENTER - 8}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="32"
          fontWeight="700"
          fill="#F1F5F9"
          fontFamily="Inter, sans-serif"
          style={{ fontVariantNumeric: "tabular-nums" } as React.CSSProperties}
        >
          {String(hoursRemaining).padStart(2, "0")}:
          {String(minutesRemaining).padStart(2, "0")}
        </text>

        {/* UNIT LABEL */}
        <text
          x={CENTER}
          y={CENTER + 22.5}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10"
          fill="#475569"
          fontFamily="Inter, sans-serif"
          letterSpacing="0.12em"
          style={{ textTransform: "uppercase" } as React.CSSProperties}
        >
          hrs remaining
        </text>
      </svg>
    </div>
  );
};

export default TimerGraphic;
