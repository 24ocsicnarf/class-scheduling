// import { trpc } from "@/trpc";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import {
//   LoggedUserPasswordFormData,
//   LoggedUserPasswordFormSchema,
// } from "server/src/zodSchemas/LoggedUserPasswordFormSchema";

// export type PasswordChangedEvent = (data: {
//   message: string;
//   status: number;
// }) => void;

// type ChangePasswordEvent = {
//   onPasswordChanged: PasswordChangedEvent;
// };

// export const LoggedUserPasswordForm = ({
//   onPasswordChanged,
// }: ChangePasswordEvent) => {
//   const [open, setOpen] = useState(false);
//   const [passwordShown, setPasswordShown] = useState(false);

//   const { mutate: changeUserPassword } =
//     trpc.auth.changeLoggedUserPassword.useMutation({
//       onSuccess(data) {
//         setOpen(false);
//         onPasswordChanged(data);
//       },
//       onError(error) {
//         alert(error.message);
//       },
//     });

//   const form = useForm<LoggedUserPasswordFormData>({
//     resolver: zodResolver(LoggedUserPasswordFormSchema),
//   });
// };
