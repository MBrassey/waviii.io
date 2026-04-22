import React, { useEffect, useState } from "react";
import FadeIn from "react-fade-in";
import CountUp from "react-countup";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import waviiiLogo from "../assets/img/i3.png";
import ActivityTable from "../components/Activity/ActivityTable";
import { useWallet } from "../providers/WalletProvider";
import { shortAddress, copyToClipboard, chainName } from "../utils/wallet";

const toEth = (wei) => {
  if (!window.web3 || !window.web3.utils) return 0;
  try {
    return Number(window.web3.utils.fromWei(String(wei || "0"), "Ether"));
  } catch {
    return 0;
  }
};

export default function Wallet() {
  const w = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txs, setTxs] = useState([]);
  const [loadingTxs, setLoadingTxs] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [copied, setCopied] = useState(false);

  const connected = w.status === "ready" && w.isMainnet && !!w.account;

  useEffect(() => {
    if (!connected) {
      setTxs([]);
      return;
    }
    let cancelled = false;
    setLoadingTxs(true);
    w.getTransferEvents().then((events) => {
      if (!cancelled) {
        setTxs(events);
        setLoadingTxs(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [connected, w.account, w.tx.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const onCopy = async () => {
    if (!connected) return;
    const ok = await copyToClipboard(w.account);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const balance = toEth(w.tokenBalance);
  const busy = w.tx.phase !== "idle";

  let btnLabel;
  let btnAction;
  let btnDisabled = false;

  if (w.status === "detecting") {
    btnLabel = "Loading…";
    btnDisabled = true;
  } else if (w.status === "no-provider") {
    btnLabel = "Install MetaMask";
    btnAction = () =>
      window.open("https://metamask.io/download.html", "_blank", "noopener");
  } else if (w.status === "disconnected" || !w.account) {
    btnLabel = w.status === "connecting" ? "Connecting…" : "Connect Wallet";
    btnAction = w.connect;
    btnDisabled = w.status === "connecting";
  } else if (!w.isMainnet) {
    btnLabel = "Switch to Ethereum";
    btnAction = w.switchMainnet;
  } else if (busy) {
    btnLabel = w.tx.phase === "sending" ? "Sending…" : "Pending…";
    btnDisabled = true;
  } else {
    btnLabel = "Send";
  }

  const onSend = async (e) => {
    e.preventDefault();
    if (btnDisabled) return;
    if (btnAction) {
      btnAction();
      return;
    }
    setLocalError(null);
    const to = recipient.trim();
    const amt = amount.trim();
    if (!window.web3.utils.isAddress(to)) {
      setLocalError("Invalid recipient address");
      return;
    }
    const n = parseFloat(amt);
    if (!isFinite(n) || n <= 0) {
      setLocalError("Enter an amount greater than 0");
      return;
    }
    if (n > balance) {
      setLocalError("Insufficient balance");
      return;
    }
    const wei = window.web3.utils.toWei(String(n), "Ether");
    const ok = await w.sendTransfer(to, wei);
    if (ok) {
      setRecipient("");
      setAmount("");
    }
  };

  const statusBadge = (() => {
    if (w.status === "detecting")
      return { cls: "is-idle", text: "Detecting wallet" };
    if (w.status === "no-provider")
      return { cls: "is-wrong", text: "No wallet detected" };
    if (w.status === "disconnected" || !w.account)
      return { cls: "is-idle", text: "Not connected" };
    if (!w.isMainnet)
      return {
        cls: "is-wrong",
        text: `Wrong network · ${chainName(w.chainId)}`,
      };
    return null;
  })();

  const addressLabel = connected ? shortAddress(w.account) : "Not connected";

  return (
    <div className="content dex-page">
      <Row>
        <Col md="12">
          <Card className="dex-card dex-wallet-card">
            <CardBody className="dex-page-body">
              {statusBadge && (
                <div className={`dex-status-banner ${statusBadge.cls}`}>
                  <span className="dex-net-dot" />
                  <span>{statusBadge.text}</span>
                </div>
              )}

              <FadeIn>
                <div className="dex-balance-hero">
                  <img src={waviiiLogo} alt="waviii" className="dex-balance-logo" />
                  <div className="dex-balance-num waviii">
                    {connected ? (
                      <CountUp
                        duration={1.4}
                        start={0}
                        end={balance}
                        decimals={2}
                        decimal="."
                        separator=","
                        preserveValue
                      />
                    ) : (
                      <span className="dex-balance-idle">—</span>
                    )}
                  </div>
                  <div className="dex-balance-ticker">waviii</div>
                  <button
                    type="button"
                    className={`dex-address-chip ${copied ? "is-copied" : ""}`}
                    onClick={onCopy}
                    title={connected ? "Copy address" : "Not connected"}
                    disabled={!connected}
                  >
                    <span className="dex-mono">{addressLabel}</span>
                    {connected && (
                      <span className="dex-copy-hint">
                        {copied ? "Copied" : "Copy"}
                      </span>
                    )}
                  </button>
                </div>
              </FadeIn>

              <FadeIn>
                <Card className="dex-card">
                  <CardBody>
                    <div className="dex-send-title waviii">Send waviii</div>
                    <form className="dex-send-form" onSubmit={onSend}>
                      <div className="dex-field">
                        <label className="dex-field-label">Recipient</label>
                        <input
                          className="dex-input dex-mono"
                          placeholder="0x…"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          autoComplete="off"
                          spellCheck="false"
                          disabled={!connected}
                        />
                      </div>
                      <div className="dex-field">
                        <div className="dex-field-top">
                          <label className="dex-field-label">Amount</label>
                          <button
                            type="button"
                            className="dex-link-btn"
                            onClick={() => setAmount(String(balance))}
                            disabled={!connected}
                          >
                            Max{" "}
                            {connected
                              ? balance.toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                })
                              : "—"}
                          </button>
                        </div>
                        <input
                          className="dex-input"
                          placeholder="0.00"
                          type="text"
                          inputMode="decimal"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          disabled={!connected}
                        />
                      </div>
                      {localError && <div className="dex-error">{localError}</div>}
                      {w.tx.error && <div className="dex-error">{w.tx.error}</div>}
                      <button
                        type="submit"
                        disabled={btnDisabled}
                        className="dex-btn dex-btn-primary dex-btn-block"
                      >
                        {btnLabel}
                      </button>
                      {w.tx.hash && busy && (
                        <a
                          className="dex-tx-link"
                          href={`https://etherscan.io/tx/${w.tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View pending transaction ↗
                        </a>
                      )}
                    </form>
                  </CardBody>
                </Card>
              </FadeIn>

              <FadeIn>
                <Card className="dex-card">
                  <CardHeader>
                    <div className="dex-section-title waviii">
                      <span className="drop-item">Activity</span>
                    </div>
                  </CardHeader>
                  <CardBody>
                    {!connected ? (
                      <div className="dex-activity-empty">
                        Connect your wallet to see transaction history.
                      </div>
                    ) : loadingTxs ? (
                      <div className="dex-activity-empty">Loading activity…</div>
                    ) : (
                      <ActivityTable account={w.account} transactions={txs} />
                    )}
                  </CardBody>
                </Card>
              </FadeIn>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
