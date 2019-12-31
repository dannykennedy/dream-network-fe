import React from "react";
import { parseTimestamp } from "../../modules/parseDate";
import FontAwesome from "react-fontawesome";
import { hoveredTagColors } from "../../theme/Theme";

function CardUserInfo({ timePosted, authors }) {
    return (
        <div className="card-user-info">
            <div className="card-avatar tooltip">
                <div
                    className="avatar-photo"
                    style={{ backgroundColor: hoveredTagColors.DOCUMENT }}
                >
                    <span className="tooltiptext">{authors[0].name}</span>
                    <div className="avatar-text">
                        <FontAwesome name="file" />
                    </div>
                </div>
            </div>
            <div className="card-header-text">
                <div className="card-author">
                    {authors.map(author => {
                        return <span>{author.name} </span>;
                    })}
                </div>
                <div className="card-date">{parseTimestamp(timePosted)}</div>
            </div>
        </div>
    );
}

export default CardUserInfo;
