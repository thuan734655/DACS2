const handleDataDate = () => {
  const loadDateOfBirth = () => {
    // ham  load cac ngay
    const options = []; // Sử dụng mảng để chứa các phần tử JSX
    for (let day = 1; day <= 31; day++) {
      options.push(<option value={day}>{day}</option>); // Tạo một phần tử JSX cho mỗi ngày
    }
    return options;
  };

   const loadMonth = () => {
    //ham load cac thang
    const options = [];
    for (let month = 1; month <= 12; month++) {
      options.push(<option value={month}>{month}</option>);
    }
    return options;
  };
  const loadyear = () => {
    const currentYear = new Date().getFullYear();
    //ham load cac thang
    const options = [];
    for (let year = 1890; year <= currentYear ; year++) {
      options.push(<option value={year}>{year}</option>);
    }
    return options;
  };
  return { loadDateOfBirth,loadMonth,loadyear};
};

export default handleDataDate;
