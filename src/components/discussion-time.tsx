"use client"

import { useState, useEffect } from "react"
import { EmojiBackgroundLayout } from "./emoji-background-layout"
import { PageHeader } from "./page-header"
import { TextDisplay } from "./text-display"
import { CountTimer } from "./count-timer"
import { Modal } from "./modal"
import { useRouter } from "next/navigation"
import { GameButton } from "./game-button"
import { useRoomData } from '@/contexts/room-context';
import { GameState } from "@/contexts/types";

export function DiscussionTime() {
  const [showHintOverlay, setShowHintOverlay] = useState(false);
  const router = useRouter();
  const {
    roomId,
    roomState,
    AssignedEmoji,
    isLeader,
    timer, 
    skipDiscussion,
  } = useRoomData();
  
  useEffect(() => { 
    if (roomState === GameState.ANSWERING && roomId) {
      if(isLeader)
          router.push(`/room/${roomId}/submit-answer`);
      else
          router.push(`/room/${roomId}/waiting-answer`);
    }
  }, [roomState, roomId, router, isLeader])

  const handleToggleHintOverlay = () => {
    setShowHintOverlay(prev => !prev)
  }

  const handleSkip = async () => {
    try {
      await skipDiscussion();
    } catch (error) {
      console.error("Failed to skip discussion:", error);
    }
  }

  return (
    <EmojiBackgroundLayout>
      <Modal 
        isOpen={showHintOverlay}
        onClose={handleToggleHintOverlay}
        title="Discussion Hint"
        content={`1. 自分の絵文字を順番に言葉で説明していく\n2. テーマがなにかを考える\n3. お題がなにか導き出す`}
      />

      <div className="w-full max-w-xs flex flex-col h-full mx-auto">
        
        {/* 1. Header Area */}
        <div className="flex flex-col">
          <PageHeader title="Discussion" subtitle="Find the imposter!" marginBottom="mb-1" />
          
          <div className="w-full flex justify-between items-center mb-0">
            <div className="min-w-[60px]">
              {isLeader && (
                <TextDisplay
                  value="Leader"
                  inputtitle=""
                  height="py-0.5"
                  variant="secondary"
                  textSize="text-[10px]"
                  marginBottom="mb-0" 
                />
              )}
            </div>
          </div>
        </div>

        {/* 2. Main Content Area */}
        <div className="flex flex-col items-center justify-start flex-grow space-y-0 pt-3">
          <div className="w-full">
            <CountTimer timervalue={timer} height="py-6" />
          </div>
          
          {/* Emoji Display Area*/}
          <div className="flex flex-col items-center w-full">
            
            {/* ダミー告知ラベル*/}
            <div className="flex flex-col items-center justify-center space-y-3 mb-2 w-full">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full blur opacity-25 animate-pulse"></div>
                
                <div className="relative flex items-center bg-white border-2 border-amber-500 pl-1 pr-4 py-1.5 rounded-full shadow-[0_4px_0_0_#f59e0b]">
                  {/* 1 DUMMY バッジ */}
                  <div className="flex items-center justify-center bg-amber-500 text-white px-3 py-1 rounded-full mr-3 shadow-inner">
                    <span className="text-[12px] font-black tracking-tighter">1 DUMMY</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] text-amber-600 font-black leading-none uppercase tracking-widest mb-1">
                      Intruder Detected!
                    </p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">
                      Find the fake description
                    </p>
                  </div>
                </div>
              </div>

              {/* ヒントボタン */}
              <button
                onClick={handleToggleHintOverlay}
                className="flex items-center gap-1.5 text-gray-400 hover:text-amber-500 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold border border-gray-200">?</div>
                <span className="text-[10px] font-black uppercase tracking-widest">Discussion Tips</span>
              </button>
            </div>

            {/* メインコンテナ*/}
            <div className="relative w-full max-w-[180px] h-[150px] bg-white border-[3px] border-gray-300 rounded-[2.5rem] shadow-[0_8px_0_0_rgba(245,158,11,0.7)] flex items-center justify-center mx-auto">
              {/* 吹き出しのしっぽ */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-b-[3px] border-r-[3px] border-gray-300 rotate-45 rounded-sm"></div>               
              {/* 絵文字 */}
              <p className="text-[80px] select-none z-10 drop-shadow-sm leading-none">
                {AssignedEmoji || ""}
              </p>
            </div>

            {/* 下部の補足 */}
            <p className="mt-4 text-[9px] text-amber-500 font-black text-center uppercase tracking-widest">
              — Your Emoji —
            </p>
          </div>
        </div>

        {/* 3. Footer Button Area */}
        <div className="mt-auto ">
          {isLeader ? (
            <GameButton onClick={handleSkip} variant="secondary">
              SKIP DISCUSSION
            </GameButton>
          ) : (
            <div className="h-[52px]"></div>
          )}
        </div>
        
      </div>
    </EmojiBackgroundLayout>
  )
}