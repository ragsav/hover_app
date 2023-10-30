import {createContext, useEffect, useState, useContext} from 'react';
import {AuthState} from '../states/authState';
import {SignInState} from '../states/signInState';
import {SignOutState} from '../states/signOutState';
import {CONSTANTS} from '../../../constants';

import firebaseAuth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useSocketActions, useSocketState} from './socketContext';
import {UserSocketConnection} from '../../data/models/userSocketConnection';
import {User} from '../../data/models/user';

const AuthStateContext = createContext(undefined);
const AuthActionsContext = createContext(undefined);
const AuthContextProvider = ({children}) => {
  // const { initMessaging } = usePushNotificationActions();
  // const queryClient = useQueryClient();
  // console.log({queryClient});
  const {connectSocket} = useSocketActions();
  const {socket} = useSocketState();
  const [resendOTPState, setResendOTPState] = useState({
    prevSentAt: null,
    resendPhoneNumber: null,
    isResendable: false,
  });
  const [authState, setAuthState] = useState(
    new AuthState({isLoading: true, user: null, error: null}),
  );

  const [signInState, setSignInState] = useState(
    new SignInState({
      isLoading: false,
      success: false,
      error: null,
      confirmationResult: null,
    }),
  );
  const [signOutState, setSignOutState] = useState(
    new SignOutState({isLoading: false, success: false, error: null}),
  );
  const [firebaseAuthToken, setFirebaseUserAuthToken] = useState(null);

  // TODO : add fetch DB user method
  // const {
  //   isLoading: isLoadingDBUser,
  //   isFetching: isFetchingDBUser,
  //   data: dbUser,
  //   error: dbUserError,
  // } = useQuery(
  //   [CONSTANTS.REACT_QUERY_KEYS.DB_USER],
  //   () => {
  //     return null;
  //   },
  //   {
  //     enabled: Boolean(firebaseAuthToken),
  //     cacheTime: Infinity,
  //     retry: 3,
  //     staleTime: Infinity,
  //   },
  // );

  // user socket
  useEffect(() => {
    let userSocketConnection;

    if (socket) {
      userSocketConnection = new UserSocketConnection({
        socket,
        callback: onDBUserUpdate,
      });
    }
    return () => {
      userSocketConnection?.unsubscribe();
    };
  }, [socket]);

  // effect for setting up firebase auth listener
  useEffect(() => {
    const unsub = watchAuth();
    return unsub;
  }, []);

  // TODO : check if this part can be done in fetch query
  // effect for initial user fetch
  // useEffect(() => {
  //   setAuthState(
  //     new AuthState({
  //       isLoading: (isLoadingDBUser || !dbUser) && !dbUserError,
  //       user: dbUser,
  //       error: dbUserError,
  //     }),
  //   );
  // }, [isLoadingDBUser, dbUser, dbUserError]);

  // firebase auth listener
  const watchAuth = () => {
    setAuthState(new AuthState({isLoading: true, user: null, error: null}));
    const unsub = firebaseAuth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        setFirebaseUserAuthToken(token);
        setAuthState(
          new AuthState({isLoading: false, user: user, error: null}),
        );
        connectSocket(token);
        console.log({token});
        // initMessaging();
      } else {
        setFirebaseUserAuthToken(null);
        // TODO : add proper error here
        setAuthState(
          new AuthState({isLoading: false, user: null, error: null}),
        );
      }
    });
    return unsub;
  };

  /**
   *
   * @param {object} param0
   * @param {String} param0.phoneNumber
   * @param {Boolean} param0.resend
   */
  const sendOTP = async ({phoneNumber}) => {
    try {
      setSignInState({
        isLoading: true,
        success: false,
        error: null,
        recaptchaVerifier: null,
        confirmationResult: null,
      });

      const confirmationResult = await firebaseAuth().signInWithPhoneNumber(
        `+91${phoneNumber.toString()}`,
      );
      console.log(confirmationResult);
      setResendOTPState({
        prevSentAt: Date.now(),
        resendPhoneNumber: `+91${phoneNumber.toString()}`,
      });
      setSignInState({
        isLoading: false,
        success: false,
        error: null,
        recaptchaVerifier: null,
        confirmationResult,
      });
    } catch (error) {
      setSignInState({
        isLoading: false,
        success: false,
        error,
        recaptchaVerifier: null,
        confirmationResult: null,
      });
      console.log(error);
    }
  };

  /**
   *
   * @param {String} OTP
   * @param {FirebaseAuthTypes.ConfirmationResult} confirmationResult
   * @returns
   */
  const confirmOTP = async OTP => {
    setSignInState({
      ...signInState,
      isLoading: true,
      success: false,
      error: null,
    });
    try {
      await signInState.confirmationResult?.confirm(OTP);
      setSignInState({
        isLoading: false,
        success: true,
        error: null,
        recaptchaVerifier: null,
        confirmationResult: null,
      });
    } catch (error) {
      setSignInState({
        ...signInState,
        isLoading: false,
        success: false,
        error,
      });
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      setSignOutState({isLoading: true, success: false, error: null});
      await firebaseAuth().signOut();
      setSignOutState({isLoading: false, success: true, error: null});
    } catch (error) {
      setSignOutState({isLoading: false, success: false, error});
    }
  };

  /**
   *
   * @param {User} dbUser
   */
  const onDBUserUpdate = dbUser => {
    if (dbUser) {
      setAuthState({isLoading: false, user: dbUser, error: null});
    } else {
      // TODO : add proper error here
      setAuthState({isLoading: false, user: dbUser, error: null});
    }
  };

  const refreshUser = async () => {
    // await queryClient.invalidateQueries([CONSTANTS.REACT_QUERY_KEYS.DB_USER]);
  };

  return (
    <AuthStateContext.Provider
      value={{
        authState,
        signInState,
        signOutState,
        resendOTPState,
        firebaseAuthToken,
      }}>
      <AuthActionsContext.Provider
        value={{
          sendOTP,
          confirmOTP,
          signOut,
          onDBUserUpdate,
        }}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState error');
  }

  return context;
};

const useAuthActions = () => {
  const context = useContext(AuthActionsContext);
  if (context === undefined) {
    throw new Error('useAuthActions error');
  }

  return context;
};

export {
  useAuthState,
  useAuthActions,
  AuthContextProvider,
  AuthStateContext,
  AuthActionsContext,
};
