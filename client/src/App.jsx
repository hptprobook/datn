import Routes from '~/routes';
import './App.css';
import ScrollToTop from './components/common/Scroll/ScrollToTop';
import { NotifyProvider } from './context/ReLoginContext';
import PhoneSignIn from './components/Auth/PhoneSignIn';

const App = () => {
  return (
    <NotifyProvider>
      <ScrollToTop />
      <Routes />
      <PhoneSignIn />
    </NotifyProvider>
  );
};

export default App;
