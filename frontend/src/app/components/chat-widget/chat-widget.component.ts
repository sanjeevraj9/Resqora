import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserShellHeaderComponent } from '../user-shell-header/user-shell-header.component';

interface Message {
  from: 'user' | 'agent';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, UserShellHeaderComponent],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss']
})
export class ChatWidgetComponent {
  
  inputText = '';
  isTyping = false;

  messages: Message[] = [
    {
      from: 'agent',
      text: '👋 Hi! I\'m Rani from Resqora Support. How can I help you today?',
      time: this.getTime()
    }
  ];

  quickReplies = [
    'I need roadside help 🚨',
    'Check my subscription',
    'Towing service near me',
    'Talk to a human agent'
  ];

  botResponses: Record<string, string> = {
    'roadside': '🚨 I\'m connecting you to the nearest available rescue team right now! Please share your live location via the app or call 1800-RESQORA.',
    'subscription': '📋 Please share your registered mobile number and I\'ll pull up your plan details instantly.',
    'towing': '🏗️ Got it! Towing service is available 24/7. I need your current location to dispatch the nearest provider.',
    'human': '👤 Connecting you to a live agent now... Expected wait: ~2 minutes. Please stay on chat.',
    'default': '✅ Thank you! Our support team will assist you right away. For urgent help, call 1800-RESQORA (24/7).'
  };

  

  getTime(): string {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  sendQuick(reply: string) {
    this.inputText = reply;
    this.sendMessage();
  }

  sendMessage() {
    const text = this.inputText.trim();
    if (!text) return;

    this.messages.push({ from: 'user', text, time: this.getTime() });
    this.inputText = '';
    this.isTyping = true;

    setTimeout(() => {
      this.isTyping = false;
      const lower = text.toLowerCase();
      let response = this.botResponses['default'];
      if (lower.includes('road') || lower.includes('stuck') || lower.includes('help')) response = this.botResponses['roadside'];
      else if (lower.includes('sub') || lower.includes('plan')) response = this.botResponses['subscription'];
      else if (lower.includes('tow')) response = this.botResponses['towing'];
      else if (lower.includes('human') || lower.includes('agent')) response = this.botResponses['human'];

      this.messages.push({ from: 'agent', text: response, time: this.getTime() });
    }, 1400);
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') this.sendMessage();
  }
}
