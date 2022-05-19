// eslint-disable-next-line import/no-unresolved
import vscode from 'vscode';
import TestCaseEditorProvider from './editor-providers/TestCaseEditorProvider';
import TestSuiteEditorProvider from './editor-providers/TestSuiteEditorProvider';


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(TestCaseEditorProvider.register(context));
  context.subscriptions.push(TestSuiteEditorProvider.register(context));

  console.log('Congratulations, your extension "katalon-runner" is now active in the web extension host!');

  const disposable = vscode.commands.registerCommand('katalon-runner.helloWorld', (...args) => {
    console.log(args);
    vscode.window.showInformationMessage('Hello World from Katalon Runner in a web extension host!');
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
