import React from "react";
import { parseTimestamp } from "../../modules/parseDate";
import FontAwesome from "react-fontawesome";
import { hoveredTagColors } from "../../theme/Theme";

function CardInfoHeader({ timePosted, authors }) {
    return (
        <div className="card-user-info">
            <div className="card-avatar tooltip">
                <div
                    className="avatar-photo"
                    style={{ backgroundColor: hoveredTagColors.DOCUMENT }}
                >
                    <span className="tooltiptext">{authors[0].tagName}</span>
                    <div className="avatar-text">
                        <FontAwesome name="file" />
                    </div>
                </div>
            </div>
            <div className="card-header-text">
                <div className="card-author">
                    {authors.map((author, i) => {
                        return i < authors.length - 1 ? (
                            <span>{author.tagName}, </span>
                        ) : (
                            <span>{author.tagName}</span>
                        );
                    })}
                </div>
                <div className="card-date">{parseTimestamp(timePosted)}</div>
            </div>
        </div>
    );
}

export default CardInfoHeader;
