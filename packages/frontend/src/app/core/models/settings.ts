export interface ServerSettings {
  host: string;
  port?: number;
}
export interface Settings {
  server: ServerSettings;
  wakeLock: boolean;
  autoFullscreen: boolean;
}
