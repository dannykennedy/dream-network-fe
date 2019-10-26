import React, { useEffect } from "react";
import "./App.css";
import { connect } from "react-redux";
import { fetchData as _fetchData } from "./ducks";
// Components
import Navbar from "./components/Navbar";
import InputArea from "./components/InputArea";
import ChartsArea from "./components/Chartsarea";
import PostsArea from "./components/PostsArea";
import { withAuth } from "@okta/okta-react";
import { useAuth } from "./auth";

const App = withAuth(({ fetchData, auth }) => {
    // const { fetchData } = props;

    const [authenticated, user] = useAuth(auth);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="App">
            <Navbar siteTitle={"Dream Network"} />
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
            <div id={"App-body"}>
                <div id={"notes-area"}>
                    <InputArea />
                    <PostsArea />
                </div>
                <ChartsArea />
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
