import React from "react";
import "./css/Spinner.css";

function Spinner({ height }) {
    console.log("height....", height);

    return (
        <div>
            <img
                src="./images/loading.gif"
                className="loading-notice-spinner"
                alt="loading"
                height={height || "30px"}
                width="auto"
            />
        </div>
    );
}

export default Spinner;
