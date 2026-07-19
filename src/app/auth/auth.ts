import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useUser } from '@/entities/User';

export const useAuth = () => {
  const {
    user,
    isLoading,
    error: userError,
    refetchUser,
  } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isLoading && !userError && !user && pathname !== '/reg') {
      navigate('/reg', { replace: true });
    }
  }, [isLoading, navigate, pathname, user, userError]);

  return {
    isLoading,
    user,
    error: userError,
    retry: refetchUser,
  };
};
