import React from "react";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import "./css/Navbar.css";

function getNotes() {
    console.log("here's your notes");
}

function Navbar({ siteTitle }) {
    return (
        <header id="navbar">
            <div className="app-name">
                <FontAwesome name="cloud-moon" />
                <span id="navbar-site-title">{siteTitle}</span>
            </div>
            <div id="navbar-menu-items">
                <div className="navbar-icon">
                    <FontAwesome name="chart-bar" />
                </div>
                <div className="navbar-icon" onClick={getNotes}>
                    <FontAwesome name="user" />
                </div>
                <div className="navbar-icon">
                    <FontAwesome name="bars" />
                </div>
            </div>
        </header>
    );
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        hej: state.hej,
    };
};

export default connect(mapStateToProps)(Navbar);
