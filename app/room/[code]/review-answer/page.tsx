import {ReviewAnswer} from "@/components/review-answer"

export default async function ReviewAnswerPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <ReviewAnswer roomCode={code} />
}
