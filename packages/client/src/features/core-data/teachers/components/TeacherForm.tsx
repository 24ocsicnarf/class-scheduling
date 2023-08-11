import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/trpc";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { MdCircle, MdOutlineCircle } from "react-icons/md";

import {
  TeacherFormData,
  TeacherFormSchema,
  TeacherFormObject,
} from "server/src/zodSchemas/TeacherFormSchema";

import { CirclePicker } from "react-color";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "@/components/ui/popover";
import { FormResult } from "server/src/types/FormResult";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormDialog } from "@/components/hooks/use-form-dialog";
import { FormDialog, FormContent } from "@/components/form-dialog";
import { DEFAULT_MAX_INPUT_TEXT_LENGTH } from "@/constants";
import { Sex } from "@/types/Sex";

export const TeacherForm = ({
  teacher,
  onSaved,
  onCancel,
}: {
  teacher?: TeacherFormData;
  onSaved: (data: FormResult) => void;
  onCancel?: () => void;
}) => {
  const form = useForm<TeacherFormData>({
    resolver: zodResolver(TeacherFormSchema),
    defaultValues: teacher,
  });

  const [setError] = useFormDialog(form);

  const trpcUtils = trpc.useContext();

  const { mutate: saveTeacher } = trpc.teacher.saveTeacher.useMutation({
    onSuccess(data) {
      onSaved(data);

      teacher && trpcUtils.teacher.getTeacher.invalidate(teacher?.id);
      trpcUtils.teacher.getTeachers.invalidate();

      form.reset();
    },
    onError(error, variables) {
      setError(error, variables);
    },
  });

  function onSubmit(data: TeacherFormData) {
    saveTeacher(data);
  }

  return (
    <>
      <FormContent form={form} onSubmit={onSubmit} onCancel={onCancel}>
        <fieldset
          className="group space-y-3"
          disabled={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => {
              return (
                <FormItem className="space-y-1">
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => {
              return (
                <FormItem className="space-y-1">
                  <FormLabel>
                    Middle name{" "}
                    <span className="text-sm text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => {
              return (
                <FormItem className="space-y-1">
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="nameSuffix"
              render={({ field }) => {
                return (
                  <FormItem className="space-y-1 w-1/3 min-w-[135px]">
                    <FormLabel>
                      Suffix{" "}
                      <span className="text-sm text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="(ex. Jr., III)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => {
                return (
                  <FormItem className="space-y-1 w-2/3">
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={Number(field.value)?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key={Sex.Male} value={Sex.Male.toString()}>
                          Male
                        </SelectItem>
                        <SelectItem
                          key={Sex.Female}
                          value={Sex.Female.toString()}
                        >
                          Female
                        </SelectItem>
                        <SelectItem
                          key={Sex.NotKnown}
                          value={Sex.NotKnown.toString()}
                        >
                          Rather not say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="shortHonorific"
              render={({ field }) => {
                return (
                  <FormItem className="space-y-1 w-1/3 min-w-[135px]">
                    <FormLabel>Honorific</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="(ex. Mr., Ma'am)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => {
                return (
                  <FormItem className="space-y-1 w-2/3">
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </fieldset>
      </FormContent>
    </>
  );
};

export const EditTeacherFormDialog = ({
  teacherId,
  onSaved,
  open,
  onOpenChange,
}: {
  teacherId: number;
  onSaved: (data: FormResult) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const teacherQuery = trpc.teacher.getTeacher.useQuery(teacherId, {
    staleTime: Infinity,
  });

  return (
    teacherQuery.data && (
      <FormDialog title="Edit Teacher" open={open} onOpenChange={onOpenChange}>
        <TeacherForm
          teacher={{
            id: teacherQuery.data.teacherId,
            firstName: teacherQuery.data.firstName,
            middleName: teacherQuery.data.middleName ?? "",
            lastName: teacherQuery.data.lastName,
            nameSuffix: teacherQuery.data.nameSuffix ?? "",
            sex: teacherQuery.data.sex,
            shortHonorific: teacherQuery.data.shortHonorific ?? "",
            nickname: teacherQuery.data.nickname,
          }}
          onSaved={(data) => {
            onSaved(data);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </FormDialog>
    )
  );
};
