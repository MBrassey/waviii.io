import React, { useEffect, useMemo, useState } from "react";
import FadeIn from "react-fade-in";
import CountUp from "react-countup";
import { WaveTopBottomLoading } from "react-loadingg";
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
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    setInput("");
    setLocalError(null);
  }, [mode]);

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

  const setMax = () => setInput(String(fromBalanceEth));

  const busy = w.tx.phase !== "idle";
  const amt = safeParse(input);
  const overBalance = amt > fromBalanceEth;

  let btnLabel = mode === "buy" ? "Buy waviii" : "Sell waviii";
  if (w.tx.phase === "buy-pending") btnLabel = "Confirming…";
  if (w.tx.phase === "approving") btnLabel = "1/2 Approving…";
  if (w.tx.phase === "selling") btnLabel = "2/2 Selling…";
  if (!amt) btnLabel = "Enter an amount";
  if (overBalance) btnLabel = "Insufficient balance";

  const disabled = busy || !amt || overBalance;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;
    setLocalError(null);
    const wei = window.web3.utils.toWei(String(amt), "Ether");
    if (mode === "buy") {
      await w.buyTokens(wei);
    } else {
      await w.sellTokens(wei);
    }
    setInput("");
  };

  let content;
  if (w.status === "detecting") {
    content = (
      <div className="dex-loader">
        <WaveTopBottomLoading color="#2c91c7" />
      </div>
    );
  } else if (w.status === "no-provider") {
    content = (
      <FadeIn>
        <div className="dex-empty">
          <div className="dex-empty-title waviii">Wallet not detected</div>
          <div className="dex-empty-sub">
            Install MetaMask to trade waviii.
          </div>
          <a
            className="dex-btn dex-btn-primary"
            href="https://metamask.io/download.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Install MetaMask
          </a>
        </div>
      </FadeIn>
    );
  } else if (w.status === "disconnected" || !w.account) {
    content = (
      <FadeIn>
        <div className="dex-empty">
          <div className="dex-empty-title waviii">Connect to swap</div>
          <div className="dex-empty-sub">
            Connect your wallet to buy or sell waviii on Ethereum.
          </div>
          <button className="dex-btn dex-btn-primary" onClick={w.connect}>
            {w.status === "connecting" ? "Connecting…" : "Connect Wallet"}
          </button>
        </div>
      </FadeIn>
    );
  } else if (w.status === "wrong-chain" || !w.isMainnet) {
    content = (
      <FadeIn>
        <div className="dex-empty">
          <div className="dex-empty-title waviii">Wrong network</div>
          <div className="dex-empty-sub">
            You're on {chainName(w.chainId)}. Switch to Ethereum Mainnet to
            continue.
          </div>
          <button className="dex-btn dex-btn-primary" onClick={w.switchMainnet}>
            Switch to Ethereum
          </button>
        </div>
      </FadeIn>
    );
  } else {
    content = (
      <FadeIn>
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
              <button type="button" className="dex-link-btn" onClick={setMax}>
                Balance:{" "}
                {fromBalanceEth.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}
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
                Balance:{" "}
                {toBalanceEth.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}
              </span>
            </div>
            <div className="dex-swap-panel-row">
              <div className="dex-swap-output dex-mono">
                <CountUp
                  duration={0.6}
                  preserveValue
                  end={outputNum}
                  decimals={mode === "buy" ? 2 : 6}
                  decimal="."
                  separator=","
                />
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

          {localError && <div className="dex-error">{localError}</div>}
          {w.tx.error && <div className="dex-error">{w.tx.error}</div>}

          <button
            type="submit"
            disabled={disabled}
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
    );
  }

  return (
    <div className="content dex-page">
      <Row>
        <Col md="12">
          <Card className="dex-card dex-swap-card">
            <CardBody className="dex-page-body">{content}</CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
