/* eslint-disable max-len */
/* eslint-disable no-useless-constructor */
import EventName from 'main/utils/EventName';
import vscode from 'msvscode';
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

  protected webviewPanel?: vscode.WebviewPanel;

  protected webview?: vscode.Webview;

  protected document?: vscode.TextDocument;

  constructor(
    protected readonly context: vscode.ExtensionContext
  ) {
    //
  }

  protected postMessage(type: string, data: any) {
    this.webview?.postMessage({
      type,
      ...(data || {})
    });
  }

  protected updateText() {
    this.postMessage('update', { text: this.document?.getText() });
  }

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    this.webviewPanel = webviewPanel;
    this.webview = webviewPanel.webview;
    this.document = document;

    webviewPanel.webview.options = {
      enableScripts: true
    };
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
    webviewPanel.iconPath = vscode.Uri.joinPath(this.context.extensionUri, 'media', 'paw-color.svg');
    webviewPanel.title = 'Test Case';

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.uri.toString() === document.uri.toString()) {
        this.updateText();
      }
    });

    // Make sure we get rid of the listener when our editor is closed.
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
      this.dispose();
    });

    vscode.window.onDidChangeActiveColorTheme((event) => {
      this.postMessage(EventName.setTheme, { data: event.kind });
    });

    this.init();
  }

  // eslint-disable-next-line class-methods-use-this
  protected dispose() {
    //
  }

  // eslint-disable-next-line class-methods-use-this
  protected init() {

  }

  protected onMessage(listener: vscode.Event<any>) {
    this.webview?.onDidReceiveMessage(listener);
  }

  protected getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'build', 'client.js'));
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
