import Routes from '~/routes';
import './App.css';
import ScrollToTop from './components/common/Scroll/ScrollToTop';
import { NotifyProvider } from './context/ReLoginContext';

function App() {
  return (
    <NotifyProvider>
      <ScrollToTop />
      <Routes />
    </NotifyProvider>
  );
}

export default App;
