import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private stompClient?: Client;
  private connected = false;

  private initConnection() {
    if (this.stompClient) return;

    const token =
      localStorage.getItem('token');

    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8082/ws',

      connectHeaders: {
        Authorization: `Bearer ${token}`
      },

      reconnectDelay: 5000,

      onConnect: () => {
        console.log('WEBSOCKET CONNECTED');
        this.connected = true;
      },

      onStompError: (frame) => {
        console.error('STOMP ERROR:', frame);
      },

      onWebSocketError: (err) => {
        console.error('WS ERROR:', err);
      }
    });

    this.stompClient.activate();
  }

  connect(
    topic: string,
    callback: (data: any) => void
  ) {
    this.initConnection();

    const waitForConnection =
      setInterval(() => {

        if (
          this.connected &&
          this.stompClient
        ) {
          this.stompClient.subscribe(
            topic,
            (message) => {
              callback(
                JSON.parse(message.body)
              );
            }
          );

          clearInterval(
            waitForConnection
          );
        }

      }, 300);
  }

  disconnect() {
    this.stompClient?.deactivate();
    this.connected = false;
    this.stompClient = undefined;
  }
}