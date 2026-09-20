import { format, isValid, parseISO, formatDistanceToNow } from "date-fns";

type DateInput = string | number | Date | null | undefined;
type FormatStyle = boolean | "date" | "datetime" | "relative";

const DATE_FORMAT = "dd MMM yyyy";
const DATE_TIME_FORMAT = "dd MMM yyyy, hh:mm a";

export const dateFormatter = (
  date: DateInput,
  formatStyle: FormatStyle = true,
): string => {
  if (date == null) {
    return "-";
  }

  const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(parsedDate)) {
    return "-";
  }

  if (formatStyle === "relative") {
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  }

  const includeTime = formatStyle === true || formatStyle === "datetime";

  return format(parsedDate, includeTime ? DATE_TIME_FORMAT : DATE_FORMAT);
};
