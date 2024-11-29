// Format timestamp to Vietnamese format with detailed time
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Format time as HH:mm
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  // Format date
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateStr = `${day} tháng ${month}, ${year}`;

  // Format weekday
  const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const weekday = weekdays[date.getDay()];

  // Nếu là trong vòng 1 phút
  if (diffInSeconds < 60) {
    return `Vừa xong (${timeStr})`;
  }
  // Nếu là trong vòng 1 giờ
  else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước (${timeStr})`;
  }
  // Nếu là trong vòng 24 giờ
  else if (diffInHours < 24) {
    return `${diffInHours} giờ trước (${timeStr})`;
  }
  // Nếu là hôm nay
  else if (date.toDateString() === now.toDateString()) {
    return `Hôm nay lúc ${timeStr}`;
  }
  // Nếu là hôm qua
  else if (new Date(now - 86400000).toDateString() === date.toDateString()) {
    return `Hôm qua lúc ${timeStr}`;
  }
  // Nếu là trong tuần này (7 ngày trước)
  else if (diffInDays < 7) {
    return `${weekday} lúc ${timeStr}`;
  }
  // Các trường hợp còn lại
  else {
    return `${weekday}, ${dateStr} lúc ${timeStr}`;
  }
};
