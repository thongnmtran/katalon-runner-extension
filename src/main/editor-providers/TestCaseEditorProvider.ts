import vscode from 'msvscode';
import BaseEditorProvider from './BaseEditorProvider';
import TestCaseEditor from './TestCaseEditor';


export default class TestCaseEditorProvider extends BaseEditorProvider {
  protected static get viewType() {
    return 'katalon-runner.editor.testcase';
  }

  // eslint-disable-next-line class-methods-use-this
  protected async init(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ) {
    new TestCaseEditor().setup(document, webviewPanel, _token);
  }
}
