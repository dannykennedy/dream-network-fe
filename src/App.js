import React, { useEffect } from "react";
import "./App.css";
import { connect } from "react-redux";
import { fetchData as _fetchData } from "./ducks";
// Components
import Navbar from "./components/Navbar";
import InputArea from "./components/InputArea";
import ChartsArea from "./components/Chartsarea";
import PostsArea from "./components/PostsArea";

function App(props) {
    const { fetchData } = props;

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="App">
            <Navbar siteTitle={"Dream Network"} />
            <div id={"App-body"}>
                <div id={"notes-area"}>
                    <InputArea />
                    <PostsArea />
                </div>
                <ChartsArea />
            </div>
        </div>
    );
}

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
