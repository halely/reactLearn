const swc = require("@swc/core");

const result = swc.transformFileSync("./test.jsx", {
  jsc: {
    parser: {
      syntax: "ecmascript",
      jsx: true,
    },
    target: "es5",
  },
});

console.log(result.code);
