export type TurnstileRenderOptions = {
  sitekey: string;
  action?: string;
  execution?: 'render' | 'execute';
  callback?: (token: string) => void;
  'error-callback'?: (code?: string) => void;
  'expired-callback'?: () => void;
};

export type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile: TurnstileApi; 
  }
}