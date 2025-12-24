import { CreateTopic } from "@/src/components/create-topic"

export default async function CreateTopicPage({
  params,
}: {
  params: Promise<{ id: string }> 
}) {
  const { id } = await params

return(
    <CreateTopic  />
)
}
