import React, { useEffect } from "react";
import "./App.css";
import { connect } from "react-redux";
import {
    fetchData as _fetchData,
    fetchAllData as _fetchAllData,
} from "./ducks";
// Components
import ChartsArea from "./components/Chartsarea";
import PostsArea from "./components/PostsArea";
import { withAuth } from "@okta/okta-react";
import { useAuth } from "./auth";
import FontAwesome from "react-fontawesome";
import "./components/css/Navbar.css";
import PostEditor from "./components/PostEditor";

const App = withAuth(({ fetchData, fetchAllData, auth }) => {
    // const { fetchData } = props;

    const [authenticated, user] = useAuth(auth);

    if (user) {
        console.log("We have a user", user);
    }

    useEffect(() => {
        if (user) {
            fetchData(user.email);
        }
    }, [fetchData, user]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    return (
        <div className="App">
            <header id="navbar">
                <div className="app-name">
                    <FontAwesome name="cloud-moon" />
                    <span id="navbar-site-title">Dream Network</span>
                </div>
                <div id="navbar-menu-items">
                    <div>
                        <span>{user ? `Welcome, ${user.given_name}` : ""}</span>
                    </div>
                    <div className="navbar-icon">
                        {authenticated !== null && (
                            <button
                                onClick={() =>
                                    authenticated ? auth.logout() : auth.login()
                                }
                                className="App-link"
                            >
                                {authenticated ? (
                                    <div>
                                        <span>Log out </span>
                                        <FontAwesome name="sign-out-alt" />
                                    </div>
                                ) : (
                                    <div>
                                        <span>Log in </span>
                                        <FontAwesome name="sign-in-alt" />
                                    </div>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div id={"App-body"}>
                {authenticated ? (
                    <div>
                        <div id={"notes-area"}>
                            {user && (
                                <div>
                                    <PostEditor
                                        preferred_username={
                                            user.preferred_username
                                        }
                                        given_name={user.given_name}
                                        family_name={user.family_name}
                                    />
                                    <PostsArea
                                        user={user}
                                        preferred_username={
                                            user.preferred_username
                                        }
                                        given_name={user.given_name}
                                        family_name={user.family_name}
                                    />
                                </div>
                            )}
                        </div>
                        <ChartsArea />
                    </div>
                ) : (
                    <div>
                        <div id={"notes-area"}>
                            <PostsArea
                                user={null}
                                preferred_username={null}
                                given_name={null}
                                family_name={null}
                            />
                        </div>
                        <ChartsArea />
                    </div>
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
    fetchAllData: _fetchAllData,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
