function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  Object.keys(fiber.props)
    .filter((key) => key !== "children")
    .forEach((name) => (dom[name] = fiber.props[name]));

  return dom

  // element.props.children.forEach((child) => render(child, dom));

  // container.appendChild(dom);
}

// The recursive call of render function above will never stop until we have rendered the
// complete element tree. To avoid blocking the main thread for too long, the rendering
// work should be able to be interrupted when high priority work needs to be done.

export function render(element, container) {
  // fiber init
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
    sibling: null,
    child: null,
    parent: null,
  };
}

let nextUnitOfWork = null;

// will be run when the main thread is idle
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // check how much idle time we have
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  // create dom for fiber
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  if (fiber.parent) {
    fiber.parent.dom.append(fiber.dom)
  }

  // create fibers for current fiber's children
  const elements = fiber.props.children;
  let preSibling = null;

  // build fiber tree
  for (let i = 0; i < elements.length; i++) {
    const newFiber = {
      type: elements[i].type,
      props: elements[i].props,
      parent: fiber,
      dom: null,
      child: null,
      sibling: null,
    };

    if (i === 0) { // the first child of the parent element is also the child of parent fiber
      fiber.child = newFiber;
    }else { // all the other children are no longer the children of parent, but becomes the siblings of the previous fiber in iteration
      preSibling.sibling = newFiber;
    }
    preSibling = newFiber;
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent
  }
}
