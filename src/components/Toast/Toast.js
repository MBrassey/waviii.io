import React from "react";
import { useWallet } from "../../providers/WalletProvider";

export default function Toast() {
  const ctx = useWallet();
  if (!ctx || !ctx.toast) return null;
  const { type, message } = ctx.toast;
  return (
    <div className={`dex-toast dex-toast-${type}`} role="status">
      <span className="dex-toast-dot" />
      <span className="dex-toast-msg">{message}</span>
      <button className="dex-toast-x" onClick={ctx.dismissToast} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
