import React, { Component } from "react";

const handleInstallClick = () => {
  const test = window.electron.sendMessage("check-version");
  console.log(test);
};

class VersionChecker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      versionInfo: {
        javaHome: undefined,
        classPath: undefined,
        path: undefined,
      },
    };

    console.log("----");
    window.electron.on("ipc-test", (res) => {
      console.log(res);
    });
  }

  componentDidMount() {}

  componentWillUnmount() {
    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
  }

  render() {
    return (
      <div>
        <button onClick={handleInstallClick}>버전확인</button>
        <h2> JavaVersion Checker </h2>

        <h3> JAVA Install List </h3>
        <ul>
          <li> zz </li>
        </ul>
      </div>
    );
  }
}

export default VersionChecker;
