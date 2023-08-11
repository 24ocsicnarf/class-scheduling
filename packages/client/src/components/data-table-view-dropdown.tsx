import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type DataTableViewDropdownProps<TOptions> = {
  selectedValue: TOptions;
  onSelect: (selected: TOptions) => void;
};

export function DataTableViewDropdown<TOptions>(
  props: DataTableViewDropdownProps<TOptions>
) {
  const { selectedValue, onSelect } = props;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            {options[selectedValue].icon}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={TOptions[selectedValue]}
            onValueChange={(value) => {
              onSelect(
                TOptions[value as keyof typeof TOptions]
              );
            }}
          >
            {
              options.map((option) => <DropdownMenuRadioItem
              value={TOptions[option]}
            >
              Available subjects
            </DropdownMenuRadioItem>);
            }
            {/* <DropdownMenuRadioItem
              value={MasterDataView[MasterDataView.available]}
            >
              Available subjects
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value={MasterDataView[MasterDataView.archived]}
            >
              Archived subjects
            </DropdownMenuRadioItem> */}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <>
        {" "}
        {subjectsView == MasterDataView.archived && (
          <Badge className="rounded-md" variant="default">
            Archived subjects
          </Badge>
        )}
      </>
    </>
  );
}
