import React, { useEffect, useState, useRef } from "react";
import FontAwesome from "react-fontawesome";
import "./TagDropdown.css";
import { connect } from "react-redux";
import { icons } from "../../theme/icons";
import { tagColors, hoveredTagColors } from "../../theme/Theme";
import { tagTypes } from "./tagTypes";
import { setTagType as _setTagType } from "../../ducks/items";

// https://medium.com/@pitipatdop/little-neat-trick-to-capture-click-outside-with-react-hook-ba77c37c7e82
const TagDropdown = ({ itemId, tagId, tagType, setTagType }) => {
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
                className="tag-dropbtn"
                onClick={e => setDropdownIsOpen(!dropdownIsOpen)}
            >
                <FontAwesome name={icons[tagType]} />
            </button>
            {dropdownIsOpen && (
                <div
                    className="tag-dropdown-content"
                    style={{ backgroundColor: tagColors[tagType] }}
                >
                    {Object.values(tagTypes)
                        .filter(type => type !== tagType) // Don't put current tag type in dropdown
                        .map((typeOption, i) => {
                            return (
                                <button
                                    className="tag-dropdown-button"
                                    key={i}
                                    style={{
                                        backgroundColor: tagColors[typeOption],
                                    }}
                                    onClick={() => {
                                        setTagType(
                                            typeOption.toUpperCase(),
                                            tagId,
                                            itemId
                                        );
                                        setDropdownIsOpen(false);
                                    }}
                                >
                                    <FontAwesome name={icons[typeOption]} />
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

const mapDispatchToProps = { setTagType: _setTagType };

export default connect(mapStateToProps, mapDispatchToProps)(TagDropdown);
