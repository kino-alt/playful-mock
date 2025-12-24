import {DiscussionTime} from "@/src/components/discussion-time"

export default async function DiscussionTimePage({
 params,
}: {
  params: { id: string } 
}) {
  const { id } = await params

  return(
      <DiscussionTime />
  )
}
