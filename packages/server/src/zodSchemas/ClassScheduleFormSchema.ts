import { TypeOf, ZodType, z } from "zod";
export const ClassScheduleFormObject = z
  .object({
    id: z.number(),
    className: z.string().trim().optional(),
    dayOfWeek: z.number().min(1, "Select a day").max(7, "Select a day"),
    startTime: z.string().trim().nonempty("Start time required"),
    endTime: z.string().trim().nonempty("End time required"),
    subjectId: z.number(),
    teacherId: z.number(),
    sectionId: z.number(),
    academicTermId: z.number(),
  })
  .partial({
    id: true,
  })
  .refine(
    (data) => {
      const startTime = data.startTime.split(":");
      const endTime = data.endTime.split(":");
      const startHour = Number(startTime[0]);
      const startMinute = Number(startTime[1]);
      const endHour = Number(endTime[0]);
      const endMinute = Number(endTime[1]);
      const isStartTimeValid = startHour >= 0 && startHour <= 23;
      const isEndTimeValid = endHour >= 0 && endHour <= 23;
      const isStartMinuteValid = startMinute >= 0 && startMinute <= 59;
      const isEndMinuteValid = endMinute >= 0 && endMinute <= 59;
      const isStartTimeBeforeEndTime =
        startHour < endHour ||
        (startHour === endHour && startMinute < endMinute);
      return (
        isStartTimeValid &&
        isEndTimeValid &&
        isStartMinuteValid &&
        isEndMinuteValid &&
        isStartTimeBeforeEndTime
      );
    },
    {
      message: "Start time must be earlier than end time",
      path: ["startTime"],
    }
  );

export type ClassScheduleFormData = TypeOf<typeof ClassScheduleFormObject>;
export const ClassScheduleFormSchema: ZodType<ClassScheduleFormData> =
  ClassScheduleFormObject;
