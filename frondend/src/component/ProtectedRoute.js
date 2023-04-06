import React from 'react';
import { Route, Navigate } from 'react-router-dom';

export default function ProtectedRoute({ element: Component, ...rest }) {
  const isAuthenticated = localStorage.getItem('user');
  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Component /> : <Navigate to="/login" />}
    />
  );
}
