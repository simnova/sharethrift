// Workspace-wide ambient types to help the editor/tools resolve JSX and certain 3rd-party modules during isolated checks.
// These are loose types and do not affect runtime.

declare module 'antd' {
  export const Tabs: any;
  const _default: any;
  export default _default;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
