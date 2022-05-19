import axios from 'axios';
import VSCodeUtils from 'main/utils/vscodeUtils';
import vscode from 'msvscode';
import KatalonSession from '../services/KatalonSession';
import ObjectUtils from '../utils/ObjectUtils';
import BaseEditorProvider from './BaseEditorProvider';

const { parse, find } = require('abstract-syntax-tree');

export default class TestSuiteEditorProvider extends BaseEditorProvider {
  protected static get viewType() {
    return 'katalon-runner.editor.testsuite';
  }

  private async updateContent() {
    this.updateText();
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
    this.postMessage('set-steps', {
      steps
    });
  }

  private updateAgents(agentId: string) {
    const agents = [agentId].map((idI) => (idI ? ({
      id: idI,
      status: 'online'
    }) : null)).filter((agent) => agent);
    this.postMessage('set-agents', { agents });
  }

  protected async init() {
    const output = VSCodeUtils.getOutput();

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
    this.webview?.onDidReceiveMessage(async (event) => {
      switch (event.type) {
      case 'loaded':
        this.updateContent();
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
        output.appendLine('║              🚀 Katalon Runner 🚀             ║'.padStart(89, ' '));
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
              session.emit('get-agent', (agentId2: string) => {
                if (agentId2) {
                  clearInterval(timer[0]);
                  session.sendTo(agentId2, 'run', './build/firstTest.js');
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
}
