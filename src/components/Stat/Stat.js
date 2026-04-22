import React from "react";
import CountUp from "react-countup";

const fmtPct = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

export default function Stat({ label, value, prefix = "", decimals = 2, change, loading }) {
  const changeClass =
    change === undefined || change === null
      ? ""
      : change >= 0
      ? "dex-stat-pos"
      : "dex-stat-neg";
  return (
    <div className="dex-stat">
      <div className="dex-stat-label">{label}</div>
      <div className="dex-stat-value">
        {loading ? (
          <span className="dex-stat-skel">—</span>
        ) : (
          <>
            {prefix}
            <CountUp
              duration={1.2}
              start={0}
              end={Number(value) || 0}
              decimals={decimals}
              decimal="."
              separator=","
            />
          </>
        )}
      </div>
      {change !== undefined && change !== null && !loading && (
        <div className={`dex-stat-change ${changeClass}`}>{fmtPct(change)}</div>
      )}
    </div>
  );
}
