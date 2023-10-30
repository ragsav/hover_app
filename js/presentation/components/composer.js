// import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {SocketContextProvider} from '../../logic/contexts/socketContext';
import {AuthContextProvider} from '../../logic/contexts/authContext';
import {PermissionsContextProvider} from '../../logic/contexts/permissionsContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// const queryClient = new QueryClient();
export const Composer = ({children}) => {
  return (
    // <QueryClientProvider client={queryClient}>
    <SafeAreaProvider>
      <PermissionsContextProvider>
        <SocketContextProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </SocketContextProvider>
      </PermissionsContextProvider>
    </SafeAreaProvider>

    // </QueryClientProvider>
  );
};
