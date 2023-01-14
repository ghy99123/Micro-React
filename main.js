import { createElement } from "./micro-react";

const element = createElement(
  "h1",
  { id: "element", class: "element" },
  createElement("span", null, "I am span 1"),
  createElement("span", null, "I am span 2"),
  "some string"
);

console.log(element);
