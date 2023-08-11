import { ClassScheduleFormDialog } from "@/features/class-scheduling/components/ClassScheduleForm";
import { cn } from "@/lib/utils";
import { forwardRef, useRef } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { trpc } from "@/trpc";
import { toast } from "@/components/ui/use-toast";
import { FormResult } from "server/src/types/FormResult";
import { Button } from "@/components/ui/button";
import { Pencil, PlusSquare } from "lucide-react";

const ClassSchedulingPage = () => {
  const collisionBoundaryRef = useRef<HTMLDivElement>(null);

  const academicClassSchedules = trpc.classSchedule.getClassSchedules.useQuery({
    academicTermId: Number(1),
  });

  const teachers = trpc.teacher.getTeachers.useQuery({
    orderBy: "nickname",
  });

  const daysOfTheWeek = Object.freeze([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);

  const handleSaved = async (data: FormResult) => {
    toast({
      title: data.title,
      description: data.message,
    });
  };

  return (
    <div className="container p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-center">
        <h1 className="text-3xl font-bold">Class Scheduling</h1>
        <ClassScheduleFormDialog
          collisionBoundary={collisionBoundaryRef.current}
          triggerChild={
            <Button>
              <div className="flex gap-2 items-center">
                <PlusSquare />
                <span>Add class schedule</span>
              </div>
            </Button>
          }
          onSaved={handleSaved}
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold">SY 2023-2024 1st Semester</h2>
      </div>
      <div
        ref={collisionBoundaryRef}
        className="flex border-2 rounded-lg overflow-x-scroll overflow-y-hidden"
      >
        <div className="sticky left-0 border-r-2 pt-[40px] min-w-[48px]">
          <div className="text-xs text-end tabular-nums h-24">6 AM</div>
          <div className="text-xs text-end tabular-nums h-24">7 AM</div>
          <div className="text-xs text-end tabular-nums h-24">8 AM</div>
          <div className="text-xs text-end tabular-nums h-24">9 AM</div>
          <div className="text-xs text-end tabular-nums h-24">10 AM</div>
          <div className="text-xs text-end tabular-nums h-24">11 AM</div>
          <div className="text-xs text-end tabular-nums h-24">12 PM</div>
          <div className="text-xs text-end tabular-nums h-24">1 PM</div>
          <div className="text-xs text-end tabular-nums h-24">2 PM</div>
          <div className="text-xs text-end tabular-nums h-24">3 PM</div>
          <div className="text-xs text-end tabular-nums h-24">4 PM</div>
          <div className="text-xs text-end tabular-nums h-24">5 PM</div>
        </div>
        {daysOfTheWeek.map((day, index) => (
          <div key={day} className="relative -z-0 border-r-2 last:pe-[540px]">
            <div className="text-center border-b-[1px] font-medium">{day}</div>
            <div className="flex h-full">
              {teachers.data?.map((teacher) => (
                <div
                  key={teacher.teacherId}
                  className="border-r-[1px] w-[180px]"
                >
                  <div className="text-center text-sm border-b-[1px] pb-[3px] truncate">{`${teacher.shortHonorific} ${teacher.nickname}`}</div>

                  <div className="absolute top-[48px] w-[176px] mx-[2px]">
                    {academicClassSchedules.data
                      ?.filter(
                        (cs) =>
                          cs.dayOfWeek === index + 1 &&
                          cs.teacherId === teacher.teacherId
                      )
                      .map((classSchedule) => (
                        <ClassScheduleBlock
                          key={classSchedule.schoolClassId}
                          collisionBoundary={collisionBoundaryRef.current}
                          schoolClassId={classSchedule.schoolClassId}
                          scheduleName={
                            classSchedule.className
                              ? classSchedule.className
                              : classSchedule.subject.subjectName
                          }
                          colorHex={classSchedule.subject.colorHex}
                          teacherName={`${classSchedule.teacher.shortHonorific} ${classSchedule.teacher.lastName}`}
                          startTime={classSchedule.startTime}
                          endTime={classSchedule.endTime}
                          fullSectionName={`${
                            classSchedule.section.yearLevel.yearLevelShortName
                          } ${
                            classSchedule.section.seniorHighSection
                              ?.seniorHighStrand?.seniorHighStrandName ??
                            classSchedule.section.seniorHighSection
                              ?.seniorHighTrack.seniorHighTrackName
                          }-${classSchedule.section.classSectionName}`}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSchedulingPage;

type ClassScheduleBlockProps = {
  collisionBoundary: HTMLDivElement | null;
  schoolClassId: number;
  scheduleName: string;
  colorHex: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  fullSectionName: string;
};

const ClassScheduleBlock = forwardRef(
  (props: ClassScheduleBlockProps, forwardedRef: React.Ref<HTMLDivElement>) => {
    const {
      collisionBoundary,
      schoolClassId,
      scheduleName,
      teacherName,
      startTime,
      endTime,
      fullSectionName,
      colorHex,
    } = props;

    const startTimeOfDay = dayjs.utc("1970-01-01 06:00");
    const oneHourHeightPixels = 96;
    const perMinuteHeightPixels = oneHourHeightPixels / 60;

    const positionHours = dayjs
      .utc(startTime)
      .diff(startTimeOfDay, "hours", true);
    const durationMinutes = dayjs.utc(endTime).diff(startTime, "minute");

    return (
      <>
        <div
          ref={forwardedRef}
          className={cn(
            `absolute group border-l-4 border-t-[1px] border-r-[1px] border-b-[1px] w-full px-1 hover:bg-secondary`
          )}
          style={{
            top: `${positionHours * oneHourHeightPixels}px`,
            height: `${durationMinutes * perMinuteHeightPixels}px`,
            borderLeftColor: colorHex,
          }}
        >
          <div>
            <div className="absolute end-0 p-1">
              <ClassScheduleFormDialog
                key={schoolClassId}
                collisionBoundary={collisionBoundary}
                schoolClassId={schoolClassId}
                triggerChild={
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 drop-shadow collapse group-hover:visible"
                  >
                    <Pencil className="w-4 h-4 " />
                  </Button>
                }
                onSaved={(data: FormResult) => {
                  toast({
                    title: data.title,
                    description: data.message,
                  });
                }}
              />
            </div>
            <div>
              <div className="font-display truncate" title={scheduleName}>
                {scheduleName}
              </div>
              <div className="text-xs font-medium">{teacherName}</div>
              <div className="text-xs font-medium text-muted-foreground">
                {fullSectionName}
              </div>
              <div className="text-xs tabular-nums">
                {`${dayjs.utc(startTime).format("h:mma")}-${dayjs
                  .utc(endTime)
                  .format("h:mma")}`.toLowerCase()}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);
