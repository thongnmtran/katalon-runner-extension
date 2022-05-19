import vscode from './vscode';


export function postEvent(type, data) {
  vscode.postMessage({
    type,
    data
  });
}

export function thenPostEvent(type, data) {
  return () => {
    postEvent(type, data);
  };
}
