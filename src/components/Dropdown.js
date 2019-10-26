import React, { useEffect, useState, useRef } from "react";
import FontAwesome from "react-fontawesome";
import "./css/Dropdown.css";
import { connect } from "react-redux";
import { deleteNote as _deleteNote } from "../ducks";

// https://medium.com/@pitipatdop/little-neat-trick-to-capture-click-outside-with-react-hook-ba77c37c7e82

const Dropdown = ({ noteId, deleteNote }) => {
    const node = useRef();

    const [open, setOpen] = useState(false);

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            // inside click
            return;
        }
        // outside click
        setOpen(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    return (
        <div ref={node} className="dropdown">
            <button className="dropbtn" onClick={e => setOpen(!open)}>
                <FontAwesome name="ellipsis-v" />
            </button>
            {open && (
                <div className="dropdown-content">
                    <button onClick={() => deleteNote(noteId)}>Delete</button>
                    <button>Edit</button>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => {
    return state;
};

const mapDispatchToProps = {
    deleteNote: _deleteNote,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dropdown);
