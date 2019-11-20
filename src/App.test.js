import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./store";
import { testNameToKey } from "jest-snapshot/build/utils";

import renderer from "react-test-renderer";

// it("renders without crashing", () => {
//     const div = document.createElement("div");
//     ReactDOM.render(<App store={store} />, div);
//     ReactDOM.unmountComponentAtNode(div);
// });

describe("Number tests", () => {
    const numItems = 12;

    test("Number of items = 12", () => {
        expect(numItems).toBe(12);
    });

    const numTags = 1;
    test("Number of tags > 0", () => {
        expect(numTags).toBeGreaterThan(0);
    });
});

describe("String tests", () => {
    const title = "dog";

    test("There is a dog in this title", () => {
        expect(title).toMatch(/dog/); // toContain is another one
    });
});
