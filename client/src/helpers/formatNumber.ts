const formatNumber = (value: number, precision: number): string => {
  return value.toLocaleString('en', {
    useGrouping: true,
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  });
};

export default formatNumber;
