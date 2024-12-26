import { App } from "../index";

declare global {
  interface Window {
    electron: {
      onLoad: () => void;
      apps: (callback: (data: App[]) => void) => void;
      openApp: (name: string, shortcut: string) => void;
      background: (callback: (name: string) => void) => void;
      openLink: (url: string) => void;
      selectBanner: (shortcut: string) => void;
      selectedBanner: (callback: (banner: string, shortcut: string) => void) => void;
      saveChanges: (newValue: string) => void;
      shortcutsFolder: () => void;
    }
  }
}

export {};
