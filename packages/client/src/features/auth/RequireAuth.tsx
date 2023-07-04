import { useLocation, Navigate, Outlet } from "react-router-dom";
import { trpc } from "../../trpc";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";

const RequireAuth = () => {
  const location = useLocation();

  const verifyQuery = trpc.auth.verify.useQuery(undefined, {
    cacheTime: 0,
    staleTime: 1000,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    verifyQuery.refetch();
  }, [verifyQuery]);

  if (verifyQuery.isLoading) {
    return <p>Please wait...</p>;
  }

  if (verifyQuery.status != "success") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Outlet />
      <ReactQueryDevtools />
    </>
  );
};

export default RequireAuth;
