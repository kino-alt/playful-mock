// contexts/room-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect,useCallback  } from "react";
import { api } from "@/lib/api";
import { RoomContextType, RoomState, GameState } from "./types";
import { useWsHandler } from "./useWSHandler";

//FIX: Separate RoomState
const initialRoomState: RoomState = {
  roomId: null, // FIX: Add
  roomCode: undefined,
  myUserId: null,
  isLeader: false, // FIX: Add
  topic: null, // FIX: Add
  theme: null, // FIX: Add
  hint: null, //FIX: Add
  selectedEmojis: [], // FIX: Add
  participantsList: [], // FIX: Use 'participantsList'
  roomState: GameState.WAITING,
  AssignedEmoji: null,
  assignmentsMap: {},
  timer: null,
  globalError: null,
};

const initialContext: RoomContextType = {
  ...initialRoomState, // RoomStateの全フィールドを含める
  // actions
  createRoom: async () => {},
  joinRoom: async () => {},
  submitTopic: async () => {},
  submitAnswer: async () => {},
};

export const RoomContext = createContext(initialContext);
export const useRoomData = () => useContext(RoomContext);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
 // FIX: Include all fields of RoomState
  const [state, setState] = useState<RoomState>(initialRoomState);

  const handleWS = useWsHandler(setState, state.myUserId);

  // actions FIX:API設計に合わせる/useCallback関数使用-----------------------------
  // 1.1 Roomの作成 (POST /api/rooms)
  const createRoom = useCallback(async () => {
    // APIレスポンス: { room_id, user_id, room_code, theme, hint }
    const data = await api.createRoom();
    setState((prev) => ({
      ...prev,
      roomId: data.room_id,
      roomCode: data.room_code,
      myUserId: data.user_id,
      isLeader: true, 
      theme: data.theme, 
      hint: data.hint,
    }));
  }, []);

  // 1.4 ルーム参加 (POST /api/user)
  const joinRoom = useCallback(async (roomCode: string, userName: string) => {
    // APIレスポンス: { room_id, user_is, is_leader }
    const data = await api.joinRoom(roomCode, userName);
    setState((prev) => ({
      ...prev,
      roomId: data.room_id,
      roomCode,
      myUserId: data.user_is, 
      isLeader: data.is_leader === "true",
    }));
  },[]);

  // 1.2 テーマ、絵文字の設定 (POST /api/rooms/${room_id}/topic)
  const submitTopic = useCallback(async (topic: string, emoji: string[]) => {
    if (!state.roomId) return;
    await api.submitTopic(state.roomId, topic, emoji);
    setState(prev => ({
        ...prev,
        topic: topic,
        selectedEmojis: emoji,
    }));
  }, [state.roomId]);

  // 1.3 回答の提出 (POST /api/rooms/${room_id}/answer)
  const submitAnswer = useCallback(async (answer: string) => {
    if (!state.roomId || !state.myUserId) return;
    await api.submitAnswer(state.roomId, state.myUserId, answer);
  }, [state.roomId, state.myUserId]); 


  // WebSocket ---------------------------------
  useEffect(() => {
    if (!state.roomCode) return;

    // api.connectWebSocket(roomCode, handleWS)
    const ws = api.connectWebSocket(state.roomCode, handleWS); 

    return () => ws.close();
  }, [state.roomCode, handleWS]);

  return (
    <RoomContext.Provider
      value={{
        ...state,
        createRoom,
        joinRoom,
        submitTopic,
        submitAnswer,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};


