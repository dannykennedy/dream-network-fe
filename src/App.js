import React, { useEffect } from "react";
import "./App.css";
import { connect } from "react-redux";
import { fetchData as _fetchData } from "./ducks";
// Components
import InputArea from "./components/InputArea";
import ChartsArea from "./components/Chartsarea";
import PostsArea from "./components/PostsArea";
import { withAuth } from "@okta/okta-react";
import { useAuth } from "./auth";
import FontAwesome from "react-fontawesome";
import "./components/css/Navbar.css";

const App = withAuth(({ fetchData, auth }) => {
    // const { fetchData } = props;

    const [authenticated, user] = useAuth(auth);

    if (user) {
        console.log("We have a user", user);
    }

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="App">
            <header id="navbar">
                <div className="app-name">
                    <FontAwesome name="cloud-moon" />
                    <span id="navbar-site-title">Dream Network</span>
                </div>
                <div id="navbar-menu-items">
                    <div className="navbar-icon">
                        {authenticated !== null && (
                            <button
                                onClick={() =>
                                    authenticated ? auth.logout() : auth.login()
                                }
                                className="App-link"
                            >
                                Log {authenticated ? "out" : "in"}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div id={"App-body"}>
                {authenticated ? (
                    <div>
                        <div id={"notes-area"}>
                            <InputArea />
                            <PostsArea />
                        </div>
                        <ChartsArea />
                    </div>
                ) : (
                    <div>Please log in!</div>
                )}
            </div>
        </div>
    );
});

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        hej: 1,
    };
};

const mapDispatchToProps = {
    fetchData: _fetchData,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
