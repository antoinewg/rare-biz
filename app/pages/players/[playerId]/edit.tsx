import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlayer from "app/players/queries/getPlayer"
import updatePlayer from "app/players/mutations/updatePlayer"
import { PlayerForm, FORM_ERROR } from "app/players/components/PlayerForm"

export const EditPlayer = () => {
  const router = useRouter()
  const playerId = useParam("playerId", "number")
  const [player, { setQueryData }] = useQuery(
    getPlayer,
    { id: playerId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updatePlayerMutation] = useMutation(updatePlayer)

  return (
    <>
      <Head>
        <title>Edit Player {player.id}</title>
      </Head>

      <div>
        <h1>Edit Player {player.id}</h1>
        <pre>{JSON.stringify(player, null, 2)}</pre>

        <PlayerForm
          submitText="Update Player"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdatePlayer}
          initialValues={player}
          onSubmit={async (values) => {
            try {
              const updated = await updatePlayerMutation({
                id: player.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowPlayerPage({ playerId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditPlayerPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPlayer />
      </Suspense>

      <p>
        <Link href={Routes.PlayersPage()}>
          <a>Players</a>
        </Link>
      </p>
    </div>
  )
}

EditPlayerPage.authenticate = true
EditPlayerPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditPlayerPage
