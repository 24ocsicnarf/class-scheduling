import { trpc } from "../trpc";

const DashboardPage = () => {
  const { data, isLoading, error } = trpc.dashboard.render.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Eeeeeeeeennggggkkkkk! {error.message}</p>;
  }

  return (
    <div className="grow bg-red-100 p-6">
      <h1 className="text-3xl font-bold bg-orange-100">Dashboard</h1>
      <p>{data.message}</p>
      <p>{data.message}</p>
      <p>{data.message}</p>
      <p>{data.message}</p>
      <p>{data.message}</p>
      <p>{data.message}</p>
      <p>{data.message}</p>
      <p>{data.message}</p>
      <p>{data.message}</p>
      <p>{data.message}</p>
    </div>
  );
};

export default DashboardPage;
