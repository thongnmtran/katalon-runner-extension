export default function acquireVsCodeApi() {
  window.vscode = window.vscode || window.acquireVsCodeApi();
  return window.vscode;
}
