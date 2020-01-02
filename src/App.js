import React, { useEffect } from "react";
import "./App.css";
import { connect } from "react-redux";
import {
    fetchData as _fetchData,
    fetchAllData as _fetchAllData,
    addItem as _addItem,
} from "./ducks/items";
import { setUser as _setUser } from "./ducks/user";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuth } from "@okta/okta-react";
import { useAuth } from "./auth";
// Components
import ChartsArea from "./components/Chartsarea";
import ItemsArea from "./components/ItemsArea/ItemsArea";
import ItemEditor from "./components/ItemEditor";
import Navbar from "./components/Navbar";
import LoadingNotice from "./components/LoadingNotice";
import Card from "./components/Card";

const App = withAuth(
    ({
        fetchData,
        fetchAllData,
        setUser,
        auth,
        addItem,
        userItems,
        publicItems,
    }) => {
        const [authenticated, user] = useAuth(auth);

        useEffect(() => {
            if (user) {
                fetchData(user.email);
            }
        }, [fetchData, user]);

        useEffect(() => {
            fetchAllData();
        }, [fetchAllData]);

        useEffect(() => {
            setUser(user);
        }, [user, setUser]);

        // useEffect(() => {}, [userItems]);

        return (
            <div className="App">
                <Navbar authenticated={authenticated} auth={auth} />
                <Router>
                    <Switch>
                        <Route exact={true} path="/dream-network">
                            <div id={"App-body"}>
                                {authenticated ? (
                                    <div>
                                        <div id={"items-area"}>
                                            {user && (
                                                <div>
                                                    <ItemEditor
                                                        content={""}
                                                        onSave={addItem}
                                                    />
                                                    <ItemsArea user={user} />
                                                </div>
                                            )}
                                        </div>
                                        <ChartsArea />
                                    </div>
                                ) : (
                                    <div>
                                        <div id={"items-area"}>
                                            <ItemsArea
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
                        </Route>
                        <Route
                            path="/:itemId"
                            render={({ match }) => {
                                console.log("gotta match!", match);
                                let post;
                                if (publicItems) {
                                    post = publicItems[match.params.itemId];
                                }
                                return (
                                    <div id={"App-body"}>
                                        <div id={"items-area"}>
                                            {publicItems ? (
                                                <Card
                                                    post={post}
                                                    key={post.itemId}
                                                    showingCardAsMainContent={
                                                        true
                                                    }
                                                />
                                            ) : (
                                                <LoadingNotice
                                                    loadingText={"Loading post"}
                                                />
                                            )}
                                        </div>
                                        <ChartsArea />
                                    </div>
                                );
                            }}
                        ></Route>
                    </Switch>
                </Router>
            </div>
        );
    }
);

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        userItems: state.items.userItems,
        publicItems: state.items.publicItems,
    };
};

const mapDispatchToProps = {
    fetchData: _fetchData,
    fetchAllData: _fetchAllData,
    setUser: _setUser,
    addItem: _addItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
