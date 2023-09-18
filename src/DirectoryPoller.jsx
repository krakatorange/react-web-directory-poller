import React, { useState, useEffect } from 'react';
import './DirectoryPoller.css';

function DirectoryPoller() {
  const [dirHandle, setDirHandle] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [changes, setChanges] = useState({ added: [], removed: [] });

  const isIPhone = /iPhone/.test(navigator.userAgent);
  const isDesktop = !/Mobi|Android/.test(navigator.userAgent);

  const readDirectory = async (handle) => {
    const files = [];
    for await (const entry of handle.values()) {
      files.push(entry.name);
    }
    return files;
  };

  const checkForChanges = (prevFiles, currentFiles) => {
    return {
      added: currentFiles.filter(file => !prevFiles.includes(file)),
      removed: prevFiles.filter(file => !currentFiles.includes(file))
    };
  };

  useEffect(() => {
    const pollDirectory = async () => {
      if (dirHandle) {
        const currentFiles = await readDirectory(dirHandle);
        const detectedChanges = checkForChanges(fileList, currentFiles);

        if (detectedChanges.added.length || detectedChanges.removed.length) {
          setChanges(detectedChanges);
        }

        setFileList(currentFiles);
      }
    };

    const interval = setInterval(pollDirectory, 1000);
    return () => clearInterval(interval);
  }, [dirHandle, fileList]);

  const selectDirectory = async () => {
    try {
      let handle;
      console.log("desktop: " + isDesktop)
      console.log("iphone: " + isIPhone)
      const windowProperties = Object.getOwnPropertyNames(window).sort();
      console.log(windowProperties);
      if (isDesktop) {
        handle = await window.showDirectoryPicker();
      }
      else if (isIPhone) {
        handle = await navigator.storage.getDirectory();
      } else {
        throw new Error("Unsupported device.");
      }
      setDirHandle(handle);
    } catch (error) {
      console.error("Directory selection failed:", error);
    }
  };

  return (
    <div className="container">
      <button onClick={selectDirectory}>Select Directory</button>
      <div>
        <h3>Current Directory Contents</h3>
        <ul>
          {fileList.map(file => <li key={file}>{file}</li>)}
        </ul>
      </div>
      <div className="detected-changes">
        <h3>Detected Changes</h3>
        <p>Added: {changes.added.join(', ')}</p>
        <p>Removed: {changes.removed.join(', ')}</p>
      </div>
    </div>
  );
}

export default DirectoryPoller;