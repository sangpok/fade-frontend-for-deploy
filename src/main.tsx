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

enableMocking().then(() => {
  import('./App.tsx').then((App) => {
    ReactDOM.createRoot(document.getElementById('root')!).render(<App.default />);
  });
});
