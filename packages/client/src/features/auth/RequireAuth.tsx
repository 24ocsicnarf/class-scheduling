import { useLocation, Navigate, Outlet } from "react-router-dom";
import { trpc } from "../../trpc";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

// export type VerifiedEvent = (data: {
//   userId: bigint;
//   username: string;
// }) => void;

const RequireAuth = () => {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const location = useLocation();

  const verifyQuery = trpc.auth.verify.useQuery(undefined, {
    cacheTime: 0,
    staleTime: 1000,
    retry: 0,
    refetchOnWindowFocus: true,
    onSuccess(data) {
      setCurrentUser({
        userId: data.userId,
        username: data.username,
      });
    },
  });

  useEffect(() => {
    verifyQuery.refetch();
    console.log("verifyQuery refetched");
  }, [verifyQuery]);

  if (verifyQuery.isLoading) {
    return <p>Authenticating...</p>;
  }

  if (verifyQuery.status != "success") {
    return (
      <Navigate
        key={location.key}
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default RequireAuth;
