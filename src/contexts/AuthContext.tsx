import { useUserProfile } from '@/hooks/use-user';
import { userService } from '@/services';
import { UserProfile } from '@/types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('accessToken')
  );
  const [userWithPermissions, setUserWithPermissions] = useState<UserProfile | null>(null);

  const { data: user, isLoading: isLoadingProfile } = useUserProfile();
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  // Fetch permissions when user profile is loaded
  useEffect(() => {
    const fetchPermissions = async () => {
      if (user?.id && accessToken) {
        setIsLoadingPermissions(true);
        try {
          const permissions = await userService.getUserPermissions(user.id);
          setUserWithPermissions({ ...user, permissions });
        } catch (error) {
          console.error('Failed to fetch permissions:', error);
          // Set user without permissions if fetch fails
          setUserWithPermissions({ ...user, permissions: [] });
        } finally {
          setIsLoadingPermissions(false);
        }
      } else {
        setUserWithPermissions(null);
      }
    };

    fetchPermissions();
  }, [user, accessToken]);

  useEffect(() => {
    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = () => {
      setAccessToken(localStorage.getItem('accessToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (access: string, refresh: string) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setAccessToken(access);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUserWithPermissions(null);
  };

  const value: AuthContextType = {
    user: userWithPermissions,
    isAuthenticated: !!accessToken,
    isLoading: isLoadingProfile || isLoadingPermissions,
    accessToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
