import {useState, createContext, useContext, useEffect} from 'react';
import {Platform} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';
import {PermissionsState} from '../states/permissionsState';

const PermissionsStateContext = createContext(undefined);
const PermissionsActionsContext = createContext(undefined);
const PermissionsContextProvider = ({children}) => {
  const androidRequiredPermissions = [
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
    PERMISSIONS.ANDROID.CAMERA,
  ];
  const iosRequiredPermissions = [
    PERMISSIONS.IOS.LOCATION_ALWAYS,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
  ];
  const [permissionsState, setPermissionsState] = useState(
    new PermissionsState({
      isLoading: true,
      unavailable: [],
      granted: [],
      denied: [],
      error: null,
    }),
  );
  useEffect(() => {
    checkAndRequestRequiredPermissions();
  }, []);

  const checkRequiredPermissions = async () => {
    setPermissionsState({
      isLoading: true,
      granted: [],
      denied: [],
      unavailable: [],
      error: null,
    });
    const granted = [];
    const unavailable = [];
    const denied = [];
    if (Platform.OS === 'android') {
      const result = await checkMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.CAMERA,
      ]);
      androidRequiredPermissions.forEach(permission => {
        if (result[permission] === RESULTS.GRANTED) {
          granted.push(permission);
        } else if (result[permission] === RESULTS.UNAVAILABLE) {
          unavailable.push(permission);
        } else {
          denied.push(permission);
        }
      });
    } else if (Platform.OS === 'ios') {
      const result = await checkMultiple([
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
      ]);
      iosRequiredPermissions.forEach(permission => {
        if (result[permission] === RESULTS.GRANTED) {
          granted.push(permission);
        } else if (result[permission] === RESULTS.UNAVAILABLE) {
          unavailable.push(permission);
        } else {
          denied.push(permission);
        }
      });
    }
    setPermissionsState({
      isLoading: false,
      granted,
      denied,
      unavailable,
      error: null,
    });
    return {granted, unavailable, denied};
  };

  const requestRequiredPermissions = async ({unavailable, granted, denied}) => {
    requestMultiple([...denied, ...unavailable]).then(async result => {
      checkRequiredPermissions();
    });
  };

  const checkAndRequestRequiredPermissions = async () => {
    const permissions = await checkRequiredPermissions();
    requestRequiredPermissions(permissions);
  };

  return (
    <PermissionsStateContext.Provider
      value={{
        permissionsState,
      }}>
      <PermissionsActionsContext.Provider
        value={{
          checkRequiredPermissions,
          requestRequiredPermissions,
          checkAndRequestRequiredPermissions,
        }}>
        {/* <PermissionsScreen /> */}
        {children}
      </PermissionsActionsContext.Provider>
    </PermissionsStateContext.Provider>
  );
};

const usePermissionsState = () => {
  const context = useContext(PermissionsStateContext);
  if (context === undefined) {
    throw new Error('usePermissionsState error');
  }

  return context;
};

const usePermissionsActions = () => {
  const context = useContext(PermissionsActionsContext);
  if (context === undefined) {
    throw new Error('usePermissionsActions error');
  }

  return context;
};

export {
  usePermissionsState,
  usePermissionsActions,
  PermissionsContextProvider,
  PermissionsStateContext,
  PermissionsActionsContext,
};
