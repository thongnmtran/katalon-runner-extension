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

  static async test() {
    const changes = await this.showChanges();
    console.log(changes);
  }
}
