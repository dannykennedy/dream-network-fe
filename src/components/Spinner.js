import React from "react";

function Spinner({ height }) {
    return (
        <div>
            <img
                src="./images/loading.gif"
                className="loading-notice-spinner"
                alt="loading"
                height={height || "30px"}
                width="auto"
                style={{ display: "inline-block", alignSelf: "center" }}
            />
        </div>
    );
}

export default Spinner;
