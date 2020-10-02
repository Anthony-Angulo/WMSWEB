export {}

declare global {

  interface Number {
    toFixedNumber(digits?: number, base?: number): number;
  }

}

Number.prototype.toFixedNumber = function(digits = 2, base = 10){
  const pow = Math.pow(base, digits);
  return Math.round(this * pow) / pow;
};
