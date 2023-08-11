import { trpc } from "@/trpc";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MdAdd, MdArchive } from "react-icons/md";

import { DataTable } from "@/components/data-table";
import { FormResult } from "server/src/types/FormResult";

import { MasterDataView } from "@/types/master-data";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FormDialog } from "@/components/form-dialog";
import { MdGroupWork } from "react-icons/md";
import {
  SeniorHighSectionColumn,
  getSeniorHighSectionColumns,
} from "@/features/core-data/sections/components/class-section-table-columns";
import { SeniorHighSectionForm } from "@/features/core-data/sections/components/SeniorHighSectionForm";

const SectionsPage = () => {
  const onSavedToast = useRef<ReturnType<typeof toast> | null>(null);

  const [sectionsView, setSectionsView] = useState(MasterDataView.available);

  const seniorHighSectionsQuery =
    trpc.classSection.getSeniorHighSections.useQuery({
      isArchived: sectionsView == MasterDataView.archived,
    });

  const handleSaved = async (data: FormResult) => {
    onSavedToast.current = toast({
      title: data.title,
      description: data.message,
    });
  };

  function handleDialogOpened() {
    onSavedToast.current && onSavedToast.current.dismiss();
    onSavedToast.current = null;
  }

  return (
    <div className={`container p-6`}>
      <div className="flex flex-row justify-between h-16 pb-6">
        <div className="flex flex-row items-center gap-4">
          <h1 className="text-3xl font-bold">Class Sections</h1>
          {seniorHighSectionsQuery.isLoading ? (
            <></>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    {sectionsView == MasterDataView.available ? (
                      <MdGroupWork />
                    ) : (
                      <MdArchive />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={MasterDataView[sectionsView]}
                    onValueChange={(value) => {
                      setSectionsView(
                        MasterDataView[value as keyof typeof MasterDataView]
                      );
                    }}
                  >
                    <DropdownMenuRadioItem
                      value={MasterDataView[MasterDataView.available]}
                    >
                      Active sections
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value={MasterDataView[MasterDataView.archived]}
                    >
                      Inactive sections
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <>
                {" "}
                {sectionsView == MasterDataView.archived && (
                  <Badge className="rounded-md" variant="default">
                    Inactive sections
                  </Badge>
                )}
              </>
            </>
          )}
        </div>
        <div className="flex flex-row gap-2">
          {seniorHighSectionsQuery.data && (
            <>
              {sectionsView == MasterDataView.available && (
                <SeniorHighSectionFormDialog
                  onOpened={handleDialogOpened}
                  onSaved={handleSaved}
                />
              )}
            </>
          )}
        </div>
      </div>
      <div>
        {seniorHighSectionsQuery.isLoading ? (
          <div>Loading...</div>
        ) : seniorHighSectionsQuery.error ||
          seniorHighSectionsQuery.data == null ? (
          <div>Error: {seniorHighSectionsQuery.error.message}</div>
        ) : (
          <DataTable
            columns={getSeniorHighSectionColumns(
              handleDialogOpened,
              handleSaved,
              sectionsView
            )}
            data={seniorHighSectionsQuery.data.map((seniorHighSection) => {
              const column: SeniorHighSectionColumn = {
                id: seniorHighSection.classSectionId,
                fullSectionName: `${
                  seniorHighSection.classSection.yearLevel.yearLevelShortName
                } ${
                  seniorHighSection.seniorHighStrand?.seniorHighStrandName ??
                  seniorHighSection.seniorHighTrack.seniorHighTrackName
                }-${seniorHighSection.classSection.classSectionName}`,
              };

              return column;
            })}
            view={sectionsView}
            searchPlaceholder="Search section..."
            facetedFilterColumns={[]}
          />
        )}
      </div>
      {/* <ReactQueryDevtools /> */}
    </div>
  );
};

export default SectionsPage;

const SeniorHighSectionFormDialog = ({
  onOpened,
  onSaved,
}: {
  onOpened?: () => void;
  onSaved?: (data: FormResult) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [
    { data: yearLevelsData, refetch: refetchYearLevels },
    { data: shsTracksData, refetch: refetchShsTracks },
    { data: shsStrandsData, refetch: refetchShsStrands },
  ] = trpc.useQueries((t) => [
    t.yearLevel.getYearLevels(undefined, { enabled: false }),
    t.seniorHighTrack.getSeniorHighTracks(undefined, { enabled: false }),
    t.seniorHighStrand.getSeniorHighStrands(undefined, { enabled: false }),
  ]);

  function handleDialogOpen(open: boolean) {
    setDialogOpen(open);

    if (open) {
      onOpened && onOpened();
    }
  }

  useEffect(() => {
    if (dialogOpen) {
      refetchYearLevels();
      refetchShsTracks();
      refetchShsStrands();
    }
  }, [dialogOpen, refetchYearLevels, refetchShsTracks, refetchShsStrands]);

  return (
    <FormDialog
      title="Add Section"
      triggerChild={
        <Button className="flex flex-row gap-2">
          <MdAdd />
          <span>Add section</span>
        </Button>
      }
      open={dialogOpen}
      onOpenChange={handleDialogOpen}
    >
      <SeniorHighSectionForm
        yearLevels={yearLevelsData ?? []}
        shsTracks={shsTracksData ?? []}
        shsStrands={shsStrandsData ?? []}
        onSaved={(data) => {
          setDialogOpen(false);
          onSaved && onSaved(data);
        }}
        onCancel={() => setDialogOpen(false)}
      />
    </FormDialog>
  );
};
