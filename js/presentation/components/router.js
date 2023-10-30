import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CONSTANTS from '../../../constants';
import {useAuthState} from '../../logic/contexts/authContext';
import SignInScreen from '../screens/SignInScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import Home from '../screens/HomeScreen';
// import {PermissionsScreen} from '../screens/PermissionsScreen';

const Stack = createNativeStackNavigator();

export const Router = ({}) => {
  const {authState} = useAuthState();
  // checking internet connectivity
  //   useEffect(() => {
  //     const unsubscribe = NetInfo.addEventListener(state => {
  //       dispatch(checkInternetSuccess({...state}));
  //     });
  //     return () => {
  //       unsubscribe();
  //     };
  //   }, []);
  //   useEffect(() => {
  //     GrinFCM.backgroundMessageSubscription();
  //     return GrinFCM.foregroundMessageSubscription(dispatch);
  //   }, []);

  //   return isCheckingLocationPermission || isCheckingCameraPermission || true ? (
  //     <Loading />
  //   ) : (!checkingInternetSuccess ||
  //       !checkingInternetSuccess.isConnected ||
  //       checkingInternetFailure) &&
  //     !user ? (
  //     <NoInternet />
  //   ) : !locationPermissionState || !cameraPermissionState ? (
  //     <PermissionScreen />
  //   ) :
  return (
    // : getOngoingTransactionFailure &&
    //   getOngoingTransactionFailure.code ===
    //     CONSTANTS.ERROR_CODES.PENDING_PAYMENT.code ? (
    //   <PendingPayment />
    // )
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'/'}>
        <Stack.Screen
          name={'/'}
          component={
            authState && authState.user && !authState.isLoading
              ? Home
              : authState && authState.isLoading
              ? () => (
                  <View>
                    <Text>Loading...</Text>
                  </View>
                )
              : SignInScreen
          }
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'/permissions'}
          component={PermissionsScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
