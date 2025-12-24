import WaitingStartGame from "@/src/components/waiting-start-game"

export default async function WaitingStartGamePage({
  params,
}: {
  params: Promise<{ id: string }> 
}) {
  // 🔴 paramsをawaitしてからidを取り出す
  const { id } = await params

return(
     <WaitingStartGame/>
  )
}
