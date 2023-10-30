import {CONSTANTS} from '../../../constants';
import {User} from './user';

export class UserSocketConnection {
  constructor({socket, callback}) {
    this.socket = socket;
    this.callback = callback;

    this.socket.on(CONSTANTS.SOCKET_EVENTS.ON_USER_UPDATE, user => {
      if (!user || user === undefined || user === null) {
        callback(null);
      } else {
        callback(new User(user));
      }
    });
  }
  unsubscribe() {
    this.socket?.off(CONSTANTS.SOCKET_EVENTS.ON_USER_UPDATE);
  }
}
