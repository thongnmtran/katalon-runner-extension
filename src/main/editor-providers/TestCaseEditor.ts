import GitHelper from 'main/helpers/GitHelpler';
import KatalonSession from 'main/services/KatalonSession';
import EventName from 'main/utils/EventName';
import ObjectUtils from 'main/utils/ObjectUtils';
import { getBaseName } from 'main/utils/utils';
import VSCodeUtils from 'main/utils/vscodeUtils';
import vscode from 'msvscode';
import { ViewColumn } from 'vscode';
import VirtualEditor from './VirtualEditor';

const { parse, find } = require('abstract-syntax-tree');


export default class TestCaseEditor extends VirtualEditor {
  private session: KatalonSession;

  private script: vscode.TextDocument;

  private scriptEditor: vscode.TextEditor;

  async init() {
    const testCasePath = this.document?.uri.path || '';
    const scriptDocument = await VSCodeUtils.getTestScript(testCasePath);
    this.script = scriptDocument;

    const scriptChangeSubscription = vscode.workspace.onDidChangeTextDocument((event) => {
      if (VSCodeUtils.isSame(event.document, scriptDocument)) {
        this.updateSteps();
      }
    });

    const scriptVisibleSubscription = vscode.window.onDidChangeVisibleTextEditors(() => {
      this.updateButtons();
    });

    const session = new KatalonSession();
    this.session = session;
    // await session.connect('ws://localhost:3000');
    await session.connect('wss://katalon-tunnel.herokuapp.com');
    session.on(EventName.log, (log: any) => {
      this.appendLog(log);
    });
    session.on(EventName.setInstances, (instances: any[]) => {
      this.updateInstances(instances);
    });
    session.emit(EventName.getInstances, (instances: any[]) => {
      this.updateInstances(instances);
    });
    session.on(EventName.disconnect, () => {
      this.updateSessionStatus();
    });
    session.on(EventName.connect, () => {
      this.updateSessionStatus();
    });
    this.updateContent();
    this.updateSessionStatus();

    this.onDispose(() => {
      session.disconnect();
      scriptChangeSubscription.dispose();
      scriptVisibleSubscription.dispose();
    });

    // Receive message from the webview.
    this.onMessage(async (event: any) => {
      switch (event.type) {
      case EventName.loaded:
        this.updateContent();
        session.emit(EventName.getInstances, (instances: any[]) => {
          this.updateInstances(instances);
        });
        break;
      case EventName.startNewInstance: {
        session.emit(EventName.startNewInstance);
        break;
      }
      case EventName.run: {
        // vscode.window.showInformationMessage('Trigger Run!');

        this.clearLog();
        // output.show();
        this.appendLog('╔════════════════════════════════════════════════╗'.padStart(90, ' '));
        this.appendLog('║                                                ║'.padStart(90, ' '));
        this.appendLog('║              🚀 Katalon Runner 🚀             ║'.padStart(89, ' '));
        this.appendLog('║                                                ║'.padStart(90, ' '));
        this.appendLog('╚════════════════════════════════════════════════╝'.padStart(90, ' '));
        this.appendLog('');

        session.sendTo(event.data?.instance?.id, EventName.run, `./build/${getBaseName(this.document.fileName)}.js`);
        break;
      }
      case EventName.stop:
        session.sendTo(event.data?.instance?.id, EventName.stop);
        break;
      case EventName.test:
        session.emit(EventName.getInstances, (instances: any[]) => {
          this.updateInstances(instances);
        });
        GitHelper.test();
        break;
      case EventName.openScript:
        this.scriptEditor = await vscode.window.showTextDocument(this.script, {
          viewColumn: ViewColumn.Beside,
          // preview: true,
          preserveFocus: true
        });
        break;
      case EventName.closeScript:
        vscode.window.showTextDocument(this.script.uri, { preview: true, preserveFocus: false })
          .then(() => vscode.commands.executeCommand('workbench.action.closeActiveEditor'));
        break;
      default:
        break;
      }
    });
  }

  private logs: string[] = [];

  private clearLog() {
    this.output.clear();
    this.logs = [];
  }

  private appendLog(log: string) {
    this.output.appendLine(log);
    this.logs.push(log);
    this.postMessage(EventName.setLogs, { logs: this.logs });
  }

  private async updateContent() {
    this.updateText();
    this.updateSteps();
    this.updateButtons();
  }

  private async updateSteps() {
    const testCasePath = this.document?.uri.path || '';
    const scriptDocument = await VSCodeUtils.getTestScript(testCasePath);
    const script = scriptDocument.getText();
    const tree = parse(script);

    let onReadyRoot: any;
    let hasFound = false;

    await ObjectUtils.everyPropRecursive({
      root: tree,
      verifier: () => !hasFound,
      resolver: ({ value, prop }) => {
        if (value && typeof value === 'object') {
          if (value?.callee?.object?.name === 'Katalon' && value?.callee?.property?.name === 'onReady') {
            hasFound = true;
            onReadyRoot = value;
          }
        }
        return value;
      }
    });

    const steps = onReadyRoot?.arguments?.[0]?.body?.body;
    this.postMessage(EventName.setSteps, {
      steps
    });
  }

  private async updateSessionStatus() {
    this.postMessage(EventName.setOnline, { online: this.session.connected });
  }

  private updateInstances(instances: any[]) {
    this.postMessage(EventName.setInstances, { instances });
  }

  private updateButtons() {
    const scriptOpened = vscode.window.visibleTextEditors.some(VSCodeUtils.findEditor(this.script));
    this.postMessage(EventName.setScriptOpened, { scriptOpened });
  }
}
