import vscode from 'msvscode';
import BaseEditorProvider from './BaseEditorProvider';
import TestSuiteEditor from './TestSuiteEditor';


export default class TestSuiteEditorProvider extends BaseEditorProvider {
  protected static get viewType() {
    return 'katalon-runner.editor.testsuite';
  }

  // eslint-disable-next-line class-methods-use-this
  protected async init(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ) {
    new TestSuiteEditor().setup(document, webviewPanel, _token);
  }
}
