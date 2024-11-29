import babel from "@babel/core";
import presetEnv from "@babel/preset-env"; //es6-to-es5 核心插件
import react from "@babel/preset-react"; //react 相关插件
import fs from "node:fs";

const code = fs.readFileSync("./test.js", "utf-8");

//手动封装一个处理箭头函数的插件
//types 包含各种AST方法
const transformFunction = ({ types: t }) => {
  return {
    name: "transformFunction",
    visitor: {
      ArrowFunctionExpression(path) {
        const node = path.node;
        console.log(node);
        //转换成普通function
        const functionNode = t.functionExpression(
          null, //node.id 是一个 Identifier 节点，表示函数名
          node.params, //node.params 是一个数组，表示函数的参数
          // BlockStatement 是 JavaScript 抽象语法树（AST）中的一种节点类型，表示一个由大括号 {} 包围的语句块。它是函数体、循环体、条件分支（如 if 语句）等代码块的基础结构
          t.blockStatement([t.returnStatement(node.body)]), //node.body 是函数的主体，通常是一个 BlockStatement 节点
          node.async //node.async 是一个布尔值，表示函数是否是异步的 (async 函数)
        );
        path.replaceWith(functionNode);
      },
    },
  };
};
const result = babel.transform(code, {
  //   presets: [
  //     [
  //       presetEnv,
  //       // usage - 按需加载 entry - 全部加载
  //       { useBuiltIns: "usage", corejs: 3 },
  //     ],
  //     react,
  //   ],
  plugins: [transformFunction],
});

console.log(result.code);
