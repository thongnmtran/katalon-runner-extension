/* eslint-disable max-len */
import { getNonce } from 'main/utils/utils';
import vscode from 'msvscode';


export default class TestsExplorerViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'katalon.view.explorer';

  private _view?: vscode.WebviewView;

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly _extensionUri: vscode.Uri
  ) {
    //
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this._extensionUri
      ]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
      case 'colorSelected':
      {
        vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`#${data.value}`));
        break;
      }
      default:
        break;
      }
    });
  }

  public addColor() {
    if (this._view) {
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage({ type: 'addColor' });
    }
  }

  public clearColors() {
    if (this._view) {
      this._view.webview.postMessage({ type: 'clearColors' });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'build', 'ExplorerView.js'));

    const nonce = getNonce();

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
      <title>Cat Colors</title>
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
  }
}
