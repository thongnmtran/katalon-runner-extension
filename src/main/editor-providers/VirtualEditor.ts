import EventName from 'main/utils/EventName';
import { getBaseName } from 'main/utils/utils';
import VSCodeUtils from 'main/utils/vscodeUtils';
import vscode from 'msvscode';


export default abstract class VirtualEditor {
  document: vscode.TextDocument;

  webvewPanel: vscode.WebviewPanel;

  get webview() {
    return this.webvewPanel.webview;
  }

  output: vscode.OutputChannel;

  private _token: vscode.CancellationToken;

  disposeListeners: any[] = [];

  changeListeners: any[] = [];

  async setup(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ) {
    this.document = document;
    this.webvewPanel = webviewPanel;
    this._token = _token;
    this.output = VSCodeUtils.getOutput(getBaseName(this.document.fileName));

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.uri.toString() === document.uri.toString()) {
        this.updateText();
        this.changeListeners.forEach((listenerI) => listenerI?.());
      }
    });

    vscode.window.onDidChangeActiveColorTheme((event) => {
      this.postMessage(EventName.setTheme, { data: event.kind });
    });

    this.onDispose(() => {
      this.output?.dispose();
      changeDocumentSubscription.dispose();
    });

    this.webvewPanel.onDidDispose(() => {
      this.disposeListeners.forEach((listenerI) => listenerI?.());
    });

    this.init();
  }

  abstract init(): Promise<any>;

  onDispose(callback: any) {
    this.disposeListeners.push(callback);
  }

  onChange(callback: any) {
    this.changeListeners.push(callback);
  }

  onMessage(listener: any) {
    this.webview?.onDidReceiveMessage(listener);
  }

  postMessage(type: string, data: any) {
    this.webview?.postMessage({
      type,
      ...(data || {})
    });
  }

  updateText() {
    this.postMessage('update', { text: this.document?.getText() });
  }
}
