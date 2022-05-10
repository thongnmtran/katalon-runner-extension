import axios from 'axios';
import * as vscode from 'vscode';
import KatalonSession from './KatalonSession';
import { getNonce } from './util';


export class TestCaseEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new TestCaseEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(TestCaseEditorProvider.viewType, provider, {
			webviewOptions: {
				retainContextWhenHidden: true
			}
		});
		return providerRegistration;
	}

	private static readonly viewType = 'katalon-runner.editor.testcase';

	private webview?: vscode.Webview;

	private document?: vscode.TextDocument;

	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	private updateText() {
		this.webview?.postMessage({
			type: 'update',
			text: this.document?.getText(),
		});
	}

	private updateAgents(agentId: string) {
		const agents = [agentId].map(idI => idI ? ({
			id: idI,
			status: 'online'
		}) : null).filter(agent => agent);
		this.webview?.postMessage({
			type: 'set-agents',
			agents: agents,
		});
	}

	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		this.webview = webviewPanel.webview;
		this.document = document;

		webviewPanel.webview.options = {
			enableScripts: true,
		};
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
		webviewPanel.iconPath = vscode.Uri.joinPath(
			this.context.extensionUri, 'media', 'paw-color.svg');
		webviewPanel.title = 'Test Case';

		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((event) => {
			if (event.document.uri.toString() === document.uri.toString()) {
				this.updateText();
			}
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});
					
		let output = vscode.window.createOutputChannel("Katalon Runner", "javascript"); // powershell

		const session = new KatalonSession();
		// await session.connect('ws://localhost:3000');
		await session.connect('wss://katalon-tunnel.herokuapp.com');
		session.on('log', (log: any) => {
			output.appendLine(log);
		});
		session.on('agent', (agentId: string) => {
			this.updateAgents(agentId);
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(async (event) => {
			switch (event.type) {
				case 'loaded':
					this.updateText();
					session.emit('get-agent', (agentId: string) => {
						this.updateAgents(agentId);
					});
					break;
				case 'run': {
					vscode.window.showInformationMessage('Trigger Run!');
					// vscode.window.withProgress()

					output.clear();
					output.show();
					output.appendLine('╔════════════════════════════════════════════════╗'.padStart(90, ' '));
					output.appendLine('║                                                ║'.padStart(90, ' '));
					output.appendLine('║                Katalon Runner 🚀               ║'.padStart(90, ' '));
					output.appendLine('║                                                ║'.padStart(90, ' '));
					output.appendLine('╚════════════════════════════════════════════════╝'.padStart(90, ' '));
					output.appendLine('');

					session.emit('get-agent', (agentId: string) => {
						if (agentId) {
							this.updateAgents(agentId);
							session.sendTo(agentId, 'run', './build/firstTest.js');
						} else {
							axios.post('https://cloudbuild.googleapis.com/v1/projects/tidal-mode-347602/triggers/cloud-agent-autorun:webhook?key=AIzaSyAr76dUVOK2Nx2Nuhpy8aFui5LXJILc2yc&secret=ebeb0e7a-4adf-49da-86a2-edad7bfe03e8', {})
								.then((res) => {
									vscode.window.showInformationMessage('Trigger Run successfully!');
								})
								.catch((error) => {
									vscode.window.showInformationMessage('Trigger Run unsuccessfully!', error?.message);
								});
							const timer: any[] = [];
							const runOnStarted = () => {
								session.emit('get-agent', (agentId: string) => {
									if (agentId) {
										clearInterval(timer[0]);
										session.sendTo(agentId, 'run', './build/firstTest.js');
									}
								});
							};
							timer[0] = setInterval(runOnStarted, 5000);
						}
					});

					break;
				}
				case 'stop':
					session.emit('get-agent', (agentId: string) => {
						session.sendTo(agentId, 'stop');
					});
					break;
				default:
					break;
			}
		});
	}

	private getHtmlForWebview(webview: vscode.Webview): string {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'build', 'client.js'));
		const bundleJs = scriptUri;
		// const bundleJs = 'http://localhost:8080/client.js';

		// const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(
		// 	this.context.extensionUri, 'media', 'reset.css'));

		// const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(
		// 	this.context.extensionUri, 'media', 'vscode.css'));

		// const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(
		// 	this.context.extensionUri, 'media', 'catScratch.css'));

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
				<script nonce="${nonce}" src="${bundleJs}"></script>
			</body>
			</html>`;
	}

	/**
	 * Write out the json to a given document.
	 */
	private updateTextDocument(document: vscode.TextDocument, json: any) {
		const edit = new vscode.WorkspaceEdit();

		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			JSON.stringify(json, null, 2)
		);

		return vscode.workspace.applyEdit(edit);
	}
}