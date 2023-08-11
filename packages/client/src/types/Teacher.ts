import { SubjectCategory } from "@prisma/client";
class Teacher {
  techerId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  nameSuffix: string;
  nickname: string;
  sex: Sex;
  isArchived: boolean;
  shortHonorific: string;
}
