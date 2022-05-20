/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-useless-constructor */
import EventName from 'main/utils/EventName';
import vscode from 'msvscode';
import { CancellationToken, TextDocument, WebviewPanel } from 'vscode';
// eslint-disable-next-line import/no-unresolved
import { getNonce } from '../utils/utils';


export default class BaseEditorProvider implements vscode.CustomTextEditorProvider {
  protected static get viewType() {
    return 'katalon-runner.editor.katalonEditor';
  }

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new this(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      this.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    );
    return providerRegistration;
  }

  constructor(
    protected readonly context: vscode.ExtensionContext
  ) {
    //
  }

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true
    };
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
    webviewPanel.iconPath = vscode.Uri.joinPath(this.context.extensionUri, 'media', 'paw-color.svg');
    webviewPanel.title = 'Test Case';

    this.init(document, webviewPanel, _token);
  }

  // eslint-disable-next-line class-methods-use-this
  protected async init(document: TextDocument, webviewPanel: WebviewPanel, _token: CancellationToken) {
    //
  }

  protected getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'build', 'TestCaseEntry.js'));
    const bundleJs = scriptUri;
    // const bundleJs = 'http://localhost:8080/client.js';

    // const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(
    //   this.context.extensionUri, 'media', 'reset.css'));

    // const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(
    //   this.context.extensionUri, 'media', 'vscode.css'));

    // const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(
    //   this.context.extensionUri, 'media', 'catScratch.css'));

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    // <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

    return /* html */`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Scratch</title>
      </head>
      <body>
        <div id="root"></div>
        <script nonce="${nonce}" src="${bundleJs}?${(<any>(this.constructor)).viewType}"></script>
      </body>
      </html>`;
  }

  /**
   * Write out the json to a given document.
   */
  // private updateTextDocument(document: vscode.TextDocument, json: any) {
  //   const edit = new vscode.WorkspaceEdit();

  //   edit.replace(
  //     document.uri,
  //     new vscode.Range(0, 0, document.lineCount, 0),
  //     JSON.stringify(json, null, 2)
  //   );

  //   return vscode.workspace.applyEdit(edit);
  // }
}
