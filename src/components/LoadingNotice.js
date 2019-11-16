import React from "react";
import "./css/LoadingNotice.css";
import Spinner from "./Spinner";

function LoadingNotice(props) {
    const { loadingText } = props;

    return (
        <div className="loading-notice">
            <Spinner />
            <div>
                <span>{loadingText}</span>
            </div>
        </div>
    );
}

export default LoadingNotice;
