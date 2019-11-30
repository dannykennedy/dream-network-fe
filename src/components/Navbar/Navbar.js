import React from "react";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import "./Navbar.css";

function Navbar({ user, authenticated, auth }) {
    return (
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
    );
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        user: state.user.user,
    };
};

export default connect(mapStateToProps)(Navbar);
