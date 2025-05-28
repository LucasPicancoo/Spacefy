export const convertDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Data inválida.");
  }
  date.setUTCHours(0, 0, 0, 0);
  return date;
};
