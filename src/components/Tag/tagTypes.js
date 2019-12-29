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
