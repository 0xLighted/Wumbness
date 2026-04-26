export type MatchStatus = "ACTIVE" | "CLOSED";

export type ChatMessageRecord = {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export type ChatSessionContext = {
  matchId: string;
  status: MatchStatus;
  currentUserId: string;
  peerName: string;
};

export type ChatSessionData = {
  context: ChatSessionContext;
  messages: ChatMessageRecord[];
};
