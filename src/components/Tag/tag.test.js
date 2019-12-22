import renderer from "react-test-renderer";
import React from "react";
import { Tag } from "./Tag";

const numItems = 11;

test("Number of items = 11", () => {
    expect(numItems).toBe(11);
});

const arr = ["dog", "cat"];

test("Array contains a cat", () => {
    expect(["dog", "cat"]).toEqual(expect.arrayContaining(arr));
});

// Objects
const obj = { title: "Dan", age: 34 };

test("The title is Dan", () => {
    expect(obj).toHaveProperty("title");
});

test("Dan's age is 34", () => {
    expect(obj).toHaveProperty("age", 34);
});

test("Tag snapshot test", () => {
    const component = renderer.create(
        <Tag
            name="dog"
            type="OTHER"
            tagId="5"
            itemId="6"
            user="1"
            editing={true}
            editTagInCurrentlyEditingItem={function() {
                console.log("hi");
            }}
            markTagAsDeletedInCurrentlyEditingItem={function() {
                console.log("hi");
            }}
        />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
