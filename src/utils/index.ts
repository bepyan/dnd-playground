export const $ = (...classnames: any[]) => {
  return classnames.filter((v) => !!v).join(' ');
};

export const inrange = (v: number, min: number, max: number) => {
  if (v < min) return min;
  if (v > max) return max;
  return v;
};
