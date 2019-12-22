import React, { useEffect } from "react";
import ItemEditor from "./ItemEditor";
import ItemsArea from "./ItemsArea";
import ChartsArea from "./ItemsArea";
import { connect } from "react-redux";
import { fetchData as _fetchData } from "../ducks/items";

function LoggedInHome({ user, fetchData }) {
    console.log("user!", user);

    useEffect(() => {
        if (user) {
            fetchData(user.email);
        }
    }, [fetchData, user]);

    return user ? (
        <div>
            <div id={"items-area"}>
                <div>
                    <ItemEditor
                        preferred_username={user.preferred_username}
                        given_name={user.given_name}
                        family_name={user.family_name}
                    />
                    <ItemsArea
                        preferred_username={user.preferred_username}
                        given_name={user.given_name}
                        family_name={user.family_name}
                    />
                </div>
            </div>
            <ChartsArea />
        </div>
    ) : (
        <div>Hi</div>
    );
}

// these parts of state are passed in as props
const mapStateToProps = state => {
    return {
        hej: 1,
    };
};

const mapDispatchToProps = {
    fetchData: _fetchData,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoggedInHome);
