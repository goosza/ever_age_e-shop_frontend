export {};

declare global {
  interface Window {
    _env_?: {
      VITE_ZASILKOVNA_API_KEY?: string;
    };
  }
}