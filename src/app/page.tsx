import { GamesList } from "@/features/games-list/ui/server"

export default async function Home() {
  return (
    <div className="container mx-auto flex flex-col gap-4 pt-[100px]">
      <h1 className="text-4xl font-bold">Игры</h1>
      <GamesList />
    </div>
  )
}
