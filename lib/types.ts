export type RevealStyle = 'scratch' | 'blur' | 'typewriter' | 'flip';

export type Message = {
  id: string;
  content: string;
  revealStyle: RevealStyle;
  senderName: string;
  createdAt: string;
  isRead: boolean;
  direction: 'sent' | 'received';
};
