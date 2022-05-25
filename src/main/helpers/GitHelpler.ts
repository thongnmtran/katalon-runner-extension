/* eslint-disable max-len */
import VSCodeUtils from 'main/utils/vscodeUtils';
import vscode from 'msvscode';
import {
  API as GitAPI, GitExtension, APIState, Repository
} from './git.d';


const isChildOf = (child?: string, parent?: string) => {
  if (child === parent) { return false; }
  const parentTokens = parent?.split('/').filter((i) => i.length);
  return parentTokens?.every((t, i) => child?.split('/')[i] === t);
};

export default class GitHelper {
  private static _api?: GitAPI;

  private static _repository?: Repository;

  static get api(): GitAPI {
    if (!this._api) {
      this.init();
    }
    return this._api;
  }

  static get repository(): Repository {
    if (!this._api) {
      this.init();
    }
    return this._repository;
  }

  static init() {
    const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;
    const api = gitExtension?.getAPI(1);
    this._api = api;
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri?.toString();
    const repository = api?.repositories.find(
      (repoI: any) => isChildOf(repoI.rootUri.fsPath, rootPath)
    );
    this._repository = repository;
  }

  static async showChanges() {
    // return this.repository?.diff();
    const gitSCM = vscode.scm.createSourceControl('git', 'Git');
    // const gitSCM = vscode.scm.createSourceControl('git', 'Git');
    console.log(gitSCM.quickDiffProvider);
    console.log(gitSCM.rootUri);
  }

  static async getChanges() {
    await vscode.commands.executeCommand('remoteHub.exportPatch', { preserveFocus: false });
    const changesFile = vscode.workspace.textDocuments.find((docI) => docI.isUntitled && docI.languageId === 'diff');
    const changes = changesFile?.getText();

    if (!changes) {
      return null;
    }

    // await VSCodeUtils.clearText(changesFile);
    // await VSCodeUtils.hide(changesFile);
    await VSCodeUtils.close(changesFile, true);

    return `${changes.replace(/^--- /gm, '--- a/').replace(/^\+\+\+ /gm, '+++ b/')}\r\n`;
  }

  static async test() {
    const git = vscode.extensions.getExtension('ms-vscode.remote-repositories').exports;

    const changes = await this.getChanges();
    console.log(changes);
  }
}
