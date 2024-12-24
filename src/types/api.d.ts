import { App } from "../index";

declare global {
  interface Window {
    electron: {
      onLoad: () => void;
      apps: (callback: (data: App[]) => void) => void;
      openApp: (name: string, shortcut: string) => void;
    }
  }
}

export {};
