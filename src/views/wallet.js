import React, { useEffect, useState } from "react";
import FadeIn from "react-fade-in";
import CountUp from "react-countup";
import { WaveTopBottomLoading } from "react-loadingg";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import waviiiLogo from "../assets/img/i3.png";
import ActivityTable from "../components/Activity/ActivityTable";
import { useWallet } from "../providers/WalletProvider";
import { shortAddress, copyToClipboard, chainName } from "../utils/wallet";

const toEth = (wei) => {
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

  useEffect(() => {
    if (w.status !== "ready" || !w.account) {
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
  }, [w.status, w.account, w.tx.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const onCopy = async () => {
    const ok = await copyToClipboard(w.account);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const balance = toEth(w.tokenBalance);
  const busy = w.tx.phase !== "idle";

  const onSend = async (e) => {
    e.preventDefault();
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
          <img src={waviiiLogo} alt="waviii" className="dex-empty-logo" />
          <div className="dex-empty-title waviii">Wallet not detected</div>
          <div className="dex-empty-sub">
            Install MetaMask to view balance, send waviii, and see your activity.
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
          <img src={waviiiLogo} alt="waviii" className="dex-empty-logo" />
          <div className="dex-empty-title waviii">Wallet not connected</div>
          <div className="dex-empty-sub">Connect your wallet to continue.</div>
          <button className="dex-btn dex-btn-primary" onClick={w.connect}>
            {w.status === "connecting" ? "Connecting…" : "Connect Wallet"}
          </button>
        </div>
      </FadeIn>
    );
  } else if (!w.isMainnet) {
    content = (
      <FadeIn>
        <div className="dex-empty">
          <div className="dex-empty-title waviii">Wrong network</div>
          <div className="dex-empty-sub">
            You're on {chainName(w.chainId)}. Switch to Ethereum Mainnet to continue.
          </div>
          <button className="dex-btn dex-btn-primary" onClick={w.switchMainnet}>
            Switch to Ethereum
          </button>
        </div>
      </FadeIn>
    );
  } else {
    content = (
      <>
        <FadeIn>
          <div className="dex-balance-hero">
            <img src={waviiiLogo} alt="waviii" className="dex-balance-logo" />
            <div className="dex-balance-num waviii">
              <CountUp
                duration={1.4}
                start={0}
                end={balance}
                decimals={2}
                decimal="."
                separator=","
                preserveValue
              />
            </div>
            <div className="dex-balance-ticker">waviii</div>
            <button
              type="button"
              className={`dex-address-chip ${copied ? "is-copied" : ""}`}
              onClick={onCopy}
              title="Copy address"
            >
              <span className="dex-mono">{shortAddress(w.account)}</span>
              <span className="dex-copy-hint">{copied ? "Copied" : "Copy"}</span>
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
                  />
                </div>
                <div className="dex-field">
                  <div className="dex-field-top">
                    <label className="dex-field-label">Amount</label>
                    <button
                      type="button"
                      className="dex-link-btn"
                      onClick={() => setAmount(String(balance))}
                    >
                      Max{" "}
                      {balance.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </button>
                  </div>
                  <input
                    className="dex-input"
                    placeholder="0.00"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                {localError && <div className="dex-error">{localError}</div>}
                {w.tx.error && <div className="dex-error">{w.tx.error}</div>}
                <button
                  type="submit"
                  disabled={busy}
                  className="dex-btn dex-btn-primary dex-btn-block"
                >
                  {w.tx.phase === "sending" ? "Sending…" : "Send"}
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
              {loadingTxs ? (
                <div className="dex-activity-empty">Loading activity…</div>
              ) : (
                <ActivityTable account={w.account} transactions={txs} />
              )}
            </CardBody>
          </Card>
        </FadeIn>
      </>
    );
  }

  return (
    <div className="content dex-page">
      <Row>
        <Col md="12">
          <Card className="dex-card dex-wallet-card">
            <CardBody className="dex-page-body">{content}</CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
