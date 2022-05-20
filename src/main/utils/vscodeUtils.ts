import vscode from 'msvscode';

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
}
