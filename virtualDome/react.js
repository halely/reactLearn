/**
 * TODO: 创建并返回一个 React 元素
 * @param {string | Function} type - 元素的类型，可以是字符串表示的 DOM 标签名，也可以是组件函数或类
 * @param {Object} props - 元素的属性
 * @param {...any} children - 元素的子节点，可以是字符串、数字、React 元素或它们的数组
 * @returns {Object} - 创建的 React 元素对象
 */
function createElement(type, props, ...children) {
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
/**
 * TODO: 创建并返回一个文本节点的 React 元素
 * @param {string | number} text - 要创建的文本内容
 * @returns {Object} - 创建的文本节点的 React 元素对象
 */
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

/**
 * TODO: 将 React 元素渲染到指定的 DOM 容器中
 * @param {Object} element - 要渲染的 React 元素对象
 * @param {HTMLElement} container - 要渲染到的 DOM 容器元素
 */
function renderDom(element, container) {
  // 根据元素类型创建相应的 DOM 节点
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  updateDom(dom, {}, element.props);
  // 遍历子元素，递归调用 renderDom 函数将子元素渲染到 DOM 节点中
  element.props.children.forEach((child) => renderDom(child, dom));

  // 将渲染后的 DOM 节点添加到指定容器中
  container.appendChild(dom);
}

const ReactLy = {
  createElement,
  renderDom,
};

// /** @jsx ReactLy.createElement */
// const element = (
//   <div style="background: salmon">
//     <h1>Hello World</h1>
//     <h2 style="text-align:right">from ReactLy</h2>
//   </div>
// );
// const container = document.getElementById("root");
// ReactLy.renderDom(element, container);

let nextUnitOfWork = null; // 下一个工作单元
let wipRoot = null; //当前工作的fiber数
let currentRoot = null; // 上一次渲染的 Fiber 树的根节点
let deletions = null; // 要删除的 Fiber 节点列表 deletions[D] {A,B,C,D}=> {A,B,C}
// Fiber 渲染入口
function render(element, container) {
  //wipRoot 表示“正在进行的工作根”，它是 Fiber 架构中渲染任务的起点
  wipRoot = {
    dom: container, //渲染目标的 DOM 容器
    props: {
      children: [element], //要渲染的元素（例如 React 元素）
    },
    alternate: currentRoot,
    //alternate 是 React Fiber 树中的一个关键概念，用于双缓冲机制（双缓冲 Fiber Tree）。currentRoot 是之前已经渲染过的 Fiber 树的根，wipRoot 是新一轮更新的根 Fiber 节点。
    //它们通过 alternate 属性相互关联
    //旧的fiber树
  };
  nextUnitOfWork = wipRoot;
  //nextUnitOfWork 是下一个要执行的工作单元（即 Fiber 节点）。在这里，将其设置为 wipRoot，表示渲染工作从根节点开始
  deletions = [];
  //专门用于存放在更新过程中需要删除的节点。在 Fiber 更新机制中，如果某些节点不再需要，就会将它们放入 deletions，
  //最后在 commitRoot 阶段将它们从 DOM 中删除
}
/**
 * TODO: 创建 DOM 元素
 * @param {Object} fiber - 要创建 DOM 元素的 Fiber 节点
 * @returns {HTMLElement} - 创建的 DOM 元素
 */
function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}
/**
 * TODO: 更新 DOM 元素的属性
 * @param {HTMLElement} dom - 要更新的 DOM 元素
 * @param {Object} prevProps - 之前的属性
 * @param {Object} nextProps - 新的属性
 */
function updateDom(dom, prevProps, nextProps) {
  // 定义一个函数，用于判断属性是否为普通属性（非 children）
  const isProperty = (key) => key !== "children";
  Object.keys(prevProps)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = "";
    });
  Object.keys(nextProps)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
}
/**
 * TODO: 工作循环，处理任务队列中的工作单元
 * @param {Object} deadline - 包含浏览器空闲时间的信息
 */
function workLoop(deadline) {
  // 标记是否应该让出时间片
  let shouldYield = false;
  // 当存在下一个工作单元且不需要让出时间片时，执行工作
  while (nextUnitOfWork && !shouldYield) {
    // 执行下一个工作单元，并获取下一个工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 检查当前帧是否剩余时间小于 1ms
    shouldYield = deadline.timeRemaining() < 1;
  }
  // 如果没有下一个工作单元且存在正在工作的根节点，则提交根节点
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  // 注册下一次空闲回调
  requestIdleCallback(workLoop);
}

// 注册空闲回调函数，开始工作循环
requestIdleCallback(workLoop);

/**
 * TODO: 执行一个工作单元，并返回下一个工作单元
 * @param {Object} fiber - 当前的工作单元
 * @returns {Object} - 下一个工作单元
 */
function performUnitOfWork(fiber) {
  // 如果当前工作单元没有对应的 DOM 节点，则创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // 调和子节点，即处理当前工作单元的子节点
  reconcileChildren(fiber, fiber.props.children);

  // 如果当前工作单元有子节点，则返回子节点作为下一个工作单元
  if (fiber.child) {
    return fiber.child;
  }
  // 如果没有子节点，则返回下一个同级节点
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // 如果没有同级节点，则向上遍历父节点
    nextFiber = nextFiber.parent;
  }
  // 如果没有下一个工作单元，返回 null
  return null;
}

/**
 * TODO: 创建一个新的 Fiber 节点
 * @param {Object} element - 要创建的元素
 * @param {Object} parent - 父 Fiber 节点
 * @returns {Object} - 新创建的 Fiber 节点
 */
const createFiber = (element, parent) => {
  return {
    type: element.type,
    props: element.props,
    dom: null,
    parent,
    child: null,
    sibling: null,
    alternate: null,
    effectTag: "PLACEMENT",
  };
};

/**
 * TODO: 调和子节点，即处理当前工作单元的子节点
 * @param {Object} fiber - 当前的工作单元
 * @param {Array} elements - 子节点列表
 */
const reconcileChildren = (fiber, element) => {
  //1.形成fiber链表
  //2.diff 算法
  let index = 0;
  let prevSibling = null;
  let oldFiber = fiber.alternate && fiber.alternate.child; // 上一次渲染的 fiber 树的子节点
  while (index < element.length || oldFiber) {
    const elementFiber = element[index];
    //1.复用
    let newFiber = null;
    const sameType =
      oldFiber && elementFiber && oldFiber.type === elementFiber.type;
    if (sameType) {
      //复用
      newFiber = {
        type: oldFiber.type,
        props: elementFiber.props,
        dom: oldFiber.dom,
        parent: fiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
      console.log("复用", newFiber);
    }
    //2.新增
    if (elementFiber && !sameType) {
      newFiber = createFiber(elementFiber, fiber);
      newFiber.effectTag = "PLACEMENT";
      console.log("新增", newFiber);
    }
    //3.删除
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
      console.log("删除", oldFiber);
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (index === 0) {
      fiber.child = newFiber;
    } else if (elementFiber) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
};

// 提交根节点的工作
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

// 提交工作单元
function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

render(
  ReactLy.createElement(
    "div",
    { id: 1 },
    ReactLy.createElement("span", null, "hello 11")
  ),
  document.getElementById("root")
);
setTimeout(() => {
  render(
    ReactLy.createElement(
      "div",
      { id: 1 },
      ReactLy.createElement("h1", null, "hello 22")
    ),
    document.getElementById("root")
  );
}, 2000);
