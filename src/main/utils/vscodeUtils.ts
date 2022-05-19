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
}
