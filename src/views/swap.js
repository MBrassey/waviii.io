import React, { useEffect, useMemo, useState } from "react";
import FadeIn from "react-fade-in";
import CountUp from "react-countup";
import { Card, CardBody, Row, Col } from "reactstrap";
import tokenLogo from "../assets/img/token-logo.png";
import ethLogo from "../assets/img/eth-logo.png";
import { useWallet } from "../providers/WalletProvider";
import { chainName } from "../utils/wallet";

const RATE = 100;

const safeParse = (v) => {
  if (typeof v !== "string") return 0;
  const n = parseFloat(v.replace(/,/g, ""));
  return isFinite(n) && n > 0 ? n : 0;
};

const fromWei = (wei) => {
  if (!window.web3 || !window.web3.utils) return 0;
  try {
    return Number(window.web3.utils.fromWei(String(wei || "0"), "Ether"));
  } catch {
    return 0;
  }
};

export default function Swap() {
  const w = useWallet();
  const [mode, setMode] = useState("buy");
  const [input, setInput] = useState("");

  useEffect(() => {
    setInput("");
  }, [mode]);

  const connected = w.status === "ready" && w.isMainnet && !!w.account;

  const { fromSym, toSym, fromLogo, toLogo, fromBalanceEth, toBalanceEth } =
    useMemo(() => {
      const ethEth = fromWei(w.ethBalance);
      const tknEth = fromWei(w.tokenBalance);
      if (mode === "buy") {
        return {
          fromSym: "ETH",
          toSym: "waviii",
          fromLogo: ethLogo,
          toLogo: tokenLogo,
          fromBalanceEth: ethEth,
          toBalanceEth: tknEth,
        };
      }
      return {
        fromSym: "waviii",
        toSym: "ETH",
        fromLogo: tokenLogo,
        toLogo: ethLogo,
        fromBalanceEth: tknEth,
        toBalanceEth: ethEth,
      };
    }, [mode, w.ethBalance, w.tokenBalance]);

  const outputNum = useMemo(() => {
    const n = safeParse(input);
    if (!n) return 0;
    return mode === "buy" ? n * RATE : n / RATE;
  }, [input, mode]);

  const setMax = () => {
    if (!connected) return;
    setInput(String(fromBalanceEth));
  };

  const busy = w.tx.phase !== "idle";
  const amt = safeParse(input);
  const overBalance = connected && amt > fromBalanceEth;

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
    btnLabel =
      w.tx.phase === "buy-pending"
        ? "Confirming…"
        : w.tx.phase === "approving"
        ? "1/2 Approving…"
        : w.tx.phase === "selling"
        ? "2/2 Selling…"
        : "Pending…";
    btnDisabled = true;
  } else if (!amt) {
    btnLabel = "Enter an amount";
    btnDisabled = true;
  } else if (overBalance) {
    btnLabel = "Insufficient balance";
    btnDisabled = true;
  } else {
    btnLabel = mode === "buy" ? "Buy waviii" : "Sell waviii";
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (btnDisabled) return;
    if (btnAction) {
      btnAction();
      return;
    }
    const wei = window.web3.utils.toWei(String(amt), "Ether");
    if (mode === "buy") await w.buyTokens(wei);
    else await w.sellTokens(wei);
    setInput("");
  };

  const fromBalanceLabel = connected
    ? fromBalanceEth.toLocaleString(undefined, { maximumFractionDigits: 6 })
    : "—";
  const toBalanceLabel = connected
    ? toBalanceEth.toLocaleString(undefined, { maximumFractionDigits: 6 })
    : "—";

  const statusBadge = (() => {
    if (w.status === "detecting") return { cls: "is-idle", text: "Detecting wallet" };
    if (w.status === "no-provider")
      return { cls: "is-wrong", text: "No wallet detected" };
    if (w.status === "disconnected" || !w.account)
      return { cls: "is-idle", text: "Not connected" };
    if (!w.isMainnet)
      return { cls: "is-wrong", text: `Wrong network · ${chainName(w.chainId)}` };
    return null;
  })();

  return (
    <div className="content dex-page">
      <Row>
        <Col md="12">
          <Card className="dex-card dex-swap-card">
            <CardBody className="dex-page-body">
              <FadeIn>
                {statusBadge && (
                  <div className={`dex-status-banner ${statusBadge.cls}`}>
                    <span className="dex-net-dot" />
                    <span>{statusBadge.text}</span>
                  </div>
                )}

                <div className="dex-swap-tabs" role="tablist">
                  <button
                    type="button"
                    className={`dex-tab ${mode === "buy" ? "is-active" : ""}`}
                    onClick={() => setMode("buy")}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    className={`dex-tab ${mode === "sell" ? "is-active" : ""}`}
                    onClick={() => setMode("sell")}
                  >
                    Sell
                  </button>
                </div>

                <form className="dex-swap-form" onSubmit={onSubmit}>
                  <div className="dex-swap-panel">
                    <div className="dex-swap-panel-top">
                      <span className="dex-field-label">From</span>
                      <button
                        type="button"
                        className="dex-link-btn"
                        onClick={setMax}
                        disabled={!connected}
                      >
                        Balance: {fromBalanceLabel}
                      </button>
                    </div>
                    <div className="dex-swap-panel-row">
                      <input
                        type="text"
                        inputMode="decimal"
                        className="dex-swap-input"
                        placeholder="0"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        autoComplete="off"
                        spellCheck="false"
                        disabled={!connected}
                      />
                      <div className="dex-token-chip">
                        <img src={fromLogo} alt="" />
                        <span>{fromSym}</span>
                      </div>
                    </div>
                  </div>

                  <div className="dex-swap-flip-wrap">
                    <button
                      type="button"
                      className="dex-swap-flip"
                      onClick={() => setMode(mode === "buy" ? "sell" : "buy")}
                      aria-label="Flip direction"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 4v16" />
                        <path d="M3 8l4-4 4 4" />
                        <path d="M17 20V4" />
                        <path d="M21 16l-4 4-4-4" />
                      </svg>
                    </button>
                  </div>

                  <div className="dex-swap-panel">
                    <div className="dex-swap-panel-top">
                      <span className="dex-field-label">To</span>
                      <span className="dex-field-label dex-muted">
                        Balance: {toBalanceLabel}
                      </span>
                    </div>
                    <div className="dex-swap-panel-row">
                      <div className="dex-swap-output dex-mono">
                        {connected ? (
                          <CountUp
                            duration={0.6}
                            preserveValue
                            end={outputNum}
                            decimals={mode === "buy" ? 2 : 6}
                            decimal="."
                            separator=","
                          />
                        ) : (
                          "0"
                        )}
                      </div>
                      <div className="dex-token-chip">
                        <img src={toLogo} alt="" />
                        <span>{toSym}</span>
                      </div>
                    </div>
                  </div>

                  <div className="dex-swap-meta">
                    <div>
                      <span className="dex-muted">Rate</span>
                      <span className="dex-mono">1 ETH = {RATE} waviii</span>
                    </div>
                    <div>
                      <span className="dex-muted">Fee</span>
                      <span className="dex-mono">0%</span>
                    </div>
                  </div>

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
              </FadeIn>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
