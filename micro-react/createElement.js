// Used to transform the JSX to JS
// const element = <h1 title='foo'>Hello</h1>  <-  JSX
// const element = {                           <-  JS, an element object with type and props
//   type: 'h1',
//   props: {
//     title: 'foo',
//     children: 'Hello',
//   }
// }

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

