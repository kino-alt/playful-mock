import {WaitingDiscussionTime} from "@/src/components/wating-discussion-time"

export default async function WaitingDiscussionTimePage({
params,
}: {
  params: Promise<{ id: string }> 
}) {
  const { id } = await params

return(
    <WaitingDiscussionTime/>
)
}
