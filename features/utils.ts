import { BigNumber } from "bignumber.js";

const NEAR_DENOMINATOR = 10 ** 24;
export const format = (
  value: string | number,
  denominator = NEAR_DENOMINATOR
) => {
  return BigNumber(value).div(denominator).toFormat(5);
};
