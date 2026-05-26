import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent
  implements OnInit, OnDestroy, OnChanges {

  @Input() userId!: number;
  @Input() receiverId!: number;
  @Input() bookingId!: number;

  messages: any[] = [];
  newMessage = '';

  private initialized = false;
  private messageSub?: Subscription;

  constructor(
    private chatService: ChatService
  ) {}

  ngOnInit() {}

  ngOnChanges(
    changes: SimpleChanges
  ) {
    if (
      !this.initialized &&
      this.userId &&
      this.receiverId &&
      this.bookingId
    ) {
      this.initialized = true;
      this.loadChat();
    }
  }

  loadChat() {
    this.chatService
      .loadHistory(this.bookingId)
      .subscribe((history: any) => {
        this.messages = history || [];
      });

    this.chatService.connect(this.userId);

    this.messageSub =
      this.chatService.messages$
        .subscribe(msgs => {
          if (msgs.length) {
            this.messages = [
              ...this.messages,
              ...msgs
            ];

            this.chatService.messages$.next([]);
          }
        });
  }

 send() {
  if (!this.newMessage.trim()) return;
  
  const tempMessage = {
    senderId: this.userId,
    receiverId: this.receiverId,
    bookingId: this.bookingId,
    content: this.newMessage,
    timeStamp: new Date()
  };

  this.messages = [
    ...this.messages,
    tempMessage
  ];

  this.chatService.sendMessage(
    this.userId,
    this.receiverId,
    this.bookingId,
    this.newMessage
  );

  this.newMessage = '';
}

  get canSend(): boolean {
    return this.chatService.isConnected();
  }

  ngOnDestroy() {
    this.messageSub?.unsubscribe();
  }
}