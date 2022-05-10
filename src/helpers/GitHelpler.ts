import * as vscode from 'vscode';
import { API as GitAPI, GitExtension, APIState, Repository } from './git';


const isChildOf = (child?: string, parent?: string) => {
  if (child === parent) { return false; }
  const parentTokens = parent?.split('/').filter((i) => i.length);
  return parentTokens?.every((t, i) => child?.split('/')[i] === t);
};

export default class GitHelper {
  static api?: GitAPI;

  static repository?: Repository;

  static init() {
    const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;
    const api = gitExtension?.getAPI(1);
    this.api = api;
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri?.toString();
    const repository = api?.repositories.find(
      (repoI: any) => isChildOf(repoI.rootUri.fsPath, rootPath)
    );
    this.repository = repository;
  }

  static showChanges() {
    return this.repository?.diff();
  }
}
