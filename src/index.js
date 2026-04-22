import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin/Admin.js";
import IpfsRouter from "ipfs-react-router";
import WalletProvider from "providers/WalletProvider";
import Toast from "components/Toast/Toast";

import "assets/css/styles.css";

const hist = createBrowserHistory();

ReactDOM.render(
  <WalletProvider>
    <IpfsRouter history={hist}>
      <Switch>
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Redirect from="/" to="/admin/Waviii" />
      </Switch>
    </IpfsRouter>
    <Toast />
  </WalletProvider>,
  document.getElementById("root")
);
