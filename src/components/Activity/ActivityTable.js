import React from "react";
import moment from "moment";
import { shortAddress } from "../../utils/wallet";

const directionLabel = (isIn) => (isIn ? "IN" : "OUT");

export default function ActivityTable({ account, transactions }) {
  if (!transactions || !transactions.length) {
    return (
      <div className="dex-activity-empty">
        <span>No activity yet</span>
      </div>
    );
  }

  const rows = [...transactions].sort(
    (a, b) => (b.blockNumber || 0) - (a.blockNumber || 0)
  );

  return (
    <div className="dex-activity">
      <div className="dex-activity-head">
        <div>Type</div>
        <div>Counterparty</div>
        <div className="dex-activity-right">Amount</div>
        <div className="dex-activity-right">Block</div>
      </div>
      <div className="dex-activity-body">
        {rows.map((tx) => {
          const isIn =
            tx.returnValues &&
            tx.returnValues.to &&
            tx.returnValues.to.toLowerCase() === (account || "").toLowerCase();
          const counterparty = isIn ? tx.returnValues.from : tx.returnValues.to;
          const amount =
            tx.returnValues && tx.returnValues.value
              ? window.web3.utils.fromWei(tx.returnValues.value.toString(), "Ether")
              : "0";
          const fmt = Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          });
          const ts = tx.blockTimestamp
            ? moment.unix(tx.blockTimestamp).fromNow()
            : null;

          return (
            <a
              key={tx.transactionHash + tx.logIndex}
              className="dex-activity-row"
              href={`https://etherscan.io/tx/${tx.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <span
                  className={`dex-pill ${
                    isIn ? "dex-pill-in" : "dex-pill-out"
                  }`}
                >
                  {directionLabel(isIn)}
                </span>
              </div>
              <div className="dex-mono">{shortAddress(counterparty)}</div>
              <div
                className={`dex-activity-right dex-mono ${
                  isIn ? "dex-amount-in" : "dex-amount-out"
                }`}
              >
                {isIn ? "+" : "−"}
                {fmt}
              </div>
              <div className="dex-activity-right dex-mono dex-muted">
                {ts || `#${tx.blockNumber}`}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
