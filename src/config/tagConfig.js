export const tagTypes = {
    PERSON: "PERSON",
    LOCATION: "LOCATION",
    OTHER: "OTHER",
    DATE: "DATE",
    DOCUMENT: "DOCUMENT",
};

export const mapEntitiesToTypes = {
    PERSON: tagTypes.PERSON,
    LOCATION: tagTypes.LOCATION,
    DATE: tagTypes.DATE,
    OTHER: tagTypes.OTHER,
    ORGANIZATION: tagTypes.LOCATION,
    NUMBER: tagTypes.OTHER,
    EVENT: tagTypes.OTHER,
    WORK_OF_ART: tagTypes.OTHER,
    CONSUMER_GOOD: tagTypes.OTHER,
    DOCUMENT: tagTypes.DOCUMENT,
    NONE: "NONE",
};

// Principles 1:
// Both the tag description and the tag type should be in an "is-a" relationship with the tag type
// E.g.
// an author is a person, and Kelly Bulkeley is a person
// Date posted is a date, and 14 May 2015 is a date
// Principles 2
export const TagDescriptions = {
    PERSON: ["Author", "Posted By", "Subject", "(None)"],
    DATE: ["Itemed on", "(None)"],
    OTHER: ["Subject", "Title", "Custom slug", "(None)"],
    DOCUMENT: ["Featured in", "(None)"],
    LOCATION: ["Subject", "(None)"],
};
