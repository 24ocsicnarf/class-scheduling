import { beforeEach, describe, expect, it, test, vi } from "vitest";
import prismaMock from "../db/__mocks__/prisma";
import * as express from "express";

import { appRouter } from ".";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import serverConfig from "../config/serverConfig";

const prisma = new PrismaClient({ log: ["query", "info"] });

vi.mock("../db/prisma.ts");

function createMockContextInner() {
  return {
    prisma: prismaMock,
  };
}

function createMockContext(opts: CreateNextContextOptions) {
  const contextInner = createMockContextInner();
  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
}

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNTE2MjM5MDIyfQ.EzOoTPGwbJGO8yvRJGFTnkxfTq8-1h4Ug0eM4Vfo2gw";
const req = {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
  secret: serverConfig.cookieSecret,
} as express.Request;
const res = {
  cookie: vi.fn().mockResolvedValue({}),
  req,
};
const caller = appRouter.createCaller(createMockContext({ req, res }));

describe("login query", () => {
  beforeEach(() => {
    expect.hasAssertions();
  });

  it("should be unauthorized if username not found", async () => {
    const input = {
      username: "superdupperhypermegaultraultimateuser",
      password: "beluga123",
    };

    prismaMock.appUser.findFirst.mockImplementation(prisma.appUser.findFirst);

    try {
      await caller.auth.logIn(input);
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    }
  });

  it("should be unauthorized if password is incorrect", async () => {
    const input = {
      username: "superuser",
      password: "hahackdog",
    };

    prismaMock.appUser.findFirst.mockImplementation(prisma.appUser.findFirst);

    try {
      await caller.auth.logIn(input);
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    }
  });

  it("should be unauthorized if user is not active", async () => {
    const input = {
      username: "oldUser",
      password: "oldUser123",
    };

    prismaMock.appUser.findFirst.mockImplementation(prisma.appUser.findFirst);

    try {
      await caller.auth.logIn(input);
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    }
  });

  it("should be authorized if username and password are correct", async () => {
    const input = {
      username: "superuser",
      password: "superuser",
    };

    prismaMock.appUser.findFirst.mockImplementation(prisma.appUser.findFirst);
    const response = await caller.auth.logIn(input);

    expect(response.token).toEqual(expect.any(String));
  });
});

describe("addUser mutation", () => {
  beforeEach(() => {
    expect.hasAssertions();
  });

  describe("username", () => {
    it("should return error if is empty", async () => {
      await expect(
        caller.auth.addUser({
          username: "",
          password: "sobrang$ecur3dngPa$$w0rdn@!+0h3h3",
          roleId: 1,
        })
      ).rejects.toThrowError("is required");
    });

    it("should return error if contains only whitespace", async () => {
      await expect(
        caller.auth.addUser({
          username: "     ",
          password: "sobrang$ecur3dngPa$$w0rdn@!+0h3h3",
          roleId: 1,
        })
      ).rejects.toThrowError("must contain");
    });

    it("should return error if not starts with a letter or number", async () => {
      await expect(
        caller.auth.addUser({
          username: "_user",
          password: "sobrang$ecur3dngPa$$w0rdn@!+0h3h3",
          roleId: 1,
        })
      ).rejects.toThrowError("must start with");

      await expect(
        caller.auth.addUser({
          username: "-user",
          password: "sobrang$ecur3dngPa$$w0rdn@!+0h3h3",
          roleId: 1,
        })
      ).rejects.toThrowError("must start with");

      await expect(
        caller.auth.addUser({
          username: "?!user",
          password: "sobrang$ecur3dngPa$$w0rdn@!+0h3h3",
          roleId: 1,
        })
      ).rejects.toThrowError("must start with");

      await expect(
        caller.auth.addUser({
          username: "      user",
          password: "sobrang$ecur3dngPa$$w0rdn@!+0h3h3",
          roleId: 1,
        })
      ).rejects.toThrowError("must start with");
    });

    it("should return error if contains other special characters", async () => {
      await expect(
        caller.auth.addUser({
          username: "user!!!",
          password: "sobrang$ecur3dngPa$$w0rdn@!+0h3h3",
          roleId: 1,
        })
      ).rejects.toThrowError("must only contain");
    });

    it("should return error if already exists", async () => {
      const input = {
        username: "superuser",
        password: "1234567890",
        roleId: 1,
      };

      prismaMock.appUser.findFirst.mockImplementation(prisma.appUser.findFirst);
      prismaMock.appUser.create.mockClear();

      await expect(caller.auth.addUser(input)).rejects.toThrow(
        "already exists"
      );
    });
  });

  describe("password", () => {
    it("should return error if is empty", async () => {
      try {
        await caller.auth.addUser({
          username: "sampleUser",
          password: "",
          roleId: 1,
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.message).contain("8 character");
        }
      }
    });

    it("should return error if is less than 8 characters", async () => {
      try {
        await caller.auth.addUser({
          username: "sampleUser",
          password: "yeah",
          roleId: 1,
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.message).contain("8 characters");
        }
      }
    });
  });

  it("should add the user if entered properly", async () => {
    const input = {
      username: "newUser",
      password: "newUser123",
      roleId: 1,
    };

    prismaMock.appUser.findFirst.mockImplementation(prisma.appUser.findFirst);

    await caller.auth.addUser(input);

    expect(prismaMock.appUser.create).toBeCalled();
  });
});
