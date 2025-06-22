"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{user: User, token: string}>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
  socialLoginLoading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [socialLoginLoading, setSocialLoginLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        console.log('Checking authentication state...');
        console.log('Stored token:', storedToken ? 'exists' : 'none');

        if (!storedToken) {
          console.log('No token found, user is not authenticated');
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Ensure the auth cookie is set if we have a token in localStorage
        // This fixes the issue where localStorage has token but cookie doesn't
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
        
        if (!authCookie && storedToken) {
          console.log('Setting missing auth cookie from localStorage token');
          document.cookie = `auth_token=${storedToken}; path=/; max-age=${60*60*24*7}; SameSite=Strict`;
        }

        // For demo purposes, we'll use the stored user data directly
        // In a real app, you would validate the token with your backend
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log('User data found in localStorage:', userData);
            setUser(userData);
            setToken(storedToken);
            setIsAuthenticated(true);
            console.log('User authenticated from localStorage');
            setIsLoading(false);
            return;
          } catch (e) {
            console.error('Error parsing stored user data:', e);
          }
        }

        // Fallback to API call if no stored user data or parsing failed
        console.log('Fetching user data from API...');
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }

        const userData = await response.json();
        console.log('User data fetched from API:', userData);
        setUser(userData);
        setToken(storedToken);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Clear the auth cookie
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll simulate a successful login
      // In a real app, this would be an API call
      console.log('Simulating login for:', email);
      
      // Mock user data
      const mockUser = {
        id: 'user-' + Math.random().toString(36).substring(2),
        email: email,
        firstName: 'Demo',
        lastName: 'User',
        role: 'CUSTOMER',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      const mockToken = 'auth-token-' + Math.random().toString(36).substring(2);
      
      // Store in localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      console.log('Stored auth data in localStorage');
      
      // Set auth cookie for middleware authentication
      document.cookie = `auth_token=${mockToken}; path=/; max-age=${60*60*24*7}; SameSite=Strict`;
      console.log('Set auth_token cookie for middleware');
      
      // Then update state
      setUser(mockUser);
      setToken(mockToken);
      setIsAuthenticated(true);
      console.log('Updated authentication state');
      
      return { user: mockUser, token: mockToken };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register');
      }

      // Automatically log in after successful registration
      await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      
      // Remove auth data from localStorage first
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear the auth cookie
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
      console.log('Cleared auth_token cookie');
      
      // Then clear auth state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      console.log('Logout successful, localStorage, cookies, and state cleared');
      
      // Force redirect to home page after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setSocialLoginLoading(true);
    try {
      console.log('Starting Google login...');
      // In a real implementation, this would redirect to Google OAuth
      // For demo purposes, we'll simulate a successful login
      const mockGoogleUser = {
        id: 'google-123456',
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        role: 'CUSTOMER', // Match the role format used in the app
        profileImageUrl: 'https://lh3.googleusercontent.com/a/default-user=s120',
      };
      const mockToken = 'google-mock-token-' + Math.random().toString(36).substring(2);
      
      // Store in localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockGoogleUser));
      console.log('Stored Google auth data in localStorage');
      
      // Set auth cookie for middleware authentication
      document.cookie = `auth_token=${mockToken}; path=/; max-age=${60*60*24*7}; SameSite=Strict`;
      console.log('Set auth_token cookie for middleware');
      
      // Then update state
      setUser(mockGoogleUser);
      setToken(mockToken);
      setIsAuthenticated(true);
      console.log('Google login successful, authentication state updated');
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    } finally {
      setSocialLoginLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setSocialLoginLoading(true);
    try {
      console.log('Starting Facebook login...');
      const mockFacebookUser = { id: 'facebook-123456', email: 'user@facebook.com', firstName: 'Facebook', lastName: 'User', role: 'CUSTOMER', profileImageUrl: 'https://randomuser.me/api/portraits/women/45.jpg' };
      const mockToken = 'facebook-mock-token-' + Math.random().toString(36).substring(2);
      
      // Store in localStorage first
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockFacebookUser));
      
      // Set auth cookie for middleware authentication
      document.cookie = `auth_token=${mockToken}; path=/; max-age=${60*60*24*7}; SameSite=Strict`;
      console.log('Set auth_token cookie for middleware');
      
      // Then update state
      console.log('Setting user state with:', mockFacebookUser);
      setUser(mockFacebookUser);
      setToken(mockToken);
      setIsAuthenticated(true);
      
      console.log('Facebook login successful, localStorage, cookie and state updated');
      return true;
    } catch (error) {
      console.error('Facebook login error:', error);
      return false;
    } finally {
      setSocialLoginLoading(false);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    socialLoginLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
