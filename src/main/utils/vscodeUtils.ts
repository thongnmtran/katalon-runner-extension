import vscode from 'msvscode';

export default class VSCodeUtils {
  static getOutput(label = 'Katalon Runner') {
    const output = vscode.window.createOutputChannel(label, 'javascript'); // powershell
    return output;
  }

  static async getTestScript(testCasePath: string) {
    const basePath = testCasePath.replace('Test Cases', 'Scripts').replace('.tc', '');
    const pattern = new vscode.RelativePattern(basePath, '*.groovy');
    const scriptFiles = await vscode.workspace.findFiles(pattern);
    const scriptFile = scriptFiles[0];
    return vscode.workspace.openTextDocument(scriptFile);
  }
}
