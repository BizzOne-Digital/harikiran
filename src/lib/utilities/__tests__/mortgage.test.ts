import { describe, expect, it } from "vitest";
import {
  estimateMortgagePayment,
  getFrequencyLabel,
  roundCurrency,
} from "@/lib/utilities/mortgage";

describe("estimateMortgagePayment", () => {
  it("calculates a monthly payment for a standard mortgage", () => {
    const result = estimateMortgagePayment({
      principal: 400_000,
      annualRatePercent: 5.25,
      amortizationYears: 25,
      frequency: "monthly",
    });

    expect(result.payment).toBeGreaterThan(0);
    expect(result.paymentsPerYear).toBe(12);
    expect(result.totalPayments).toBe(300);
    expect(result.totalAmount).toBeGreaterThan(result.principal);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it("supports accelerated bi-weekly payments", () => {
    const result = estimateMortgagePayment({
      principal: 400_000,
      annualRatePercent: 5.25,
      amortizationYears: 25,
      frequency: "accelerated-biweekly",
    });

    expect(result.paymentsPerYear).toBe(26);
    expect(result.payment).toBeGreaterThan(0);
  });

  it("handles zero interest rate", () => {
    const result = estimateMortgagePayment({
      principal: 120_000,
      annualRatePercent: 0,
      amortizationYears: 10,
      frequency: "monthly",
    });

    expect(result.payment).toBe(1000);
    expect(result.totalInterest).toBe(0);
  });

  it("throws for invalid principal", () => {
    expect(() =>
      estimateMortgagePayment({
        principal: 0,
        annualRatePercent: 5,
        amortizationYears: 25,
        frequency: "monthly",
      }),
    ).toThrow("Mortgage amount must be greater than zero.");
  });
});

describe("getFrequencyLabel", () => {
  it("returns human-readable labels", () => {
    expect(getFrequencyLabel("monthly")).toBe("Monthly");
    expect(getFrequencyLabel("accelerated-biweekly")).toBe(
      "Accelerated bi-weekly",
    );
  });
});

describe("roundCurrency", () => {
  it("rounds to two decimal places", () => {
    expect(roundCurrency(10.005)).toBe(10.01);
    expect(roundCurrency(10.004)).toBe(10);
  });
});
