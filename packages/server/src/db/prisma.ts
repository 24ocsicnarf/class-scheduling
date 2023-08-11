import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma || new PrismaClient({ log: ["query", "info"] });

prisma.$extends({
  result: {
    teacher: {
      fullName: {
        needs: {
          firstName: true,
          middleName: true,
          lastName: true,
          nameSuffix: true,
        },
        compute(teacher) {
          return [
            teacher.firstName,
            teacher.middleName,
            teacher.lastName,
            teacher.nameSuffix,
          ]
            .filter(Boolean)
            .join(" ");
        },
      },
      aka: {
        needs: {
          shortHonorific: true,
          nickname: true,
        },
        compute(teacher) {
          return [teacher.shortHonorific, teacher.nickname]
            .filter(Boolean)
            .join(" ");
        },
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

async function connectDb() {
  try {
    await prisma.$connect();
    console.log(">>> Database connected successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

export default connectDb;

export {
  type SubjectCategory,
  type SchoolClass,
  type Subject,
  type Teacher,
  type YearLevel,
  type SeniorHighTrack,
  type SeniorHighStrand,
  type SeniorHighSection,
} from "@prisma/client";
