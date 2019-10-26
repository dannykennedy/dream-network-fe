import React, { useState } from "react";
import { connect } from "react-redux";
import { addPost as _addPost } from "../ducks";
import uuidV4 from "../modules/uuid";
import "./css/InputArea.css";

function InputArea({ addPost }) {
    const [noteText, setNoteText] = useState("");

    function handleSubmit(e) {
        e.preventDefault(); // Prevent page refresh

        let post = {
            entryText: noteText,
            noteId: uuidV4(),
            firstName: "Dan",
            lastName: "Kennedy",
            timePosted: new Date().toISOString(),
            tags: null,
            userId: 1,
        };

        addPost(post);
        setNoteText(""); // Clear textarea
    }

    return (
        <div>
            <form onSubmit={handleSubmit} id="input-area-form">
                <textarea
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Add a post!"
                    type="text"
                    name="firstName"
                    id="input-area-textarea"
                    required
                />
                <button
                    type="submit"
                    id="input-area-btn-submit"
                    className="button-standard"
                    style={{ marginBottom: "20px" }}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        posts: state.posts,
    };
};

const mapDispatchToProps = {
    addPost: _addPost,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InputArea);
