import React, { Component } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/dark.css";
export default class App extends Component {
  componentDidMount() {
    this.highlightCallBack();
  }
  componentDidUpdate() {
    this.highlightCallBack();
  }
  highlightCallBack = () => {
    document.querySelectorAll("pre").forEach((block) => {
      try {
        hljs.highlightBlock(block);
      } catch (e) {
        console.log(e);
      }
    });
  };
  render() {
    return (
      <div className="container">
        <pre className="language-jsx">
          <code>
            import React, {"\u007b"} Component {"\u007d"} from 'react' {"\n"}
            import hljs from 'highlight.js';{"\n"}
            import 'highlight.js/styles/default.css';
          </code>
        </pre>
      </div>
    );
  }
}
