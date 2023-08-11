import { hashPassword } from "../routes/auth";
import { prisma } from "./prisma";

async function init() {
  await createRoles();
  await createUser();
  await createUserRoles();
}

async function createRoles() {
  const superuser = await prisma.appRole.create({
    data: {
      appRoleId: 1,
      appRoleName: "superuser",
    },
  });
  console.log("role", superuser);

  const admin = await prisma.appRole.create({
    data: {
      appRoleId: 2,
      appRoleName: "admin",
    },
  });
  console.log("role", admin);

  const user = await prisma.appRole.create({
    data: {
      appRoleId: 3,
      appRoleName: "user",
    },
  });
  console.log("role", user);
}

async function createUser() {
  const superuser = await prisma.appUser.create({
    data: {
      username: "superuser",
      passwordHash: await hashPassword("superuser"),
      isDefault: true,
    },
  });
  console.log("user", superuser);
}

async function createUserRoles() {
  const superuser = await prisma.appUser.findFirst({
    where: {
      username: "superuser",
    },
  });

  const role = await prisma.appRole.findFirst({
    where: {
      appRoleName: "superuser",
    },
  });

  const superuserAsSuperuser = await prisma.appUserRole.create({
    data: {
      appUserId: superuser?.appUserId!,
      appRoleId: role?.appRoleId!,
    },
  });
  console.log("userRole", superuserAsSuperuser);
}

init();
