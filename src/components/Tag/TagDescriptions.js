// Principles 1:
// Both the tag description and the tag type should be in an "is-a" relationship with the tag type
// E.g.
// an author is a person, and Kelly Bulkeley is a person
// Date posted is a date, and 14 May 2015 is a date
// Principles 2
export const TagDescriptions = {
    PERSON: ["Author", "Subject"],
    DATE: ["Posted on"],
    OTHER: ["Subject"],
};
