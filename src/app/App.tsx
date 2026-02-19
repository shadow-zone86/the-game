import { ToastContainer } from 'react-toastify';
import { PageLoader } from '@/shared/ui/PageLoader';
import { HomePage } from '@/pages/home';
import { useTheme } from './providers';

export function App() {
  const { theme } = useTheme();

  return (
    <>
      <PageLoader />
      <HomePage />
      <ToastContainer
        position="top-center"
        autoClose={4000}
        theme={theme}
      />
    </>
  );
}
