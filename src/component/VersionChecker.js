import React, { Component } from "react";

const handleInstallClick = () => {
  const test = window.electron.sendMessage("check-version");
};

class VersionChecker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      versionInfo: {
        javaHome: undefined,
        classPath: undefined,
        path: undefined,
        dirList: [],
      },
    };

    console.log("----");
  }

  updateVersion = (versionInfo) => {
    this.setState({
      versionInfo: versionInfo,
    });
  };

  componentWillMount() {
    window.electron.on("ipc-test", (res) => {
      this.updateVersion(res);
    });
  }

  componentDidMount() {
    const test = window.electron.sendMessage("check-version");
  }

  render() {
    const { versionInfo } = this.state;
    return (
      <div>
        <hr></hr>
        <button onClick={handleInstallClick}>reload</button>
        <h2> JavaVersion Checker </h2>
        <div>
          <h4> --- javaHome ---</h4>
          <div>{versionInfo.javaHome}</div>
          <h4> --- classPath ---</h4>
          <div>{versionInfo.classPath}</div>
          <h4> --- path ---</h4>
          <div>{versionInfo.envPath}</div>
          <h4> --- dirList ---</h4>
          <div>
            {versionInfo.dirList.map((dir, index) => (
              <div key={index}>{dir}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default VersionChecker;
