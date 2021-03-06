import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin/Admin.js";
import IpfsRouter from "ipfs-react-router";

import "assets/css/waviii.min.css";
import "assets/css/nucleo-icons.css";
import "assets/css/custom.css";

const hist = createBrowserHistory();

ReactDOM.render(
  <IpfsRouter history={hist}>
    <Switch>
      <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      <Redirect from="/" to="/admin/Waviii" />
    </Switch>
  </IpfsRouter>,
  document.getElementById("root")
);
