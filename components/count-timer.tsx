"use client"

import React from "react"
import {useState, useEffect} from "react"
import { TextInput } from "./text-input"
import { api } from "@/lib/api"

export function CountTimer({roomCode}:  { roomCode: string }){
  const [timer, setTimer] = useState("")
    
    //timer更新
    useEffect(() => {
      if (!roomCode) return
  
      console.log("[v0] Connecting to WebSocket for room:", roomCode)
      const ws = api.connectWebSocket(roomCode, (data) => {
        console.log("[v0] Received WebSocket message:", data)
        setTimer(data)
        })
  
      // クリーンアップ: コンポーネントのアンマウント時にWebSocket接続を閉じる
      return () => {
        console.log("[v0] Closing WebSocket connection")
        ws.close()
      }
    }, [roomCode])

  return(
    <TextInput
          value={timer}
          onChange={setTimer}
          inputtitle=""
          placeholder=""
          height="py-10"
          variant="gray"
          mode="display"
          textSize="text-4lx"
        />
  );
};