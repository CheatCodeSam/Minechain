import SignInButton from "./components/SignInButton"

async function getData() {
  const res = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' },
    next: { revalidate: 1 }
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function Index() {
  const data = await getData()

  return <div className="underline">
    {data.joke}
    <div className="">
      <SignInButton/>
    </div>
  </div>
}
