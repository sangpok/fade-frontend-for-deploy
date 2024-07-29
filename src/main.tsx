import ReactDOM from 'react-dom/client';
import './index.css';

export async function enableMocking(enabled: boolean = false) {
  // if (import.meta.env.PROD || !enabled) {
  if (!enabled) {
    return;
  }

  const { worker } = await import('./__mock__/instance.ts');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

const LOCALSTORAGE_KEY = 'FADE_API_MOCKING_ENABLED' as const;

const isMockEnabled = (localStorage.getItem(LOCALSTORAGE_KEY) as 'true' | 'false' | undefined) === 'true' ? true : false;

enableMocking(isMockEnabled).then(() => {
  import('./App.tsx').then((App) => {
    ReactDOM.createRoot(document.getElementById('root')!).render(<App.default />);
  });
});
