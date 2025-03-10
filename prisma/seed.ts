import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
  const user = await prisma.user.create({
    data: {
      login: "bruh",
      passwordHash: "1234#@!$!5",
      rating: 1337,
    },
  })
  const user2 = await prisma.user.create({
    data: {
      login: "vitalya",
      passwordHash: "134#@!$!5",
      rating: 228,
    },
  })
  await prisma.game.create({
    data: {
      field: Array(9).fill("O"),
      status: "idle",
      players: {
        connect: {
          id: user.id,
        },
      },
    },
  })
  await prisma.game.create({
    data: {
      field: Array(9).fill("O"),
      status: "idle",
      players: {
        connect: {
          id: user2.id,
        },
      },
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
