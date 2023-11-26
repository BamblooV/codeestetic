const roundToNearest = (value: number, precision: number) => {
  return (Math.floor(value / precision) * precision).toFixed(Math.max(-Math.log10(precision), 0));
};

export default roundToNearest;
