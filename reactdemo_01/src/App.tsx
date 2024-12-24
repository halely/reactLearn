// import UseReducerDemo from "./components/useReducerDemo";//useReducer
// import HighlightDemo from "./components/highlightDemo";//highlight
import SyncExternalStoreDemo from "./components/useSyncExternalStoreDemo";
import './App.scss'
import hbxmc from './assets/css/hbxmc.module.scss'
function App() {
  return (
    <>
      <div className={hbxmc.box}>
        <SyncExternalStoreDemo></SyncExternalStoreDemo>
      </div>
    </>
  );
}

export default App;
