export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes()} - ${date.toLocaleDateString()}`;
};
