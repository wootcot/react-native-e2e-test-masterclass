import i18next from "i18next";
import { AxiosError } from "axios";

export function handleApiError(error: any): string {
  const errorResp = error.response?.data["error"];
  if (error instanceof AxiosError && errorResp) return errorResp;
  if (error.message) return error.message;
  return i18next.t("somethingWentWrong");
}
