import { useRoutes } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import PostRoutes from './PostRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function Routes() {
  return useRoutes([MainRoutes, AuthRoutes, PostRoutes]);
}
