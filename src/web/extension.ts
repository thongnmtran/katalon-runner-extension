// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TestCaseEditorProvider } from '../editor-providers/TestCaseEditorProvider';


export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(TestCaseEditorProvider.register(context));

	console.log('Congratulations, your extension "katalon-runner" is now active in the web extension host!');

	let disposable = vscode.commands.registerCommand('katalon-runner.helloWorld', (...args) => {
		console.log(args);
		vscode.window.showInformationMessage('Hello World from Katalon Runner in a web extension host!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
