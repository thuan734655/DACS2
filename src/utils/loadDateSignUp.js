const handleDataDate = () => {
  const loadDateOfBirth = () => {
    return Array.from({ length: 31 }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {i + 1}
      </option>
    ));
  };

  const loadMonth = () => {
    return Array.from({ length: 12 }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {i + 1}
      </option>
    ));
  };
  const loadyear = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: 100 },
      (_, i) => currentYear - i
    );
    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };
  return { loadDateOfBirth,loadMonth,loadyear};
};

export default handleDataDate;
