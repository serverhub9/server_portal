import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
// render - sample page
const SubscribedProducts = Loadable(lazy(() => import('pages/subscribed_products/SamplePage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <SubscribedProducts />
    },
    
    {
      path: 'dashboard',
      element: <SubscribedProducts />
    },
   
  ]
};

export default MainRoutes;
