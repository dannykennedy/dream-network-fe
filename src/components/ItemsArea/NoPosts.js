import React from "react";
import FontAwesome from "react-fontawesome";

function NoPosts() {
    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "5px",
                boxSizing: "border-box",
                padding: "20px",
                border: "1px solid #CCC",
            }}
        >
            <FontAwesome name="user-astronaut" />
            <span style={{ marginLeft: "10px" }}>
                Looks like you don't have any posts yet! Not to worry, just
                write something above and press "save".
            </span>
        </div>
    );
}

export default NoPosts;
