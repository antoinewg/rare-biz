import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreatePlayer = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreatePlayer), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const player = await db.player.create({ data: input })

  return player
})
