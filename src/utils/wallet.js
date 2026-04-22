import Web3 from "web3";

export const MAINNET_CHAIN_ID = 1;
export const TOKEN_ADDRESS = "0x9cc6754d16b98a32ec9137df6453ba84597b9965";
export const SWAP_ADDRESS = "0x38abF018eA2f8066813C376A197B6Df0349d86c5";
export const ETHERSCAN_TOKEN_URL = `https://etherscan.io/token/${TOKEN_ADDRESS}`;
export const ETHERSCAN_SWAP_URL = `https://etherscan.io/address/${SWAP_ADDRESS}`;

export const hasProvider = () => typeof window !== "undefined" && !!window.ethereum;

export async function connect() {
  if (!hasProvider()) throw new Error("No Web3 provider");
  window.web3 = new Web3(window.ethereum);
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return accounts[0];
}

export async function getChainId() {
  if (!hasProvider()) return null;
  const hex = await window.ethereum.request({ method: "eth_chainId" });
  return parseInt(hex, 16);
}

export async function switchToMainnet() {
  if (!hasProvider()) return false;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
    return true;
  } catch {
    return false;
  }
}

export const chainName = (id) => {
  switch (id) {
    case 1: return "Ethereum";
    case 5: return "Goerli";
    case 11155111: return "Sepolia";
    case 137: return "Polygon";
    case 10: return "Optimism";
    case 42161: return "Arbitrum";
    case 8453: return "Base";
    default: return id ? `Chain ${id}` : "—";
  }
};

export const shortAddress = (addr) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
};

export function copyToClipboard(text) {
  if (!text) return Promise.resolve(false);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return Promise.resolve(ok);
  } catch {
    return Promise.resolve(false);
  }
}

export function subscribeProvider({ onAccounts, onChain }) {
  if (!hasProvider()) return () => {};
  const a = (accs) => onAccounts && onAccounts(accs && accs[0]);
  const c = (hex) => onChain && onChain(parseInt(hex, 16));
  window.ethereum.on && window.ethereum.on("accountsChanged", a);
  window.ethereum.on && window.ethereum.on("chainChanged", c);
  return () => {
    if (window.ethereum.removeListener) {
      window.ethereum.removeListener("accountsChanged", a);
      window.ethereum.removeListener("chainChanged", c);
    }
  };
}
