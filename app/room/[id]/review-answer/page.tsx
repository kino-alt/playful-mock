import {ReviewAnswer} from "@/src/components/review-answer"
import { RoomProvider } from '@/contexts/room-context';

export default async function ReviewAnswerPage({
params,
}: {
  params: Promise<{ id: string }> 
}) {
  const { id } = await params

  return(
      <ReviewAnswer/>
  )
}
