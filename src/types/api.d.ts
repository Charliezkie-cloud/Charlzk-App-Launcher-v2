export {};

declare global {
  interface Window {
    electron: {
      onLoad: () => void;
      onLoadReply: (callback: (message: string) => void) => void;
    }
  }
}
