import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Web3 from "web3";
import TokenAbi from "../views/abis/waviii2.json";
import SwapAbi from "../views/abis/WavSwap.json";
import {
  TOKEN_ADDRESS,
  SWAP_ADDRESS,
  MAINNET_CHAIN_ID,
} from "../utils/wallet";

const MAX_APPROVAL =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

const WalletContext = createContext(null);
export const useWallet = () => useContext(WalletContext);

const hasProvider = () =>
  typeof window !== "undefined" && !!window.ethereum;

const parseChainId = (hex) => (hex ? parseInt(hex, 16) : null);

export default function WalletProvider({ children }) {
  const [status, setStatus] = useState("detecting");
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(null);
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [tx, setTx] = useState({ phase: "idle", error: null, hash: null });
  const [toast, setToast] = useState(null);
  const contractsRef = useRef({ token: null, swap: null });
  const toastTimerRef = useRef(null);

  const showToast = useCallback((type, message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ type, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4500);
  }, []);

  const makeContracts = useCallback(() => {
    if (!window.web3) return;
    contractsRef.current = {
      token: new window.web3.eth.Contract(TokenAbi.abi, TOKEN_ADDRESS),
      swap: new window.web3.eth.Contract(SwapAbi.abi, SWAP_ADDRESS),
    };
  }, []);

  const refresh = useCallback(async (acc) => {
    const address = acc || account;
    if (!address || !contractsRef.current.token) return;
    try {
      const web3 = window.web3;
      const [eth, tkn] = await Promise.all([
        web3.eth.getBalance(address),
        contractsRef.current.token.methods.balanceOf(address).call(),
      ]);
      setEthBalance(eth);
      setTokenBalance(tkn.toString());
    } catch {}
  }, [account]);

  const bootstrap = useCallback(async (acc, ci) => {
    setAccount(acc);
    setChainId(ci);
    if (ci !== MAINNET_CHAIN_ID) {
      setStatus("wrong-chain");
      return;
    }
    makeContracts();
    setStatus("ready");
    await refresh(acc);
  }, [makeContracts, refresh]);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      if (!hasProvider()) {
        setStatus("no-provider");
        return;
      }
      window.web3 = new Web3(window.ethereum);
      try {
        const [accounts, chainHex] = await Promise.all([
          window.ethereum.request({ method: "eth_accounts" }),
          window.ethereum.request({ method: "eth_chainId" }),
        ]);
        if (unmounted) return;
        const ci = parseChainId(chainHex);
        if (accounts && accounts[0]) {
          await bootstrap(accounts[0], ci);
        } else {
          setChainId(ci);
          setStatus("disconnected");
        }
      } catch {
        if (!unmounted) setStatus("disconnected");
      }

      const onAccountsChanged = async (accs) => {
        if (accs && accs[0]) {
          const ci = parseChainId(
            await window.ethereum.request({ method: "eth_chainId" })
          );
          await bootstrap(accs[0], ci);
        } else {
          setAccount("");
          setEthBalance("0");
          setTokenBalance("0");
          setStatus("disconnected");
        }
      };
      const onChainChanged = async (hex) => {
        const ci = parseChainId(hex);
        setChainId(ci);
        if (ci !== MAINNET_CHAIN_ID) {
          setStatus("wrong-chain");
          return;
        }
        makeContracts();
        setStatus("ready");
        if (account) await refresh(account);
      };

      window.ethereum.on && window.ethereum.on("accountsChanged", onAccountsChanged);
      window.ethereum.on && window.ethereum.on("chainChanged", onChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", onAccountsChanged);
          window.ethereum.removeListener("chainChanged", onChainChanged);
        }
      };
    })();
    return () => {
      unmounted = true;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = useCallback(async () => {
    if (!hasProvider()) {
      showToast("error", "No wallet detected. Install MetaMask.");
      return;
    }
    try {
      setStatus("connecting");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const ci = parseChainId(
        await window.ethereum.request({ method: "eth_chainId" })
      );
      if (accounts && accounts[0]) {
        await bootstrap(accounts[0], ci);
      } else {
        setStatus("disconnected");
      }
    } catch (e) {
      setStatus("disconnected");
      if (e && e.code !== 4001) {
        showToast("error", e.message || "Failed to connect");
      }
    }
  }, [bootstrap, showToast]);

  const switchMainnet = useCallback(async () => {
    if (!hasProvider()) return false;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
      return true;
    } catch (e) {
      if (e && e.code !== 4001) {
        showToast("error", e.message || "Failed to switch network");
      }
      return false;
    }
  }, [showToast]);

  const handleReceipt = useCallback(async (receipt) => {
    setTx({ phase: "idle", error: null, hash: receipt && receipt.transactionHash });
    showToast("success", "Transaction confirmed");
    await refresh(account);
  }, [account, refresh, showToast]);

  const handleError = useCallback((e, fallback) => {
    const code = e && e.code;
    const msg = e && e.message;
    if (code === 4001) {
      setTx({ phase: "idle", error: null, hash: null });
      return;
    }
    setTx({ phase: "idle", error: msg || fallback, hash: null });
    showToast("error", msg || fallback);
  }, [showToast]);

  const buyTokens = useCallback(
    (weiValue) =>
      new Promise((resolve) => {
        if (!contractsRef.current.swap || !account) return resolve(false);
        setTx({ phase: "buy-pending", error: null, hash: null });
        contractsRef.current.swap.methods
          .buyTokens()
          .send({ value: weiValue, from: account })
          .on("transactionHash", (h) =>
            setTx({ phase: "buy-pending", error: null, hash: h })
          )
          .on("receipt", async (r) => {
            await handleReceipt(r);
            resolve(true);
          })
          .on("error", (e) => {
            handleError(e, "Buy failed");
            resolve(false);
          });
      }),
    [account, handleReceipt, handleError]
  );

  const sellTokens = useCallback(
    (weiAmount) =>
      new Promise((resolve) => {
        if (!contractsRef.current.token || !contractsRef.current.swap || !account)
          return resolve(false);
        setTx({ phase: "approving", error: null, hash: null });
        contractsRef.current.token.methods
          .approve(SWAP_ADDRESS, MAX_APPROVAL)
          .send({ from: account })
          .on("transactionHash", (h) =>
            setTx({ phase: "approving", error: null, hash: h })
          )
          .on("receipt", () => {
            setTx({ phase: "selling", error: null, hash: null });
            contractsRef.current.swap.methods
              .sellTokens(weiAmount)
              .send({ from: account })
              .on("transactionHash", (h) =>
                setTx({ phase: "selling", error: null, hash: h })
              )
              .on("receipt", async (r) => {
                await handleReceipt(r);
                resolve(true);
              })
              .on("error", (e) => {
                handleError(e, "Sell failed");
                resolve(false);
              });
          })
          .on("error", (e) => {
            handleError(e, "Approval failed");
            resolve(false);
          });
      }),
    [account, handleReceipt, handleError]
  );

  const sendTransfer = useCallback(
    (to, weiAmount) =>
      new Promise((resolve) => {
        if (!contractsRef.current.token || !account) return resolve(false);
        setTx({ phase: "sending", error: null, hash: null });
        contractsRef.current.token.methods
          .transfer(to, weiAmount)
          .send({ from: account })
          .on("transactionHash", (h) =>
            setTx({ phase: "sending", error: null, hash: h })
          )
          .on("receipt", async (r) => {
            await handleReceipt(r);
            resolve(true);
          })
          .on("error", (e) => {
            handleError(e, "Transfer failed");
            resolve(false);
          });
      }),
    [account, handleReceipt, handleError]
  );

  const getTransferEvents = useCallback(async () => {
    if (!contractsRef.current.token || !account) return [];
    try {
      const latest = await window.web3.eth.getBlockNumber();
      const fromBlock = Math.max(0, latest - 200000);
      const [outs, ins] = await Promise.all([
        contractsRef.current.token.getPastEvents("Transfer", {
          fromBlock,
          toBlock: "latest",
          filter: { from: account },
        }),
        contractsRef.current.token.getPastEvents("Transfer", {
          fromBlock,
          toBlock: "latest",
          filter: { to: account },
        }),
      ]);
      return [...outs, ...ins];
    } catch {
      return [];
    }
  }, [account]);

  const value = {
    status,
    account,
    chainId,
    ethBalance,
    tokenBalance,
    tx,
    toast,
    hasProvider: hasProvider(),
    isMainnet: chainId === MAINNET_CHAIN_ID,
    connect,
    switchMainnet,
    refresh: () => refresh(account),
    buyTokens,
    sellTokens,
    sendTransfer,
    getTransferEvents,
    dismissToast: () => setToast(null),
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
