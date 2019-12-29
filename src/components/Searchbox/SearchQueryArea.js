import React from "react";
import Tag from "../Tag";
import {
    removeSearchTag as _removeSearchTag,
    setSearchTagType as _setSearchTagType,
    setSearchTagDescription as _setSearchTagDescription,
    editSearchTagName as _editSearchTagName,
} from "../../ducks/items";
import { connect } from "react-redux";
import LoadingNotice from "../LoadingNotice";

function SearchQueryArea({
    setSearchTagDescription,
    removeSearchTag,
    editSearchTagName,
    setSearchTagType,
    searchTags,
    searchingInProgress,
}) {
    return (
        <div id="search-tags-area">
            {searchingInProgress ? (
                <LoadingNotice loadingText="Searching!" />
            ) : (
                <div>
                    {searchTags.length > 0 && <span>Filtering by: </span>}
                    {searchTags.map(tag => {
                        return (
                            <Tag
                                name={tag.tagName}
                                type={tag.tagType}
                                tagId={tag.tagId}
                                tagDescription={tag.tagDescription}
                                onSetTagDescription={setSearchTagDescription}
                                editing={true}
                                onDelete={removeSearchTag}
                                onSetTagType={setSearchTagType}
                                key={tag.tagId}
                                onEditTagName={editSearchTagName}
                            ></Tag>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        searchTags: state.items.searchTags,
        searchingInProgress: state.items.searchingInProgress,
    };
};

const mapDispatchToProps = {
    removeSearchTag: _removeSearchTag,
    setSearchTagType: _setSearchTagType,
    setSearchTagDescription: _setSearchTagDescription,
    editSearchTagName: _editSearchTagName,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchQueryArea);
