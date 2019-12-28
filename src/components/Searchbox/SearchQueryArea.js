import React from "react";
import Tag from "../Tag";
import {
    addSearchTag as _addSearchTag,
    removeSearchTag as _removeSearchTag,
    setSearchTagType as _setSearchTagType,
    setSearchTagDescription as _setSearchTagDescription,
    editSearchTagName as _editSearchTagName,
    getTagType as _getTagType,
    filterItems as _filterItems,
} from "../../ducks/items";
import { connect } from "react-redux";

function SearchQueryArea({
    setSearchTagDescription,
    removeSearchTag,
    editSearchTagName,
    setSearchTagType,
    searchTags,
}) {
    return (
        <div id="search-tags-area">
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
    );
}

const mapStateToProps = state => {
    return {
        searchTags: state.items.searchTags,
    };
};

const mapDispatchToProps = {
    addSearchTag: _addSearchTag,
    removeSearchTag: _removeSearchTag,
    setSearchTagType: _setSearchTagType,
    setSearchTagDescription: _setSearchTagDescription,
    editSearchTagName: _editSearchTagName,
    getTagType: _getTagType,
    filterItems: _filterItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchQueryArea);
