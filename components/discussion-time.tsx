"use client"

import { useState, useEffect } from "react"
import { EmojiBackgroundLayout } from "./emoji-background-layout"
import { PageHeader } from "./page-header"
import { TextDisplay } from "./text-display"
import { CountTimer } from "./count-timer"
import { api } from "@/lib/api"
import FukidashiImage from '../images/speach_bubble.png'


export function DiscussionTime({roomCode}:  { roomCode: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [emoji, setEmoji] = useState("")

  // temporary values
  setEmoji("👑")
  setIsLoading(false)

  return (
    <EmojiBackgroundLayout>
      <div className="w-full max-w-xs flex flex-col h-full">
        
        <PageHeader title="Discussion" subtitle={`Let's discuss emojis`} />

        <div className="w-full flex justify-start">
          <TextDisplay
            value={"Leader"}
            height="py-0.5"
            variant="primary"
            textSize="text-xs"
          />
        </div>
        
        <CountTimer roomCode={roomCode}/>

        <div className="w-full flex justify-center mt-4 mb-4">
            <div className="relative w-full max-w-[280px] h-[250px] flex items-center justify-center">
                
                <img 
                    src={FukidashiImage.src} 
                    alt="Speech Bubble"
                    className="absolute inset-0 w-full h-full object-contain"
                />
              
                <div className="absolute inset-0 flex items-center justify-center transform translate-y-[-15px]">
                    <p className="text-8xl font-bold">
                        {isLoading ? "..." : emoji}
                    </p>
                </div>
                
            </div>
        </div>
      </div>
    </EmojiBackgroundLayout>
  )
}
