import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createPlayer from "app/players/mutations/createPlayer"
import { PlayerForm, FORM_ERROR } from "app/players/components/PlayerForm"

const NewPlayerPage: BlitzPage = () => {
  const router = useRouter()
  const [createPlayerMutation] = useMutation(createPlayer)

  return (
    <div>
      <h1>Create New Player</h1>

      <PlayerForm
        submitText="Create Player"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreatePlayer}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const player = await createPlayerMutation(values)
            router.push(Routes.ShowPlayerPage({ playerId: player.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.PlayersPage()}>
          <a>Players</a>
        </Link>
      </p>
    </div>
  )
}

NewPlayerPage.authenticate = true
NewPlayerPage.getLayout = (page) => <Layout title={"Create New Player"}>{page}</Layout>

export default NewPlayerPage
