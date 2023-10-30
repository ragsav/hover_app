import React, {createContext, useEffect, useState} from 'react';
import io from 'socket.io-client';
import {CONSTANTS} from '../../../constants';

const SocketStateContext = createContext(undefined);
const SocketActionsContext = createContext(undefined);

const SocketContextProvider = ({children}) => {
  const [socket, setSocket] = useState();
  useEffect(() => {
    return () => {
      socket?.close();
    };
  }, []);

  const connectSocket = token => {
    socket?.close();
    let newSocket = io(CONSTANTS.SOCKET_SERVER, {
      auth: {
        token,
      },
    });
    setSocket(newSocket);
  };

  return (
    <SocketStateContext.Provider value={{socket}}>
      <SocketActionsContext.Provider value={{connectSocket}}>
        {children}
      </SocketActionsContext.Provider>
    </SocketStateContext.Provider>
  );
};

const useSocketState = () => {
  const context = React.useContext(SocketStateContext);
  if (context === undefined) {
    throw new Error('useSocketState error');
  }

  return context;
};

const useSocketActions = () => {
  const context = React.useContext(SocketActionsContext);
  if (context === undefined) {
    throw new Error('useSocketActions error');
  }

  return context;
};

export {SocketContextProvider, useSocketActions, useSocketState};
