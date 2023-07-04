import React from "react";
import { MemoryRouter } from "react-router-dom";
import { trpc } from "client/src/trpc";
import { loggerLink, httpBatchLink, TRPCClientErrorLike } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Maybe } from "@trpc/server";
import { AppRouter } from "server";
import type { Preview } from "@storybook/react";
import "client/src/index.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

export const routeDecorator = (Story: React.FC) => (
  <MemoryRouter initialEntries={["/"]}>
    <Story />
  </MemoryRouter>
);

export const trpcDecorator = (Story: React.FC) => {
  const queryClientRetry = (failureCount: number, _error: unknown) => {
    const error = _error as never as Maybe<TRPCClientErrorLike<AppRouter>>;
    const code = error?.data?.code;
    if (
      code === "BAD_REQUEST" ||
      code === "FORBIDDEN" ||
      code === "UNAUTHORIZED"
    ) {
      return false;
    }

    const MAX_REQUEST_COUNT = 3;
    return failureCount < MAX_REQUEST_COUNT;
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 1000,
        retry: queryClientRetry,
      },
      mutations: {
        retry: queryClientRetry,
      },
    },
  });

  const trpcClient = trpc.createClient({
    links: [
      loggerLink(),
      httpBatchLink({
        url: "http://localhost:8000/trpc",
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
