async function getUser(id: string) {
    const res = await fetch(`http://localhost:3333/api/user/${id}`, { cache: 'no-store' });
    return res.json();
  }
 
export default async function FindOne(props: { params: {publicAddress: string} }) {
 const user = await getUser(props.params.publicAddress) 
  return <div className="">
    <div className="">{user.publicAddress}</div>
    <div className="">{user.displayName}</div>
  </div>;
}