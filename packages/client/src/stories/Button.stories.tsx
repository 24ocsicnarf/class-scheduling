import { Meta, StoryObj } from "@storybook/react";
import Button from "./../components/Button";
import { MdAddCircle, MdChevronRight, MdCircle, MdLogin } from "react-icons/md";

const meta = {
  title: "App/Button",
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ButtonVariants = () => (
  <div className="flex justify-start gap-4 overflow-auto w-full p-2">
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-2 items-start">
        <Button intent="primary">Button</Button>
        <Button intent="primary" leading={MdCircle}>
          Button
        </Button>
        <Button intent="primary" trailing={MdChevronRight}>
          Button
        </Button>
        <Button intent="primary" roundness="pill" trailing={MdChevronRight}>
          Button
        </Button>
        <Button intent="primary" roundness="pill" trailing={MdCircle}>
          Button
        </Button>
        <Button intent="primary" roundness="square" trailing={MdChevronRight}>
          Button
        </Button>
        <Button intent="primary" leading={MdCircle} trailing={MdChevronRight}>
          Button
        </Button>
      </div>
      <div className="flex gap-2 items-start">
        <Button intent="primary" size="small">
          Button
        </Button>
        <Button intent="primary" size="small" leading={MdCircle}>
          Button
        </Button>
      </div>
      <div className="flex gap-2 items-start">
        <Button intent="primary" size="large">
          Button
        </Button>
        <Button intent="primary" size="large" leading={MdCircle}>
          Button
        </Button>
        {/* <Button
          intent="primary"
          size="large"
          roundness="pill"
          leading={MdCircle}
        ></Button>
        <Button intent="primary" size="large" trailing={MdChevronRight}>
          Button
        </Button>
        <Button
          intent="primary"
          size="large"
          leading={MdCircle}
          trailing={MdChevronRight}
        >
          Button
        </Button> */}
      </div>

      <div className="flex gap-2 items-start">
        <Button intent="primary" fill="outline">
          Button
        </Button>
        {/* <Button intent="primary" fill="outline" leading={MdCircle}></Button>
        <Button
          intent="primary"
          fill="outline"
          roundness="pill"
          leading={MdCircle}
        ></Button>
        <Button intent="primary" fill="outline" leading={MdCircle}>
          Button
        </Button>
        <Button intent="primary" fill="outline" trailing={MdChevronRight}>
          Button
        </Button>
        <Button
          intent="primary"
          fill="outline"
          leading={MdCircle}
          trailing={MdChevronRight}
        >
          Button
        </Button> */}
      </div>
      <div className="flex gap-2 items-start">
        <Button intent="primary" fill="outline" size="small">
          Button
        </Button>
        {/* <Button
          intent="primary"
          fill="outline"
          size="small"
          leading={MdCircle}
        ></Button>
        <Button
          intent="primary"
          fill="outline"
          size="small"
          roundness="pill"
          leading={MdCircle}
        ></Button>
        <Button intent="primary" fill="outline" size="small" leading={MdCircle}>
          Button
        </Button>
        <Button
          intent="primary"
          fill="outline"
          size="small"
          trailing={MdChevronRight}
        >
          Button
        </Button>
        <Button
          intent="primary"
          fill="outline"
          size="small"
          leading={MdCircle}
          trailing={MdChevronRight}
        >
          Button
        </Button> */}
      </div>
      <div className="flex gap-2 items-start">
        <Button intent="primary" fill="outline" size="large">
          Button
        </Button>
        {/* <Button
          intent="primary"
          fill="outline"
          size="large"
          leading={MdCircle}
        ></Button>
        <Button
          intent="primary"
          fill="outline"
          size="large"
          roundness="pill"
          leading={MdCircle}
        ></Button>
        <Button intent="primary" fill="outline" size="large" leading={MdCircle}>
          Button
        </Button>
        <Button
          intent="primary"
          fill="outline"
          size="large"
          trailing={MdChevronRight}
        >
          Button
        </Button>
        <Button
          intent="primary"
          fill="outline"
          size="large"
          leading={MdCircle}
          trailing={MdChevronRight}
        >
          Button
        </Button> */}
      </div>

      <div className="flex gap-2 items-start">
        <Button intent="primary" fill="ghost">
          Button
        </Button>
        {/* <Button intent="primary" fill="ghost" leading={MdCircle}></Button>
        <Button
          intent="primary"
          fill="ghost"
          roundness="pill"
          leading={MdCircle}
        ></Button>
        <Button intent="primary" fill="ghost" leading={MdCircle}>
          Button
        </Button>
        <Button intent="primary" fill="ghost" trailing={MdChevronRight}>
          Button
        </Button>
        <Button
          intent="primary"
          fill="ghost"
          leading={MdCircle}
          trailing={MdChevronRight}
        >
          Button
        </Button> */}
      </div>
      <div className="flex gap-2 items-start">
        <Button intent="primary" fill="ghost" size="small">
          Button
        </Button>
        {/* <Button
          intent="primary"
          fill="ghost"
          size="small"
          leading={MdCircle}
        ></Button>
        <Button
          intent="primary"
          fill="ghost"
          size="small"
          roundness="pill"
          leading={MdCircle}
        ></Button>
        <Button intent="primary" fill="ghost" size="small" leading={MdCircle}>
          Button
        </Button>
        <Button
          intent="primary"
          fill="ghost"
          size="small"
          trailing={MdChevronRight}
        >
          Button
        </Button>
        <Button
          intent="primary"
          fill="ghost"
          size="small"
          leading={MdCircle}
          trailing={MdChevronRight}
        >
          Button
        </Button> */}
      </div>
      <div className="flex gap-2 items-start">
        <Button intent="primary" fill="ghost" size="large">
          Button
        </Button>
        {/* <Button
          intent="primary"
          fill="ghost"
          size="large"
          leading={MdCircle}
        ></Button>
        <Button
          intent="primary"
          fill="ghost"
          size="large"
          roundness="pill"
          leading={MdCircle}
        ></Button>
        <Button intent="primary" fill="ghost" size="large" leading={MdCircle}>
          Button
        </Button>
        <Button
          intent="primary"
          fill="ghost"
          size="large"
          trailing={MdChevronRight}
        >
          Button
        </Button>
        <Button
          intent="primary"
          fill="ghost"
          size="large"
          leading={MdCircle}
          trailing={MdChevronRight}
        >
          Button
        </Button> */}
      </div>

      <Button intent="primary" fill="ghost">
        Primary ghost button
      </Button>
      <Button intent="primary" roundness="square">
        Primary square button
      </Button>
      <Button intent="primary" roundness="pill">
        Primary pill button
      </Button>
      <Button intent="primary" fill="outline" size="medium" leading={MdLogin}>
        Login
      </Button>
      <Button
        intent="primary"
        fill="outline"
        size="medium"
        roundness="pill"
        leading={MdLogin}
      >
        Login
      </Button>
      <Button
        intent="primary"
        fill="outline"
        size="medium"
        roundness="pill"
        trailing={MdChevronRight}
      >
        Continue
      </Button>
    </div>
  </div>
);

// export const FullWidth = () => <Button label="Full width" width="full" />;
