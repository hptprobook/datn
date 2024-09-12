import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter basename="/">
    <QueryClientProvider client={QueryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
