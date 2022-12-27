import { ComponentType } from 'react';

import { UserProvider } from '@/react/hooks/useUser';

export function withCurrentUser<T>(
  WrappedComponent: ComponentType<T>
): ComponentType<T> {
  // Try to create a nice displayName for React Dev Tools.
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  function WrapperComponent(props: T & JSX.IntrinsicAttributes) {
    return (
      <UserProvider>
        <WrappedComponent {...props} />
      </UserProvider>
    );
  }

  WrapperComponent.displayName = `withCurrentUser(${displayName})`;

  return WrapperComponent;
}
