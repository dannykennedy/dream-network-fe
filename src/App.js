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

const App = withAuth(({ fetchData, fetchAllData, setUser, auth, addPost }) => {
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

            <div id={"App-body"}>
                {authenticated ? (
                    <div>
                        <div id={"notes-area"}>
                            {user && (
                                <div>
                                    <PostEditor content={""} onSave={addPost} />
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
    setUser: _setUser,
    addPost: _addPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
