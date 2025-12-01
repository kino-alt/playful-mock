"use client"

import { useState, useEffect } from "react"
import { EmojiBackgroundLayout } from "./emoji-background-layout"
import { PageHeader } from "./page-header"
import { TextInput } from "./text-input"
import { TextDisplay } from "./text-display"
import { CountTimer } from "./count-timer"
import { api } from "@/lib/api"
import { DisplaySelectedEmojis } from "./display-selected-emojis"

export function WaitingDiscussionTime({roomCode}:  { roomCode: string }) {
    const [theme, setTheme] =useState("")
    const [topic, setTopic] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    //set theme/topic
    useEffect(() => {
        const GetThemeAndTopic = async () => {
            try {
                console.log("[v0] Getting the theme and topic...")
                const data = await api.createTheme(roomCode.toUpperCase())
                console.log("[v0] Theme and topic got response:", data)
        
                if (data.success) {
                setTheme(data.theme)
                setTopic(data.topic)
                console.log("[v0] Theme and topic set:", data.theme)
                } else {
                console.error("Failed to get theme and topic:", data.error)
                }
            } catch (error) {
                console.error("Error getting theme and topic:", error)
            } finally {
                setIsLoading(false)
            }
        }
        GetThemeAndTopic()
    }, [])

    return (
        <EmojiBackgroundLayout>
        <div className="w-full max-w-xs flex flex-col h-full">
            
            <PageHeader title="Discussion" subtitle={`Let's discuss emojis`} />

            <TextDisplay
                value={isLoading ? "Loading..." : theme}
                inputtitle=""
                height="py-0.5"
                variant="primary"
                textSize="text-sm"
                marginBottom="mb-2"
            />

            <TextInput
                value={isLoading ? "Loading..." : topic}
                onChange={setTopic}
                inputtitle=""
                placeholder=""
                height="py-2"
                variant="primary"
                mode="display"
                textSize="text-lg"
                marginBottom="mb-6"
            />
        
            <CountTimer roomCode={roomCode}/>

            <DisplaySelectedEmojis
                selectedEmojis={[]}
                handleRemoveEmoji={() => {}}
                maxEmojis={7}
            />    
            
        </div>
        </EmojiBackgroundLayout>
    )
}
