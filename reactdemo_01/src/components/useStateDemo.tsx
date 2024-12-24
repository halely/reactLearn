import { useState } from "react";

export default function UseStateHook() {
  const [count, setCount] = useState(0);
  const [arr, setArr] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const onChangeArr = () => {
    const cloneArr = [...arr]; // 浅拷贝
    cloneArr.splice(5, 0, 100);
    setArr(cloneArr);
  };
  return (
    <>
      <button
        onClick={() => {
          setCount((count) => count + 1);
          onChangeArr();
        }}
      >
        count is {count}===== {arr.join(",")}
      </button>
    </>
  );
}
