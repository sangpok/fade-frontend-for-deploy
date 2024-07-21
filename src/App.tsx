import { queryClient } from '@Libs/queryclient';
import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig, Transition } from 'framer-motion';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routesFromElements } from './routes';

/** Router */
const browserRouter = createBrowserRouter(routesFromElements);

/** Motion Config */
const transitionConfig: Transition = {
  ease: [0.16, 1, 0.3, 1],
  duration: 0.5,
};

export default function App() {
  return (
    <MotionConfig transition={transitionConfig}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={browserRouter} />
      </QueryClientProvider>
    </MotionConfig>
  );
}
