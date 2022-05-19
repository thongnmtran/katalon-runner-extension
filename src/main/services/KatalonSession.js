import EventName from 'main/utils/EventName';
import { io } from 'socket.io-client';


export default class KatalonSession {
  get connected() {
    return this.socket?.connected;
  }

  connect(url, options = {}) {
    return new Promise((resolve, reject) => {
      this.socket = io(url, {
        transports: ['websocket'],
        ...options
      });

      this.socket.on(EventName.connect, () => {
        console.log(`> Katalon session created  🚀 (${this.socket.id})`);
        resolve(this);
      });
      this.socket.on(EventName.disconnect, () => {
        console.warn('> Katalon session diconnected!');
      });
      this.socket.on(EventName.connectError, (error) => {
        console.log('> Katalon session error  🚀');
        reject(error);
      });
    });
  }

  disconnect() {
    return this.socket.disconnect();
  }

  log(message) {
    this.socket?.emit(EventName.log, message);
  }

  on(event, listener) {
    this.socket.on(event, listener);
    return this;
  }

  onP2P(event, listener) {
    this.p2p.on(event, listener);
    return this;
  }

  off(event, listener) {
    this.socket.off(event, listener);
    return this;
  }

  emit(event, ...args) {
    this.socket.emit(event, ...args);
  }

  sendTo(target, event, ...args) {
    this.socket.emit(EventName.sendTo, { target, event, args });
  }
}
