import { format, isValid, parseISO } from "date-fns";

type DateInput = string | number | Date | null | undefined;

const DATE_FORMAT = "dd MMM yyyy";
const DATE_TIME_FORMAT = "dd MMM yyyy, hh:mm a";

export const dateFormatter = (date: DateInput, includeTime = true): string => {
  if (date == null) {
    return "-";
  }

  const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(parsedDate)) {
    return "-";
  }

  return format(parsedDate, includeTime ? DATE_TIME_FORMAT : DATE_FORMAT);
};
