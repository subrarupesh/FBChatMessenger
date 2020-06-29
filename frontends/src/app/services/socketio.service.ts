import * as io from 'socket.io-client';
import {environment} from './../../environments/environment';

export class SocketioService {
  constructor() {
  }
  getSocketConnection() {
    return io(environment.SOCKET_ENDPOINT);
  }
  // sendMessage(msgObject) {
  //   this.socket.emit('MSG_SENT', msgObject);
  // }
}
