import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute — wraps any route that requires an active session.
 * Uses sessionStorage so that clearing storage OR opening a new tab
 * always kicks the user back to /login.
 */
export default function ProtectedRoute({ children }) {
  const session = sessionStorage.getItem('cinestream_session');
  if (session !== 'active') {
    return <Navigate to="/login" replace />;
  }
  return children;
}
