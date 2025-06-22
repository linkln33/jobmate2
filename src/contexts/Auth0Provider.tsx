"use client";

import { Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface Auth0ProviderWithNavigateProps {
  children: ReactNode;
}

export const Auth0ProviderWithNavigate = ({ children }: Auth0ProviderWithNavigateProps) => {
  const router = useRouter();

  // Temporarily using placeholder values for development
  const domain = 'dev-placeholder.auth0.com';
  const clientId = 'placeholder-client-id';
  const redirectUri = typeof window !== 'undefined' ? window.location.origin + '/dashboard' : '';

  const onRedirectCallback = (appState: any) => {
    router.push(appState?.returnTo || '/dashboard');
  };

  // Removed the null check to prevent white screen
  // if (!(domain && clientId)) {
  //   return null;
  // }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
