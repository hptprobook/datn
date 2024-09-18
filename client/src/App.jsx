import Routes from '~/routes';
import './App.css';
import ScrollToTop from './components/common/Scroll/ScrollToTop';
import { NotifyProvider } from './context/ReLoginContext';
import { useIsFetching } from '@tanstack/react-query';
import MainLoading from './components/common/Loading/MainLoading';

function App() {
  const isFetching = useIsFetching();

  return (
    <NotifyProvider>
      <ScrollToTop />
      {isFetching > 0 && <MainLoading />}
      <Routes />
    </NotifyProvider>
  );
}

export default App;
