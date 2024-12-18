/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, httpBatchLink, TRPCClientErrorLike } from "@trpc/client";
import { trpc } from "./trpc.ts";

import BlankLayout from "./layouts/BlankLayout";
import MainLayout from "./layouts/MainLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { sidebarMenus } from "./layouts/MainMenus";
import { useState } from "react";
import RequireAuth from "@/features/auth/RequireAuth.tsx";
import { Maybe } from "@trpc/server";
import { AppRouter } from "server";

let token: string;

export function setToken(accessToken: string) {
  token = accessToken;
}

function App() {
  const queryClientRetry = (failureCount: number, _error: unknown) => {
    const error = _error as never as Maybe<TRPCClientErrorLike<AppRouter>>;
    const code = error?.data?.code;
    if (
      code === "BAD_REQUEST" ||
      code === "FORBIDDEN" ||
      code === "UNAUTHORIZED" ||
      code === "CONFLICT" ||
      error?.data?.zodError
    ) {
      return false;
    }

    const MAX_REQUEST_COUNT = 3;
    return failureCount < MAX_REQUEST_COUNT;
  };

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 1 /* seconds */,
            retry: queryClientRetry,
          },
          mutations: {
            retry: queryClientRetry,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === "development" &&
              typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${process.env.REACT_APP_TRPC_URL}`,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
          headers: () => {
            return {
              authorization: token,
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Private routes */}
            <Route element={<RequireAuth />}>
              <Route element={<MainLayout />}>
                {sidebarMenus
                  .flatMap((s) => s.menus)
                  .map((menu) => {
                    return (
                      <Route
                        key={menu.path}
                        path={menu.path}
                        element={menu.page}
                      />
                    );
                  })}
              </Route>
            </Route>
            {/* Public routes */}
            <Route element={<BlankLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
