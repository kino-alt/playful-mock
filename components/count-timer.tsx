"use client"

import React from "react"
import {useState, useEffect} from "react"
import { TextInput } from "./text-input"
import { api } from "@/lib/api"

export function CountTimer({roomCode}:  { roomCode: string }){
  const [timer, setTimer] = useState("")
    
  // Temporary: Mock timer value
  setTimer("00:30")

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