import { prisma } from "@/shared/lib/db"
import { Card, CardTitle } from "@/shared/ui/card"

export default async function Home() {
  const games = await prisma.game.findMany()
  return (
    <>
      {games.map((game) => (
        <Card key={game.id}>
          <CardTitle>{game.name}</CardTitle>
        </Card>
      ))}
    </>
  )
}
