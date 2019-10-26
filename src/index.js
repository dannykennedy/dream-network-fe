import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider as StoreProvider } from "react-redux";
import store from "./store";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// Need to wrap app in a store provider component, otherwise "cannot get store in the context of App"
const render = () => {
    ReactDOM.render(
        <StoreProvider store={store}>
            <App />
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
