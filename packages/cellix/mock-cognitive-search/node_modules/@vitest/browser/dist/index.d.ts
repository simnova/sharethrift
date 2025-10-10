import { Plugin } from 'vite';
import { WorkspaceProject } from 'vitest/node';

declare const _default: (project: WorkspaceProject, base?: string) => Plugin[];

export { _default as default };
