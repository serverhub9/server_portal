import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));
const AuthVerifyAccount = Loadable(lazy(() => import('pages/authentication/ResetPassword')));
const AuthResetPasswordNew = Loadable(lazy(() => import('pages/authentication/ResetPasswordNew')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: 'register',
      element: <AuthRegister />
    },
    {
      path: 'verify_account',
      element: <AuthVerifyAccount />
    },
    {
      path: 'reset_password',
      element: <AuthResetPasswordNew />
    }
  ]
};

export default LoginRoutes;
