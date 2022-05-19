import EventName from 'main/utils/EventName';
import { getBaseName } from 'main/utils/utils';
import VSCodeUtils from 'main/utils/vscodeUtils';
import vscode from 'msvscode';
import KatalonSession from '../services/KatalonSession';
import ObjectUtils from '../utils/ObjectUtils';
import BaseEditorProvider from './BaseEditorProvider';

const { parse, find } = require('abstract-syntax-tree');

export default class TestCaseEditorProvider extends BaseEditorProvider {
  protected static get viewType() {
    return 'katalon-runner.editor.testcase';
  }

  private session: KatalonSession;

  private output: vscode.OutputChannel;

  private async updateSteps() {
    const testCasePath = this.document?.fileName || '';
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

  private async updateContent() {
    this.updateText();
    this.updateSteps();
  }

  private async updateSessionStatus() {
    this.postMessage(EventName.setOnline, { online: this.session.connected });
  }

  private updateInstances(instances: any[]) {
    this.postMessage(EventName.setInstances, { instances });
  }

  protected dispose(): void {
    this.session?.disconnect();
    this.output?.dispose();
  }

  protected async init() {
    // const output = vscode.window.createOutputChannel('Katalon Runner', 'javascript');
    const output = VSCodeUtils.getOutput(getBaseName(this.document.fileName));
    this.output = output;

    const session = new KatalonSession();
    this.session = session;
    // await session.connect('ws://localhost:3000');
    await session.connect('wss://katalon-tunnel.herokuapp.com');
    session.on(EventName.log, (log: any) => {
      output.appendLine(log);
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

    // Receive message from the webview.
    this.webview?.onDidReceiveMessage(async (event: any) => {
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

        output.clear();
        output.show();
        output.appendLine('╔════════════════════════════════════════════════╗'.padStart(90, ' '));
        output.appendLine('║                                                ║'.padStart(90, ' '));
        output.appendLine('║              🚀 Katalon Runner 🚀             ║'.padStart(89, ' '));
        output.appendLine('║                                                ║'.padStart(90, ' '));
        output.appendLine('╚════════════════════════════════════════════════╝'.padStart(90, ' '));
        output.appendLine('');

        session.sendTo(event.data?.instance?.id, EventName.run, `./build/${getBaseName(this.document.fileName)}.js`);
        break;
      }
      case EventName.stop:
        session.sendTo(event.data?.instance?.id, EventName.stop);
        break;
      case EventName.openScript: {
        const testCasePath = this.document?.fileName || '';
        const scriptDocument = await VSCodeUtils.getTestScript(testCasePath);
        vscode.window.showTextDocument(scriptDocument);
      }
        break;
      default:
        break;
      }
    });
  }
}
