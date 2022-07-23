import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetPlayersInput
  extends Pick<Prisma.PlayerFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetPlayersInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: players,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.player.count({ where }),
      query: (paginateArgs) => db.player.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      players,
      nextPage,
      hasMore,
      count,
    }
  }
)
