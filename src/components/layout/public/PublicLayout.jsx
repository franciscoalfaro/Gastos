import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Header } from './Header';

export const PublicLayout = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [auth, navigate]);

  return (
    <>
      <Header />
      {auth && auth._id ? <Navigate to="/auth"></Navigate> : <Outlet></Outlet>}
    </>
  );
};
