export const formatMappingTitle = ({ instrumentTitle, number, label }) => {
  return `${instrumentTitle} ${label ?? "Clause"} ${number}`;
};
