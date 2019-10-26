import React from "react";
import "./css/LoadingNotice.css";

function LoadingNotice(props) {
    const { loadingText } = props;

    return (
        <div className="loading-notice">
            <div>
                <img
                    src="./images/loading.gif"
                    className="loading-notice-spinner"
                    alt="loading"
                />
            </div>
            <div>
                <span>{loadingText}</span>
            </div>
        </div>
    );
}

export default LoadingNotice;
