"use client"

import { useState, useEffect } from "react"
import { EmojiBackgroundLayout } from "./emoji-background-layout"
import { PageHeader } from "./page-header"
import { TextInput } from "./text-input"
import { TextDisplay } from "./text-display" 
import { api } from "@/lib/api"
import { DisplaySelectedEmojis } from "./display-selected-emojis"
import { GameButton } from "./game-button"

export function ReviewAnswer({roomCode}:  { roomCode: string }) {
    const [theme, setTheme] =useState("")
    const [topic, setTopic] = useState("")
    const [answer, setAnswer] = useState("")
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
                setAnswer(data.answer)
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

    const handleSubmit = async () => {
        console.log("[v0] Exitting for room:", roomCode)
        window.location.href = "/"
    }

    return (
        <EmojiBackgroundLayout>
        <div className="w-full max-w-xs flex flex-col h-full">
            
            <PageHeader title="Review Answer" subtitle={`Grade Submissions`} />

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

            <TextInput
                value={isLoading ? "Loading..." : answer}
                onChange={setAnswer}
                inputtitle=""
                placeholder=""
                height="py-2"
                variant="secondary"
                mode="display"
                textSize="text-lg"
                marginBottom="mb-6"
            />

            <DisplaySelectedEmojis
                selectedEmojis={[]}
                handleRemoveEmoji={() => {}}
                maxEmojis={7}
            /> 

            {/*submit button*/}
            <div className="mt-auto">
            <GameButton variant="primary" onClick={handleSubmit} height="py-2">
                Exit 
            </GameButton>
            </div>  
            
        </div>
        </EmojiBackgroundLayout>
    )
}
