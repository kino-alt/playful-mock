import SubmitAnswer from "@/src/components/submit-answer"

export default async function SubmitAnswerPage({
 params,
}: {
  params: Promise<{ id: string }> 
}) {
  const { id } = await params

return(
     <SubmitAnswer />
)
}
