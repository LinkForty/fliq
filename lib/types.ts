export type RevealStyle = 'scratch' | 'blur' | 'flick' | 'typewriter' | 'flip';

export type Message = {
  id: string;
  /** Server-side message ID from push notification — used to deduplicate */
  pushMessageId?: string;
  content: string;
  revealStyle: RevealStyle;
  senderName: string;
  senderPhone?: string;
  createdAt: string;
  isRead: boolean;
  direction: 'sent' | 'received';
};
