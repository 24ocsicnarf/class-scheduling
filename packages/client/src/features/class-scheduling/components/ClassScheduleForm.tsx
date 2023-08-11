import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, PlusSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FieldValues, useForm, useWatch } from "react-hook-form";
import {
  ClassScheduleFormData,
  ClassScheduleFormSchema,
} from "server/src/zodSchemas/ClassScheduleFormSchema";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { Separator } from "@/components/ui/separator";
import { Subject, Teacher, SchoolClass } from "server/src/db/prisma";
import { SeniorHighSectionModel } from "@/models/SeniorHighSectionModel";
import { FormResult } from "server/src/types/FormResult";

export const ClassScheduleFormDialog = ({
  schoolClassId,
  triggerChild,
  collisionBoundary,
  onSaved,
}: {
  schoolClassId?: number;
  triggerChild: React.ReactNode;
  collisionBoundary: HTMLDivElement | null;
  onSaved: (data: FormResult) => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selections, setSelections] = useState<{
    subjects: Subject[];
    teachers: Teacher[];
    shsSections: SeniorHighSectionModel[];
  }>({
    subjects: [],
    teachers: [],
    shsSections: [],
  });

  const [schoolClass, setSchoolClass] = useState<
    ClassScheduleFormData | undefined
  >();

  const [subjectsQuery, teachersQuery, shsSctionsQuery] = trpc.useQueries(
    (t) => [
      t.subject.getSubjects(undefined, { enabled: false }),
      t.teacher.getTeachers(undefined, { enabled: false }),
      t.classSection.getSeniorHighSections(undefined, { enabled: false }),
    ]
  );

  const schoolClassQuery = trpc.classSchedule.getClassSchedule.useQuery(
    schoolClassId ?? 0,
    {
      staleTime: Infinity,
      enabled: false,
    }
  );

  useEffect(() => {
    async function fetchData() {
      const { data: subjectData } = await subjectsQuery.refetch();
      const { data: teachersData } = await teachersQuery.refetch();
      const { data: shsSectionsData } = await shsSctionsQuery.refetch();

      const mappedShsSections = shsSectionsData?.map((section) => {
        var model = new SeniorHighSectionModel({
          classSectionId: Number(section.classSectionId),
          classSectionName: section.classSection.classSectionName,
          yearLevelShortName: section.classSection.yearLevel.yearLevelShortName,
          seniorHighStrandName: section.seniorHighStrand?.seniorHighStrandName,
          seniorHighTrackName: section.seniorHighTrack.seniorHighTrackName,
        });

        return model;
      });

      setSelections({
        subjects: subjectData ?? [],
        teachers: teachersData ?? [],
        shsSections: mappedShsSections ?? [],
      });
    }

    if (isDialogOpen) {
      fetchData();
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (isDialogOpen) {
      async function fetchData() {
        if (!schoolClass) {
          const { data: schoolClassData } = await schoolClassQuery.refetch();

          setSchoolClass(
            schoolClassData
              ? {
                  id: Number(schoolClassData!.schoolClassId),
                  dayOfWeek: schoolClassData!.dayOfWeek,
                  startTime: dayjs
                    .utc(schoolClassData!.startTime)
                    .format("HH:mm"),
                  endTime: dayjs.utc(schoolClassData!.endTime).format("HH:mm"),
                  subjectId: Number(schoolClassData!.subjectId),
                  teacherId: Number(schoolClassData!.teacherId),
                  sectionId: Number(schoolClassData!.sectionId),
                  academicTermId: Number(schoolClassData!.academicTermId),
                }
              : undefined
          );
        }
      }

      if (isDialogOpen) {
        fetchData();
      }
    }
  }, [isDialogOpen, schoolClass]);

  return (
    <Popover modal={false} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <PopoverTrigger asChild>{triggerChild}</PopoverTrigger>
      {(!schoolClassId || schoolClass) &&
        Object.entries(selections).every((s) => s) && (
          <PopoverContent
            align="end"
            sideOffset={8}
            sticky="always"
            className="space-y-3 w-full max-w-lg drop-shadow-2xl p-6"
            collisionBoundary={collisionBoundary}
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <p className="text-lg font-semibold leading-none tracking-tight">
                {schoolClassId === undefined ? "Add" : "Edit"} Class Schedule
              </p>
            </div>
            <ClassScheduleForm
              defaultValues={schoolClass}
              subjects={selections.subjects}
              teachers={selections.teachers}
              shsSections={selections.shsSections}
              onSaved={(data) => {
                setIsDialogOpen(false);
                onSaved(data);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </PopoverContent>
        )}
    </Popover>
  );
};

export const ClassScheduleForm = ({
  defaultValues,
  subjects,
  teachers,
  shsSections,
  onSaved,
  onCancel,
}: {
  defaultValues?: ClassScheduleFormData;
  subjects: Subject[];
  teachers: Teacher[];
  shsSections: SeniorHighSectionModel[];
  onSaved: (data: FormResult) => void;
  onCancel?: () => void;
}) => {
  const form = useForm<ClassScheduleFormData>({
    resolver: zodResolver(ClassScheduleFormSchema),
    defaultValues: !defaultValues ? { academicTermId: 1 } : defaultValues,
  });

  const trpcContext = trpc.useContext();

  const { mutate: saveClassSchedule } =
    trpc.classSchedule.saveClassSchedule.useMutation({
      onSuccess(data) {
        onSaved(data);
        trpcContext.classSchedule.getClassSchedules.invalidate();
      },
      onError(error) {
        form.setError("root", { type: "manual", message: error.message });
      },
    });

  const [startTime, endTime] = form.watch(["startTime", "endTime"]);

  function handleSubmit(data: ClassScheduleFormData) {
    saveClassSchedule(data);
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset className="space-y-3" disabled={form.formState.isSubmitting}>
          <FormField
            control={form.control}
            name="teacherId"
            render={({ field }) => {
              function getFullName(teacher?: Teacher) {
                return !teacher
                  ? ""
                  : `${teacher.lastName}, ${teacher.firstName} ${
                      teacher.nameSuffix ?? ""
                    } ${teacher.middleName ?? ""}`.replaceAll("  ", " ");
              }
              teachers =
                teachers.sort((a, b) => {
                  return getFullName(a).localeCompare(getFullName(b));
                }) ?? [];
              return (
                <FormItem className="space-y-1">
                  <FormLabel>Teacher</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <span className="text-start truncate w-96">
                            {field.value
                              ? getFullName(
                                  teachers.find(
                                    (teacher) =>
                                      Number(teacher.teacherId) ===
                                      Number(field.value)
                                  )
                                )
                              : ""}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0" align="start">
                      <Command
                        filter={(value, search) => {
                          const teacher = teachers.find(
                            (t) => Number(t.teacherId) === Number(value)
                          );
                          if (
                            teacher &&
                            getFullName(teacher)
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          )
                            return 1;
                          return 0;
                        }}
                      >
                        <CommandInput placeholder="Search teacher..." />
                        <CommandEmpty>No teachers found</CommandEmpty>
                        <CommandGroup className="max-h-[240px] overflow-y-auto">
                          {teachers.map((teacher) => (
                            <CommandItem
                              key={Number(teacher.teacherId)}
                              value={Number(teacher.teacherId).toString()}
                              onSelect={() => {
                                teacher;
                                form.setValue(
                                  "teacherId",
                                  Number(teacher.teacherId)
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  Number(teacher.teacherId) ===
                                    Number(field.value)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {getFullName(teacher)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="sectionId"
            render={({ field }) => {
              shsSections =
                shsSections.sort((a, b) => {
                  return a.fullSectionName.localeCompare(b.fullSectionName);
                }) ?? [];
              return (
                <FormItem className="space-y-1">
                  <FormLabel>Section</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <span className="text-start truncate w-96">
                            {field.value
                              ? shsSections.find(
                                  (shsSection) =>
                                    Number(shsSection.classSectionId) ===
                                    Number(field.value)
                                )?.fullSectionName
                              : ""}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0" align="start">
                      <Command
                        filter={(value, search) => {
                          const shsSection = shsSections.find(
                            (s) => Number(s.classSectionId) === Number(value)
                          );
                          if (
                            shsSection &&
                            shsSection.fullSectionName
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          )
                            return 1;
                          return 0;
                        }}
                      >
                        <CommandInput placeholder="Search class section..." />
                        <CommandEmpty>No class sections found</CommandEmpty>
                        <CommandGroup className="max-h-[240px] overflow-y-auto">
                          {shsSections.map((shsSection) => (
                            <CommandItem
                              key={Number(shsSection.classSectionId)}
                              value={Number(
                                shsSection.classSectionId
                              ).toString()}
                              onSelect={() => {
                                form.setValue(
                                  "sectionId",
                                  Number(shsSection.classSectionId)
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  Number(shsSection.classSectionId) ===
                                    Number(field.value)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {shsSection.fullSectionName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => {
              subjects =
                subjects.sort((a, b) =>
                  a.subjectName.localeCompare(b.subjectName)
                ) ?? [];
              return (
                <FormItem className="space-y-1">
                  <FormLabel>Subject</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <span className="text-start truncate w-96">
                            {field.value
                              ? subjects.find(
                                  (subject) =>
                                    Number(subject.subjectId) ===
                                    Number(field.value)
                                )?.subjectName
                              : ""}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0" align="start">
                      <Command
                        filter={(value, search) => {
                          if (
                            subjects
                              .find(
                                (s) => Number(s.subjectId) === Number(value)
                              )
                              ?.subjectName.toLowerCase()
                              .includes(search.toLowerCase())
                          )
                            return 1;
                          return 0;
                        }}
                      >
                        <CommandInput placeholder="Search subject..." />
                        <CommandEmpty>No subjects found</CommandEmpty>
                        <CommandGroup className="max-h-[240px] overflow-y-auto">
                          {subjects.map((subject) => (
                            <CommandItem
                              key={Number(subject.subjectId)}
                              value={Number(subject.subjectId).toString()}
                              onSelect={() => {
                                form.setValue(
                                  "subjectId",
                                  Number(subject.subjectId)
                                );
                              }}
                              className="flex items-start"
                            >
                              <div>
                                <Check
                                  className={cn(
                                    "mr-2 mt-0.5 h-4 w-4",
                                    Number(subject.subjectId) ===
                                      Number(field.value)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </div>
                              <span className="flex-grow">
                                {subject.subjectName}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="pt-0.5 space-y-1.5">
            <div className="flex items-baseline h-4 mt-3">
              <Label className="flex-grow">Class Time</Label>
              <div className="text-xs tabular-nums text-muted-foreground font-medium">
                {startTime &&
                  endTime &&
                  dayjs
                    .utc("1970-01-01" + endTime)
                    .diff(
                      dayjs.utc("1970-01-01" + startTime),
                      "minutes",
                      true
                    ) + " minutes"}
              </div>
            </div>
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-0 w-36">
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Monday</SelectItem>
                          <SelectItem value="2">Tuesday</SelectItem>
                          <SelectItem value="3">Wednesday</SelectItem>
                          <SelectItem value="4">Thursday</SelectItem>
                          <SelectItem value="5">Friday</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-0 flex-grow">
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          className="tabular-nums uppercase"
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-0 flex-grow">
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          className="tabular-nums uppercase"
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </div>
            {(form.formState.errors.startTime ||
              form.formState.errors.endTime ||
              form.formState.errors.dayOfWeek) && (
              <p
                id="error-class-time-input"
                className={cn("text-sm font-medium text-destructive")}
              >
                {form.formState.errors.startTime?.message ??
                  form.formState.errors.endTime?.message ??
                  form.formState.errors.dayOfWeek?.message ??
                  ""}
              </p>
            )}
            {form.formState.errors.root && (
              <p
                id="error-class-schedule"
                className={cn("text-sm font-medium text-destructive")}
              >
                {form.formState.errors.root?.message}
              </p>
            )}
          </div>
        </fieldset>
        <div className="space-x-3 text-right">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => onCancel && onCancel()}
            >
              Cancel
            </Button>
          )}
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};
