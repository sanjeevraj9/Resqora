import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const SockJS = require('sockjs-client');

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private client?: Client;
  private connected = false;
  private subscribed = false;

  messages$ = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient
  ) {}

  connect(userId: number) {

    if (this.client && this.connected) {
      return;
    }

    this.client = new Client({
      webSocketFactory: () =>
        new SockJS(environment.wsUrl),

      reconnectDelay: 5000,

      onConnect: () => {
        

        this.connected = true;

        if (!this.subscribed) {
          this.client?.subscribe(
            `/topic/chat/${userId}`,
            (msg: IMessage) => {
              const received =
                JSON.parse(msg.body);

              const current =
                this.messages$.getValue();

              this.messages$.next([
                ...current,
                received
              ]);
            }
          );

          this.subscribed = true;
        }
      },

      onDisconnect: () => {
        
        this.connected = false;
        this.subscribed = false;
      },

      onStompError: (err) => {
        console.error(err);
      },

      onWebSocketError: (err) => {
        console.error(err);
      }
    });

    this.client.activate();
  }

  sendMessage(
    senderId: number,
    receiverId: number,
    bookingId: number,
    content: string
  ) {
    this.client?.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        senderId,
        receiverId,
        bookingId,
        content
      })
    });
  }

  loadHistory(bookingId: number) {
    const token =
      localStorage.getItem('token');

    return this.http.get(
      `${environment.apiUrl}/api/chat/history/${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  isConnected(): boolean {
    return this.connected;
  }
}