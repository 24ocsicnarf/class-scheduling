import { trpc } from "@/trpc";

export const useClassSectionData = () => {
  const academicClassSchedules =
    trpc.classSection.getSeniorHighSections.useQuery();
};
