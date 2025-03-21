import { prisma } from "@/shared/lib/db"
import { GameEntity, GameIdleEntity, GameOverEntity } from "../domain"
import { Game, Prisma, User } from "@prisma/client"
import { z } from "zod"
import { removePassword } from "@/shared/lib/password"

export async function gamesList(
  where?: Prisma.GameWhereInput,
): Promise<GameEntity[]> {
  const games = await prisma.game.findMany({
    where,
    include: {
      winner: true,
      players: true,
    },
  })

  return games.map(dbGameToGameEntity)
}

const fieldSchema = z.array(z.union([z.string(), z.null()]))

function dbGameToGameEntity(
  game: Game & { players: User[]; winner?: User | null },
): GameEntity {
  const players = game.players.map(removePassword)
  switch (game.status) {
    case "idle":
      const [creator] = players
      if (!creator) {
        throw new Error("something went wrong while creating a game")
      }
      return {
        id: game.id,
        creator,
        status: game.status,
      } satisfies GameIdleEntity

    case "inProgress":
    case "gameOverDraw":
      return {
        id: game.id,
        field: fieldSchema.parse(game.field),
        players: players,
        status: game.status,
      }

    case "gameOver":
      if (!game.winner) {
        throw new Error("couldn't retrieve winner of the game")
      }
      return {
        id: game.id,
        field: fieldSchema.parse(game.field),
        players: players,
        winner: removePassword(game.winner),
        status: game.status,
      } satisfies GameOverEntity
  }
}

export const gameRepository = { gamesList }
