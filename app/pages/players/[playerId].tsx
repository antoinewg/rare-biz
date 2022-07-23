import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlayer from "app/players/queries/getPlayer"
import deletePlayer from "app/players/mutations/deletePlayer"

export const Player = () => {
  const router = useRouter()
  const playerId = useParam("playerId", "number")
  const [deletePlayerMutation] = useMutation(deletePlayer)
  const [player] = useQuery(getPlayer, { id: playerId })

  return (
    <>
      <Head>
        <title>Player {player.id}</title>
      </Head>

      <div>
        <h1>Player {player.id}</h1>
        <pre>{JSON.stringify(player, null, 2)}</pre>

        <Link href={Routes.EditPlayerPage({ playerId: player.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deletePlayerMutation({ id: player.id })
              router.push(Routes.PlayersPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowPlayerPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.PlayersPage()}>
          <a>Players</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Player />
      </Suspense>
    </div>
  )
}

ShowPlayerPage.authenticate = true
ShowPlayerPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowPlayerPage
