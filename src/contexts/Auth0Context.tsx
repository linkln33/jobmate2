"use client";

import { createContext, useContext, ReactNode, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface Auth0ContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  loginWithRedirect: () => void;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  logout: () => void;
  socialLoginLoading: boolean;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

export function Auth0ContextProvider({ children }: { children: ReactNode }) {
  // Use Auth0 hooks with fallback for development
  const auth0 = useAuth0();
  
  // Mock user for development
  const mockUser = {
    email: 'user@example.com',
    name: 'Test User',
    given_name: 'Test',
    family_name: 'User',
    picture: 'https://ui-avatars.com/api/?name=Test+User',
    sub: 'auth0|123456789',
    avatarUrl: 'https://ui-avatars.com/api/?name=Test+User',
  };
  
  // Development mode state
  const [devModeAuthenticated, setDevModeAuthenticated] = useState(false);
  
  // Fallback implementation for development
  const isAuthenticated = auth0.isAuthenticated || devModeAuthenticated;
  const isLoading = auth0.isLoading || false;
  const user = auth0.user || (devModeAuthenticated ? mockUser : null);
  const socialLoginLoading = isLoading;
  
  // Fallback loginWithRedirect function
  const loginWithRedirect = auth0.loginWithRedirect || (() => {
    console.log('Auth0 not configured: loginWithRedirect called');
    // For development, simulate successful login
    setDevModeAuthenticated(true);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 500);
  });

  // Login with Google - development implementation
  const loginWithGoogle = () => {
    console.log('Auth0 Google login called - using development implementation');
    // For development, simulate successful login
    setDevModeAuthenticated(true);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 500);
  };

  // Login with Facebook - development implementation
  const loginWithFacebook = () => {
    console.log('Auth0 Facebook login called - using development implementation');
    // For development, simulate successful login
    setDevModeAuthenticated(true);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 500);
  };

  // Logout function with fallback
  const logout = () => {
    if (auth0.logout) {
      auth0.logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } else {
      console.log('Auth0 not configured: logout called');
      // For development, simulate logout
      window.location.href = '/';
    }
  };

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        loginWithRedirect,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        socialLoginLoading,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
}

export function useAuth() {
  const context = useContext(Auth0Context);
  if (context === undefined) {
    throw new Error('useAuth must be used within an Auth0ContextProvider');
  }
  return context;
}
