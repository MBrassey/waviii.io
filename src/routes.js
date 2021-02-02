import Wallet from "views/wallet";
import Swap from "views/swap";
import Dashboard from "views/Dashboard";

var routes = [
  {
    path: "/Wallet",
    name: "Wallet",
    icon: "wav-icons icon-wallet-43",
    component: Wallet,
    layout: "/admin"
  },
  {
    path: "/Swap",
    name: "Buy & Sell waviii",
    icon: "wav-icons icon-coins",
    component: Swap,
    layout: "/admin"
  },
  {
    path: "/Dashboard",
    name: "Price",
    icon: "wav-icons icon-chart-bar-32",
    component: Dashboard,
    layout: "/admin"
  },
];
export default routes;
