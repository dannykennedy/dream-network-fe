import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider as StoreProvider } from "react-redux";
import store from "./store";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from "react-router-dom";
import { Security, ImplicitCallback } from "@okta/okta-react";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// Need to wrap app in a store provider component, otherwise "cannot get store in the context of App"
const render = () => {
    ReactDOM.render(
        <Router>
            <Security
                issuer={`${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`}
                client_id={process.env.REACT_APP_OKTA_CLIENT_ID}
                redirect_uri={`${window.location.origin}/implicit/callback`}
            >
                <StoreProvider store={store}>
                    <Switch>
                        <Route
                            exact
                            path="/implicit/callback/"
                            component={ImplicitCallback}
                        />
                        <Route path="/dream-network" component={App} />

                        <Redirect exact from="/" to="/dream-network" />
                    </Switch>
                </StoreProvider>
            </Security>
        </Router>,
        document.getElementById("root")
    );
};

render();

if (module.hot) {
    module.hot.accept("./App", function() {
        render();
    });
}
