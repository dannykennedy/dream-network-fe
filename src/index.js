import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider as StoreProvider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Security, ImplicitCallback } from "@okta/okta-react";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// Need to wrap app in a store provider component, otherwise "cannot get store in the context of App"
const render = () => {
    ReactDOM.render(
        <StoreProvider store={store}>
            <Router>
                <Security
                    issuer={`${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`}
                    client_id={process.env.REACT_APP_OKTA_CLIENT_ID}
                    redirect_uri={`${window.location.origin}/implicit/callback`}
                >
                    <Route path="/" exact component={App} />
                    <Route
                        path="/implicit/callback"
                        component={ImplicitCallback}
                    />
                </Security>
            </Router>
            ,
        </StoreProvider>,
        document.getElementById("root")
    );
};

render();

if (module.hot) {
    module.hot.accept("./App", function() {
        render();
    });
}
