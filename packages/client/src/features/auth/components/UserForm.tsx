import { Dialog } from "@headlessui/react";
import Button from "client/src/components/Button";
import { useState } from "react";

export const UserForm = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <form>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Dialog.Panel>
          <Dialog.Title>Add User</Dialog.Title>
          <div>User</div>
          <div>User</div>
          <div>
            <Button>Save</Button>
            <Button>Cancel</Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </form>
  );
};
