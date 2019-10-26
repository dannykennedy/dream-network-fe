import React from "react";

let charts = ["chart 1", "chart 2", "chart 3"];

function ChartsArea() {
    return (
        <div>
            {charts.map((chart, key) => {
                return <div key={key}></div>;
            })}
        </div>
    );
}

export default ChartsArea;
