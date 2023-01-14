import { createElement, render, } from "./micro-react";

const element = createElement(
  "h1",
  { id: "element", class: "element" },
  createElement("span", null, "I am span 1"),
  createElement("div", {style: 'color: red'}, "I am span 2"),
  "some string"
);

console.log(element);


render(element, document.getElementById('root'));
