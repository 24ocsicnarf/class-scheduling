import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// import { DevTool } from "@hookform/devtools";
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
  SubjectFormData,
  SubjectFormSchema,
  SubjectFormObject,
} from "server/src/zodSchemas/SubjectFormSchema";

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
import { SubjectCategory } from "server/src/db/prisma";

export const SubjectForm = ({
  subject,
  categories,
  onSaved,
  onCancel,
}: {
  subject?: SubjectFormData;
  categories: SubjectCategory[];
  onSaved: (data: FormResult) => void;
  onCancel?: () => void;
}) => {
  const form = useForm<SubjectFormData>({
    resolver: zodResolver(SubjectFormSchema),
    defaultValues: subject,
  });

  const [setError] = useFormDialog(form);

  const trpcUtils = trpc.useContext();

  const { mutate: saveSubject } = trpc.subject.saveSubject.useMutation({
    onSuccess(data) {
      onSaved(data);

      subject && trpcUtils.subject.getSubject.invalidate(subject?.id);
      trpcUtils.subject.getSubjects.invalidate();

      form.reset();
    },
    onError(error, variables) {
      setError(error, variables);
    },
  });

  function onSubmit(data: SubjectFormData) {
    saveSubject(data);
  }

  return (
    <>
      <FormContent form={form} onSubmit={onSubmit} onCancel={onCancel}>
        <fieldset
          className="group space-y-6"
          disabled={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="subjectName"
            render={({ field }) => {
              return (
                <FormItem className="space-y-1">
                  <FormLabel>Subject name</FormLabel>
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
            name="subjectShortName"
            render={({ field }) => {
              const maxLength =
                SubjectFormObject.shape.subjectShortName.maxLength ??
                DEFAULT_MAX_INPUT_TEXT_LENGTH;

              return (
                <FormItem className="space-y-1">
                  <FormLabel className="flex items-center justify-between">
                    <span className="text-sm">Short name</span>
                    <span
                      className={`text-xs tabular-nums ${
                        field?.value?.length > maxLength
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {maxLength - (field?.value?.length ?? 0)}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={maxLength} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="subjectCategoryId"
            render={({ field }) => {
              return (
                <FormItem className="space-y-1">
                  <FormLabel>Category</FormLabel>
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
                      {categories.map((category) => (
                        <SelectItem
                          key={Number(category.subjectCategoryId).toString()}
                          value={Number(category.subjectCategoryId).toString()}
                        >
                          {category.subjectCategoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="colorHex"
            render={({ field }) => {
              return (
                <FormItem className="space-y-1">
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger className="flex" asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="text-2xl flex-grow"
                        >
                          {field.value ? (
                            <MdCircle style={{ color: field.value }} />
                          ) : (
                            <MdOutlineCircle className="text-muted" />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <CirclePicker
                          ref={field.ref}
                          color={field.value}
                          onChangeComplete={(color) => {
                            field.onChange(color.hex);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </fieldset>
      </FormContent>
    </>
  );
};

export const EditSubjectFormDialog = ({
  subjectId,
  onSaved,
  open,
  onOpenChange,
}: {
  subjectId: number;
  onSaved: (data: FormResult) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const subjectQuery = trpc.subject.getSubject.useQuery(subjectId, {
    staleTime: Infinity,
  });

  const { data: categoriesData } = trpc.subject.getCategories.useQuery(
    undefined,
    {
      staleTime: Infinity,
    }
  );

  return (
    subjectQuery.data && (
      <FormDialog title="Edit Subject" open={open} onOpenChange={onOpenChange}>
        <SubjectForm
          subject={{
            id: subjectQuery.data.subjectId,
            subjectName: subjectQuery.data.subjectName,
            subjectShortName: subjectQuery.data.subjectShortName,
            colorHex: subjectQuery.data.colorHex,
            subjectCategoryId: subjectQuery.data.subjectCategoryId,
          }}
          categories={categoriesData ?? []}
          onSaved={(data) => {
            onSaved(data);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </FormDialog>
    )
  );
};
