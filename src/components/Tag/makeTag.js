export const makeTag = (
    tagId,
    tagName,
    tagType,
    itemId,
    isNewTag,
    tagDescription
) => {
    return {
        tagId: tagId,
        tagName: tagName,
        tagType: tagType,
        itemId: itemId,
        isNewTag: isNewTag,
        tagDescription: tagDescription,
    };
};
