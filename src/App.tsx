import React, { useState } from 'react';
// const { ipcRenderer } = window.require('electron');

function App() {
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);

  const handleVersionSelect = (version: string) => {
    setHistory([...history, selectedVersion]);
    setSelectedVersion(version !== selectedVersion ? version : "");
  };

  const handleInstallClick = () => {
//    ipcRenderer.send('install-java', "aaa");
  };

  const handleSetEnvClick = () => {
//    ipcRenderer.send('set-env');
  };

  const handleGoBackClick = () => {
    if (history.length > 0) {
      const previousVersion = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setSelectedVersion(previousVersion);
    }
  };

  const handleGoMainListClick = () => {
    setSelectedVersion("");
  };

  return (
    <div>
      {selectedVersion === "" ? (
        <button onClick={() => handleVersionSelect("java")}>java</button>
      ) : (
        <div>
          <button onClick={handleGoBackClick}>뒤로가기</button>
          <button onClick={handleGoMainListClick}>첫 화면으로 가기</button>
          {selectedVersion === "java" ? (
            <div>
              <button onClick={() => handleVersionSelect("java8")}>java8</button>
              <button onClick={() => handleVersionSelect("java17")}>java17</button>
            </div>
          ) : null}
          {selectedVersion === "java8" || selectedVersion === "java17" ? (
            <div>
              <button onClick={() => handleInstallClick()}>install</button>
              <button onClick={() => handleSetEnvClick()}>set env</button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default App;
