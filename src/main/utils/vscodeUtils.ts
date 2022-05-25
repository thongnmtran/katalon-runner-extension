import vscode from 'msvscode';
import { TextDocument, TextEditor } from 'vscode';

export default class VSCodeUtils {
  static getOutput(label = 'Katalon Runner') {
    const output = vscode.window.createOutputChannel(label, 'javascript'); // powershell
    return output;
  }

  static async getTestScript(testCasePath: string) {
    const basePath = testCasePath.replace('Test Cases', 'Scripts').replace('.tc', '');
    const roots = await vscode.workspace.workspaceFolders;
    const relativePath = basePath.replace(`${roots[0].uri.path}/`, '');
    const pattern = `**/${relativePath}/*.groovy`;
    const scriptFiles = await vscode.workspace.findFiles(pattern, '**/node_modules/**');
    const scriptFile = scriptFiles[0];
    return vscode.workspace.openTextDocument(scriptFile);
  }

  static findDocument = (
    document: vscode.TextDocument
  ) => (documentI: vscode.TextDocument) => this.isSame(documentI, document);

  static findEditor = (
    document: vscode.TextDocument
  ) => (editorI: vscode.TextEditor) => this.isSame(editorI.document, document);

  static isSame = (
    documentA: vscode.TextDocument,
    documentB: vscode.TextDocument
  ) => documentA?.uri?.toString() === documentB?.uri?.toString();

  static async hide(document: TextDocument) {
    const targetEditor = vscode.window.visibleTextEditors.find(this.findEditor(document));
    targetEditor.hide();
  }

  static async close(document: TextDocument, force = false) {
    const closeCommand = force ? 'workbench.action.revertAndCloseActiveEditor' : 'workbench.action.closeActiveEditor';
    await vscode.window.showTextDocument(document.uri, { preview: true, preserveFocus: false });
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    await vscode.commands.executeCommand(closeCommand);
  }

  static async clearText(document: vscode.TextDocument) {
    if (!document.getText()) {
      return true;
    }
    const edit = new vscode.WorkspaceEdit();
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      ''
    );
    return vscode.workspace.applyEdit(edit);
  }
}
