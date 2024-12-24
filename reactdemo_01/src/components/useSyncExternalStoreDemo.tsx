import { useStorage } from "../hooks/useStorage";
import { useHistory } from "../hooks/useHistory";
/*
 * @description const res = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
 * @param {
 * subscribe：用来订阅数据源的变化，接收一个回调函数，在数据源更新时调用该回调函数。
 * getSnapshot：获取当前数据源的快照（当前状态）。
 * getServerSnapshot?：在服务器端渲染时用来获取数据源的快照。
 * }
 */

export default function UseSyncExternalStoreDemo() {
  const [count, setCount] = useStorage("count", 0);
  const [url, pushUrl, replaceUrl] = useHistory();
  return (
    <>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
      <h2>{url}</h2>
      <button onClick={() => pushUrl("/A")}>push</button>
      <button onClick={() => replaceUrl("/B")}>replace</button>
    </>
  );
}
