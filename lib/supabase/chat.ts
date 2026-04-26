import { z } from "zod";

import type { ChatMessageRecord, ChatSessionData, MatchStatus } from "@/lib/chat/types";
import { createClient } from "@/lib/supabase/server";

const matchIdSchema = z.uuid("Invalid match identifier");

type MatchAccessRow = {
  id: string;
  patient_id: string;
  counselor_id: string;
  status: MatchStatus | null;
};

type UserNameRow = {
  id: string;
  fullname: string | null;
};

type MessageRow = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

function normalizeStatus(status: MatchStatus | null | undefined): MatchStatus {
  return status === "CLOSED" ? "CLOSED" : "ACTIVE";
}

function resolveDisplayName(fullName: string | null, fallback: string): string {
  const trimmed = fullName?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export async function getChatSession(matchId: string): Promise<ChatSessionData | null> {
  const parsed = matchIdSchema.safeParse(matchId);
  if (!parsed.success) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: matchRow, error: matchError } = await supabase
    .from("matches")
    .select("id, patient_id, counselor_id, status")
    .eq("id", parsed.data)
    .maybeSingle<MatchAccessRow>();

  if (matchError || !matchRow) {
    return null;
  }

  const isParticipant = user.id === matchRow.patient_id || user.id === matchRow.counselor_id;
  if (!isParticipant) {
    return null;
  }

  const userIds = [matchRow.patient_id, matchRow.counselor_id];
  const { data: users } = await supabase
    .from("users")
    .select("id, fullname")
    .in("id", userIds);

  const names = new Map<string, string>();
  for (const row of users ?? []) {
    const typed = row as UserNameRow;
    names.set(typed.id, typed.fullname ?? "");
  }

  const peerId = user.id === matchRow.patient_id ? matchRow.counselor_id : matchRow.patient_id;
  const peerFallback = user.id === matchRow.patient_id ? "Assigned Counselor" : "Patient";
  const peerName = resolveDisplayName(names.get(peerId) ?? null, peerFallback);

  const { data: messageRows } = await supabase
    .from("messages")
    .select("id, match_id, sender_id, content, created_at")
    .eq("match_id", matchRow.id)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  const messages: ChatMessageRecord[] = (messageRows ?? []).map((row) => {
    const typed = row as MessageRow;
    return {
      id: typed.id,
      matchId: typed.match_id,
      senderId: typed.sender_id,
      content: typed.content,
      createdAt: typed.created_at,
    };
  });

  return {
    context: {
      matchId: matchRow.id,
      status: normalizeStatus(matchRow.status),
      currentUserId: user.id,
      peerName,
    },
    messages,
  };
}

export async function getDefaultChatMatchId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: activeMatch } = await supabase
    .from("matches")
    .select("id")
    .or(`patient_id.eq.${user.id},counselor_id.eq.${user.id}`)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (activeMatch?.id) {
    return activeMatch.id;
  }

  const { data: closedMatch } = await supabase
    .from("matches")
    .select("id")
    .or(`patient_id.eq.${user.id},counselor_id.eq.${user.id}`)
    .eq("status", "CLOSED")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>();

  return closedMatch?.id ?? null;
}
