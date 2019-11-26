import React, { useEffect, useState, useRef } from "react";
import FontAwesome from "react-fontawesome";
import "./TagDropdown.css";
import { connect } from "react-redux";
import { icons } from "../../theme/icons";
import { tagColors } from "../../theme/Theme";
import { tagTypes } from "./tagTypes";

// https://medium.com/@pitipatdop/little-neat-trick-to-capture-click-outside-with-react-hook-ba77c37c7e82
const TagDropdown = ({ noteId, tagId, tagType }) => {
    const node = useRef();

    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            return; // inside click
        }
        setDropdownIsOpen(false); // outside click
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    return (
        <div
            ref={node}
            className="tag-dropdown"
            style={{ backgroundColor: tagColors[tagType] }}
        >
            <button
                className="tag-dropbtn"
                onClick={e => setDropdownIsOpen(!dropdownIsOpen)}
            >
                <FontAwesome name={icons[tagType]} />
            </button>
            {dropdownIsOpen && (
                <div className="tag-dropdown-content">
                    {Object.values(tagTypes).map((type, i) => {
                        return (
                            <button
                                key={i}
                                style={{ backgroundColor: tagColors[type] }}
                            >
                                <FontAwesome name={icons[type]} />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => {
    return state;
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TagDropdown);
