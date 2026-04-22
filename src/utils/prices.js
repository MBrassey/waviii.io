import axios from "axios";

const COINGECKO = "https://api.coingecko.com/api/v3/coins/ethereum/market_chart";
const CACHE_KEY = "waviii.prices.v1";
const CACHE_TTL_MS = 5 * 60 * 1000;
const DAYS = 90;

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { t, data } = JSON.parse(raw);
    if (!data || !Array.isArray(data.prices)) return null;
    if (Date.now() - t > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data }));
  } catch {}
};

export async function fetchMarketChart() {
  const cached = readCache();
  if (cached) return cached;
  const { data } = await axios.get(COINGECKO, {
    params: { vs_currency: "usd", days: DAYS, interval: "daily" },
  });
  writeCache(data);
  return data;
}

export const toWaviiiUsd = (ethUsd) => ethUsd / 100;

export function sliceByRange(prices, range) {
  const days = range === "7D" ? 7 : range === "1M" ? 30 : 90;
  return prices.slice(-days);
}

export function deriveStats(prices) {
  if (!prices || prices.length < 2) return null;
  const series = prices.map(([, p]) => toWaviiiUsd(p));
  const current = series[series.length - 1];
  const prev24h = series[series.length - 2];
  const last30 = series.slice(-30);
  const pctChange24h = ((current - prev24h) / prev24h) * 100;
  const high30 = Math.max(...last30);
  const low30 = Math.min(...last30);
  return { current, pctChange24h, high30, low30 };
}
