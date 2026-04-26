"use client";
import { useEffect, useMemo, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import RoomMessage from "./RoomMessage";
import RoomInput from "./RoomInput";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessageRecord, MatchStatus } from "@/lib/chat/types";

type ChatRoomLayoutProps = {
  matchId: string;
  currentUserId: string;
  peerName: string;
  status: MatchStatus;
  initialMessages: ChatMessageRecord[];
};

type InsertedMessagePayload = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

function toTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function toClientMessage(row: InsertedMessagePayload): ChatMessageRecord {
  return {
    id: row.id,
    matchId: row.match_id,
    senderId: row.sender_id,
    content: row.content,
    createdAt: row.created_at,
  };
}

export default function ChatRoomLayout({
  matchId,
  currentUserId,
  peerName,
  status,
  initialMessages,
}: ChatRoomLayoutProps) {
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<ChatMessageRecord[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isReadOnly = status === "CLOSED";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const channel = supabase
      .channel(matchId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const inserted = payload.new as InsertedMessagePayload;
          const message = toClientMessage(inserted);

          setMessages((prev) => {
            if (prev.some((item) => item.id === message.id)) {
              return prev;
            }

            return [...prev, message];
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [matchId, supabase]);

  const handleSend = async (text: string) => {
    if (isReadOnly || isSending) {
      return;
    }

    setIsSending(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        match_id: matchId,
        sender_id: currentUserId,
        content: text,
      })
      .select("id, match_id, sender_id, content, created_at")
      .maybeSingle<InsertedMessagePayload>();

    if (error) {
      setErrorMessage(error.message || "Failed to send message.");
      setIsSending(false);
      return;
    }

    if (data) {
      const inserted = toClientMessage(data);
      setMessages((prev) => {
        if (prev.some((item) => item.id === inserted.id)) {
          return prev;
        }

        return [...prev, inserted];
      });
    }

    setIsSending(false);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-pearl shadow-md relative overflow-hidden">
      <ChatHeader recipientName={peerName} isOnline={!isReadOnly} isReadOnly={isReadOnly} />

      {isReadOnly && (
        <div className="mx-4 mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">
          This match is closed. You can revisit message history, but sending is disabled.
        </div>
      )}

      {errorMessage && (
        <div className="mx-4 mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full">
        <div className="flex flex-col flex-1 w-full relative">
          {messages.length === 0 && (
            <p className="mx-auto rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-500 shadow-sm border border-gray-100">
              No messages yet. Start the conversation.
            </p>
          )}

          {messages.map((message) => (
            <RoomMessage
              key={message.id}
              content={message.content}
              timestamp={toTimestamp(message.createdAt)}
              isOwnMessage={message.senderId === currentUserId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <RoomInput onSend={handleSend} disabled={isReadOnly || isSending} />
    </div>
  );
}
