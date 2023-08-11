import { StatusCodes } from "http-status-codes";

export type FormResult = {
  status: StatusCodes;
  title?: string;
  message?: string;
};
