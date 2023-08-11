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
import {
  SeniorHighSectionFormData,
  SeniorHighSectionFormSchema,
} from "server/src/zodSchemas/ClassSectionFormSchedule";
import {
  YearLevel,
  SeniorHighTrack,
  SeniorHighStrand,
} from "server/src/db/prisma";
import { useEffect } from "react";

export const SeniorHighSectionForm = ({
  shsSection,
  yearLevels,
  shsTracks,
  shsStrands,
  onSaved,
  onCancel,
}: {
  shsSection?: SeniorHighSectionFormData;
  yearLevels: YearLevel[];
  shsTracks: SeniorHighTrack[];
  shsStrands: SeniorHighStrand[];
  onSaved: (data: FormResult) => void;
  onCancel?: () => void;
}) => {
  const form = useForm<SeniorHighSectionFormData>({
    resolver: zodResolver(SeniorHighSectionFormSchema),
    defaultValues: shsSection,
  });

  const [setError] = useFormDialog(form);

  const trpcUtils = trpc.useContext();

  const { mutate: saveTeacher } =
    trpc.classSection.saveSeniorHighSection.useMutation({
      onSuccess(data) {
        onSaved(data);

        shsSection &&
          trpcUtils.classSection.getSeniorHighSection.invalidate(
            shsSection?.id
          );
        trpcUtils.classSection.getSeniorHighSections.invalidate();

        form.reset();
      },
      onError(error, variables) {
        setError(error, variables);
      },
    });

  function onSubmit(data: SeniorHighSectionFormData) {
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
            name="yearLevelId"
            render={({ field }) => {
              return (
                <FormItem className="">
                  <FormLabel>Year level</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {yearLevels?.map((yearLevel) => (
                        <SelectItem
                          key={Number(yearLevel.yearLevelId)}
                          value={yearLevel.yearLevelId.toString()}
                        >
                          {yearLevel.yearLevelName}
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
            name="seniorHighTrackId"
            render={({ field }) => {
              return (
                <FormItem className="">
                  <FormLabel>SHS track</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shsTracks?.map((shsTrack) => (
                        <SelectItem
                          key={Number(shsTrack.seniorHighTrackId)}
                          value={shsTrack.seniorHighTrackId.toString()}
                        >
                          {shsTrack.seniorHighTrackName}
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
            name="seniorHighStrandId"
            render={({ field }) => {
              return (
                <FormItem className="">
                  <FormLabel>SHS strand</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                    disabled={form.getValues("seniorHighTrackId") == undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shsStrands
                        ?.filter(
                          (strand) =>
                            Number(strand.seniorHighTrackId) ==
                            form.getValues("seniorHighTrackId")
                        )
                        ?.map((shsStrand) => (
                          <SelectItem
                            key={Number(shsStrand.seniorHighStrandId)}
                            value={shsStrand.seniorHighStrandId.toString()}
                          >
                            {shsStrand.seniorHighStrandName}
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
            name="classSectionName"
            render={({ field }) => {
              return (
                <FormItem className="space-y-1">
                  <FormLabel>Section name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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

export const EditSeniorHighSectionFormDialog = ({
  shsSectionId,
  onSaved,
  open,
  onOpenChange,
}: {
  shsSectionId: number;
  onSaved: (data: FormResult) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const seniorHighSectionQuery =
    trpc.classSection.getSeniorHighSection.useQuery(shsSectionId, {
      staleTime: Infinity,
    });

  const [
    { data: yearLevelsData, refetch: refetchYearLevels },
    { data: shsTracksData, refetch: refetchShsTracks },
    { data: shsStrandsData, refetch: refetchShsStrands },
  ] = trpc.useQueries((t) => [
    t.yearLevel.getYearLevels(undefined, { enabled: false }),
    t.seniorHighTrack.getSeniorHighTracks(undefined, { enabled: false }),
    t.seniorHighStrand.getSeniorHighStrands(undefined, { enabled: false }),
  ]);

  useEffect(() => {
    if (open) {
      refetchYearLevels();
      refetchShsTracks();
      refetchShsStrands();
    }
  }, [open, refetchYearLevels, refetchShsTracks, refetchShsStrands]);

  return (
    seniorHighSectionQuery.data && (
      <FormDialog title="Edit Section" open={open} onOpenChange={onOpenChange}>
        <SeniorHighSectionForm
          shsSection={{
            id: seniorHighSectionQuery.data.classSectionId,
            classSectionName:
              seniorHighSectionQuery.data.classSection.classSectionName,
            seniorHighTrackId: seniorHighSectionQuery.data.seniorHighTrackId,
            seniorHighStrandId: seniorHighSectionQuery.data.seniorHighStrandId,
            yearLevelId:
              seniorHighSectionQuery.data.classSection.yearLevel.yearLevelId,
          }}
          yearLevels={yearLevelsData ?? []}
          shsTracks={shsTracksData ?? []}
          shsStrands={shsStrandsData ?? []}
          onSaved={(data) => {
            onSaved(data);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </FormDialog>
    )
  );
};
