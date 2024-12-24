import { useReducer } from "react";
/*
 * @description  useReducer
 * @example  const [state, dispatch] = useReducer(reducer, initialArg, init?)
 * @param {
 *   state: 状态
 *   dispatch: 派发action
 *   reducer: 是一个处理函数 接收state和action，返回新的state
 *   initialArg: 初始值
 *   init?: 初始化函数,如果编写了init函数，则默认值使用init函数的返回值，否则使用initialArg。
 * }
 */
const initData = [
  { name: "小满(只)", price: 100, count: 1, id: 1, isEdit: false },
  { name: "中满(只)", price: 200, count: 1, id: 2, isEdit: false },
  { name: "大满(只)", price: 300, count: 1, id: 3, isEdit: false },
];

type List = typeof initData;
interface Action {
  type: "ADD" | "SUB" | "DELETE" | "EDIT" | "UPDATE_NAME";
  id: number;
  newName?: string;
}

function listReducer(state: List, action: Action) {
  console.log("Action:", action);
  console.log("Current State:", state);
  const item = state.find((item) => item.id === action.id)!;
  console.log("触发");
  switch (action.type) {
    case "ADD":
      item.count++;
      return [...state];
    case "SUB":
      item.count--;
      return [...state];
    case "DELETE":
      return state.filter((item) => item.id !== action.id);
    case "EDIT":
      item.isEdit = !item.isEdit;
      return [...state];
    case "UPDATE_NAME":
      item.name = action.newName!;
      return [...state];
    default:
      return state;
  }
}
export default function UseReducerDemo() {
  const [state, stateDispatch] = useReducer(
    (state, action: { type: string }) => {
      switch (action.type) {
        case "add":
          return state + 1;
        case "minus":
          return state - 1;
        default:
          return state;
      }
    },
    0
  );
  const [data, dispatch] = useReducer(listReducer, initData);
  return (
    <>
      <button onClick={() => stateDispatch({ type: "add" })}>
        add count is {state}
      </button>
      <button onClick={() => stateDispatch({ type: "minus" })}>
        reduce count is {state}
      </button>
      <table cellPadding={10} cellSpacing={0} width={800} border={1}>
        <thead>
          <tr>
            <th>物品</th>
            <th>价格</th>
            <th>数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            return (
              <tr key={item.id}>
                <td align="center">
                  {item.isEdit ? (
                    <input
                      onBlur={() => dispatch({ type: "EDIT", id: item.id })}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_NAME",
                          id: item.id,
                          newName: e.target.value,
                        })
                      }
                      value={item.name}
                    />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </td>
                <td align="center">{item.price * item.count}</td>
                <td align="center">
                  <button
                    onClick={() => {
                      dispatch({ type: "SUB", id: item.id });
                      console.log(121);
                    }}
                  >
                    -
                  </button>
                  <span>{item.count}</span>
                  <button
                    onClick={() => dispatch({ type: "ADD", id: item.id })}
                  >
                    +
                  </button>
                </td>
                <td align="center">
                  <button
                    onClick={() => dispatch({ type: "EDIT", id: item.id })}
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => dispatch({ type: "DELETE", id: item.id })}
                  >
                    删除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}></td>
            <td align="center">
              总价:
              {data.reduce((prev, next) => prev + next.price * next.count, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
