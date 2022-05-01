const LOCALE = "nl-NL";

class NumberUtils {
  static internationalizeNumber(number: number) {
    return new Intl.NumberFormat(LOCALE, {
      style: "decimal",
    }).format(number);
  }
  static financializeNumber(value: number, numberOfDecimals: number = 0) {
    let amountLetter = "";

    if (value >= 1000000) {
      amountLetter = "M";
      value = value / 1000000;
      numberOfDecimals = 2;
    } else if (value >= 1000) {
      amountLetter = "K";
      value = value / 1000;
    }

    value = Number.parseFloat(value.toFixed(numberOfDecimals));

    return `${this.internationalizeNumber(value)}${amountLetter}`;
  }
  static formatPrice(value: number, numberOfDecimals: number = 1) {
    let currencySign = "$";
    value = Number.parseFloat(value.toFixed(numberOfDecimals));

    return `${currencySign}${this.internationalizeNumber(value)}`;
  }

  static hasDecimals(value: number): boolean {
    return value - Math.floor(value) !== 0;
  }

  static removeZeroDecimal(value: number): string {
    return this.hasDecimals(value) ? value.toFixed(1) : value.toFixed(0);
  }
}

export default NumberUtils;
