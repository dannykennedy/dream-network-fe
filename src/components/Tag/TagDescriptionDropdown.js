import React, { useEffect, useState, useRef } from "react";
import FontAwesome from "react-fontawesome";
import "./TagDescriptionDropdown.css";
import { connect } from "react-redux";
import { tagColors, hoveredTagColors } from "../../theme/Theme";
import { setTagDescription as _setTagDescription } from "../../ducks/posts";
import { TagDescriptions } from "./TagDescriptions";

// https://medium.com/@pitipatdop/little-neat-trick-to-capture-click-outside-with-react-hook-ba77c37c7e82
const TagDescriptionDropdown = ({
    postId,
    tagId,
    tagType,
    setTagDescription,
    tagDescription,
}) => {
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
            style={{
                backgroundColor: "white",
            }}
        >
            <button
                style={{
                    backgroundColor: tagColors[tagType],
                    border: `1px solid ${hoveredTagColors[tagType]}`,
                }}
                className="tag-description-dropbtn"
                onClick={e => setDropdownIsOpen(!dropdownIsOpen)}
            >
                {tagDescription && (
                    <span className="tag-description">{tagDescription}</span>
                )}
                <FontAwesome name="caret-down" />
            </button>
            {dropdownIsOpen && (
                <div
                    className="tag-description-dropdown-content"
                    style={{ backgroundColor: tagColors[tagType] }}
                >
                    {TagDescriptions[tagType]
                        .filter(descOption => descOption !== tagDescription)
                        .map((descOption, i) => {
                            return (
                                <button
                                    className="tag-description-dropdown-button"
                                    key={i}
                                    onClick={() => {
                                        console.log(descOption);
                                        if (descOption === "(None)") {
                                            descOption = null;
                                        }
                                        setTagDescription(
                                            descOption,
                                            tagId,
                                            postId
                                        );

                                        setDropdownIsOpen(false);
                                    }}
                                >
                                    <div>
                                        <span>{descOption}</span>
                                    </div>
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

const mapDispatchToProps = { setTagDescription: _setTagDescription };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TagDescriptionDropdown);
