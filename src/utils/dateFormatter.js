const formatDate = (timestamp) => {
  if (!timestamp) return "Ngày không hợp lệ";
  const date = new Date(timestamp);
  if (isNaN(date)) return "Ngày không hợp lệ";

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = date.getHours() <= 12 ? "AM" : "PM";
  return ` ${hours % 12 || 12}:${
    minutes < 10 ? "0" : ""
  }${minutes}  ${ampm} ${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
};

export default formatDate;
