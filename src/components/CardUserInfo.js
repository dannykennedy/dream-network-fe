import React from "react";
import { parseTimestamp } from "../modules/parseDate";

function CardUserInfo({ firstName, lastName, timePosted }) {
    return (
        <div className="card-user-info">
            <div className="card-avatar tooltip">
                <div className="avatar-photo">
                    <span className="tooltiptext">{`${firstName} ${lastName}`}</span>
                    <div className="avatar-text">
                        {firstName.charAt(0) + lastName.charAt(0)}
                    </div>
                </div>
            </div>
            <div className="card-header-text">
                <div className="card-author">{`${firstName} ${lastName}`}</div>
                <div className="card-date">{parseTimestamp(timePosted)}</div>
            </div>
        </div>
    );
}

export default CardUserInfo;
