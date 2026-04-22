import React from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { sliceByRange, toWaviiiUsd } from "../../utils/prices";

const RANGES = ["7D", "1M", "3M"];

const buildData = (pricesInRange) => (canvas) => {
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 320);
  gradient.addColorStop(0, "rgba(44,145,199,0.35)");
  gradient.addColorStop(0.55, "rgba(44,145,199,0.10)");
  gradient.addColorStop(1, "rgba(44,145,199,0.00)");

  return {
    labels: pricesInRange.map(([t]) => moment(t).format("MMM D")),
    datasets: [
      {
        label: " waviii",
        fill: true,
        backgroundColor: gradient,
        borderColor: "#2c91c7",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#a3de9e",
        pointHoverBorderColor: "#a3de9e",
        pointHoverBorderWidth: 2,
        lineTension: 0.35,
        data: pricesInRange.map(([, p]) => toWaviiiUsd(p).toFixed(4)),
      },
    ],
  };
};

const options = (max) => ({
  maintainAspectRatio: false,
  legend: { display: false },
  tooltips: {
    backgroundColor: "#0f1115",
    titleFontColor: "#a3de9e",
    bodyFontColor: "#e8ebf0",
    titleFontFamily: "Syncopate, sans-serif",
    bodyFontFamily: "Syne, sans-serif",
    bodySpacing: 4,
    xPadding: 14,
    yPadding: 10,
    cornerRadius: 8,
    mode: "index",
    intersect: false,
    displayColors: false,
    callbacks: { label: (item) => ` $${item.yLabel}` },
  },
  responsive: true,
  hover: { mode: "index", intersect: false },
  scales: {
    yAxes: [
      {
        gridLines: {
          drawBorder: false,
          color: "rgba(255,255,255,0.05)",
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMax: max,
          padding: 12,
          fontColor: "#8a91a0",
          fontFamily: "Syne, sans-serif",
          maxTicksLimit: 6,
          callback: (v) => `$${v}`,
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          drawBorder: false,
          color: "rgba(255,255,255,0.03)",
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 10,
          fontColor: "#8a91a0",
          fontFamily: "Syne, sans-serif",
          maxTicksLimit: 7,
          autoSkip: true,
        },
      },
    ],
  },
});

export default class PriceChart extends React.Component {
  state = { range: "1M" };

  render() {
    const { prices } = this.props;
    if (!prices || !prices.length) return null;
    const slice = sliceByRange(prices, this.state.range);
    const values = slice.map(([, p]) => toWaviiiUsd(p));
    const max = Math.max(...values) * 1.08;

    return (
      <div>
        <div className="dex-range-group">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              className={`dex-range-btn${this.state.range === r ? " is-active" : ""}`}
              onClick={() => this.setState({ range: r })}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="dex-chart-area">
          <Line data={buildData(slice)} options={options(max)} />
        </div>
      </div>
    );
  }
}
