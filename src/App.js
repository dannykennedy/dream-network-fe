import React, { useEffect } from "react";
import "./App.css";
import { connect } from "react-redux";
import {
    fetchData as _fetchData,
    fetchAllData as _fetchAllData,
    addPost as _addPost,
} from "./ducks/posts";
import { setUser as _setUser } from "./ducks/user";
// Components
import ChartsArea from "./components/Chartsarea";
import PostsArea from "./components/PostsArea";
import { withAuth } from "@okta/okta-react";
import { useAuth } from "./auth";
import PostEditor from "./components/PostEditor";
import Navbar from "./components/Navbar";
import Tag from "./components/Tag";
import {
    Redirect,
    BrowserRouter as Router,
    Switch,
    Root,
    Route,
} from "react-router-dom";

const App = withAuth(
    ({ fetchData, fetchAllData, setUser, auth, addPost, userPosts }) => {
        // const { fetchData } = props;

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

        return (
            <div className="App">
                <Navbar authenticated={authenticated} auth={auth} />
                <Router>
                    <Switch>
                        <Route
                            path="/dream-network/:postId"
                            component={Article}
                        >
                            <div>Hej there</div>
                        </Route>
                        <Route path="/">
                            <div id={"App-body"}>
                                {authenticated ? (
                                    <div>
                                        <div id={"notes-area"}>
                                            {user && (
                                                <div>
                                                    <PostEditor
                                                        content={""}
                                                        onSave={addPost}
                                                    />
                                                    <PostsArea
                                                        user={user}
                                                        preferred_username={
                                                            user.preferred_username
                                                        }
                                                        given_name={
                                                            user.given_name
                                                        }
                                                        family_name={
                                                            user.family_name
                                                        }
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
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
);

const Article = ({ match, userPosts }) => {
    return (
        <div>
            This is post {match.params.postId}{" "}
            <span>{userPosts[match.params.postId]}</span>
        </div>
    );
};

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        userPosts: state.userPosts,
    };
};

const mapDispatchToProps = {
    fetchData: _fetchData,
    fetchAllData: _fetchAllData,
    setUser: _setUser,
    addPost: _addPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
connect(mapStateToProps)(Article);
