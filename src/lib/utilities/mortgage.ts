/**
 * Mortgage payment estimator utilities.
 * Results are educational estimates only — not quotations or advice.
 */

export type PaymentFrequency =
  | "monthly"
  | "biweekly"
  | "accelerated-biweekly"
  | "weekly"
  | "accelerated-weekly";

export interface MortgageInput {
  principal: number;
  annualRatePercent: number;
  amortizationYears: number;
  frequency: PaymentFrequency;
}

export interface MortgageResult {
  payment: number;
  paymentsPerYear: number;
  totalPayments: number;
  totalAmount: number;
  totalInterest: number;
  principal: number;
}

const FREQUENCY_MAP: Record<
  PaymentFrequency,
  { paymentsPerYear: number; label: string }
> = {
  monthly: { paymentsPerYear: 12, label: "Monthly" },
  biweekly: { paymentsPerYear: 26, label: "Bi-weekly" },
  "accelerated-biweekly": {
    paymentsPerYear: 26,
    label: "Accelerated bi-weekly",
  },
  weekly: { paymentsPerYear: 52, label: "Weekly" },
  "accelerated-weekly": {
    paymentsPerYear: 52,
    label: "Accelerated weekly",
  },
};

export function getFrequencyLabel(frequency: PaymentFrequency) {
  return FREQUENCY_MAP[frequency].label;
}

export function estimateMortgagePayment(input: MortgageInput): MortgageResult {
  const { principal, annualRatePercent, amortizationYears, frequency } = input;

  if (principal <= 0) {
    throw new Error("Mortgage amount must be greater than zero.");
  }
  if (amortizationYears <= 0) {
    throw new Error("Amortization period must be greater than zero.");
  }
  if (annualRatePercent < 0) {
    throw new Error("Interest rate cannot be negative.");
  }

  const { paymentsPerYear } = FREQUENCY_MAP[frequency];
  const totalPayments = Math.round(amortizationYears * paymentsPerYear);

  // Canadian mortgages typically compound semi-annually.
  const semiAnnualRate = annualRatePercent / 100 / 2;
  const equivalentPeriodicRate =
    Math.pow(1 + semiAnnualRate, 2 / paymentsPerYear) - 1;

  let payment: number;
  if (equivalentPeriodicRate === 0) {
    payment = principal / totalPayments;
  } else {
    const factor = Math.pow(1 + equivalentPeriodicRate, totalPayments);
    payment = (principal * equivalentPeriodicRate * factor) / (factor - 1);
  }

  // Accelerated schedules use half/quarter of a monthly payment.
  if (frequency === "accelerated-biweekly" || frequency === "accelerated-weekly") {
    const monthlyRate =
      Math.pow(1 + semiAnnualRate, 2 / 12) - 1;
    const monthlyPayments = amortizationYears * 12;
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = principal / monthlyPayments;
    } else {
      const mf = Math.pow(1 + monthlyRate, monthlyPayments);
      monthlyPayment = (principal * monthlyRate * mf) / (mf - 1);
    }
    payment =
      frequency === "accelerated-biweekly"
        ? monthlyPayment / 2
        : monthlyPayment / 4;
  }

  const roundedPayment = roundCurrency(payment);
  const totalAmount = roundCurrency(roundedPayment * totalPayments);
  const totalInterest = roundCurrency(Math.max(0, totalAmount - principal));

  return {
    payment: roundedPayment,
    paymentsPerYear,
    totalPayments,
    totalAmount,
    totalInterest,
    principal: roundCurrency(principal),
  };
}

export function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
