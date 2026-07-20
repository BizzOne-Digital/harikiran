import { describe, expect, it } from "vitest";
import { estimateCoverageNeeds } from "@/lib/utilities/coverage";

describe("estimateCoverageNeeds", () => {
  it("calculates total need and coverage gap", () => {
    const result = estimateCoverageNeeds({
      annualIncome: 85_000,
      incomeReplacementYears: 10,
      outstandingDebt: 250_000,
      educationGoal: 80_000,
      existingCoverage: 100_000,
      finalExpenseEstimate: 15_000,
    });

    expect(result.incomeReplacementNeed).toBe(850_000);
    expect(result.debtNeed).toBe(250_000);
    expect(result.educationNeed).toBe(80_000);
    expect(result.finalExpenseNeed).toBe(15_000);
    expect(result.totalNeed).toBe(1_195_000);
    expect(result.coverageGap).toBe(1_095_000);
  });

  it("returns zero gap when existing coverage exceeds need", () => {
    const result = estimateCoverageNeeds({
      annualIncome: 50_000,
      incomeReplacementYears: 5,
      outstandingDebt: 0,
      educationGoal: 0,
      existingCoverage: 500_000,
      finalExpenseEstimate: 10_000,
    });

    expect(result.totalNeed).toBe(260_000);
    expect(result.coverageGap).toBe(0);
  });

  it("throws for negative inputs", () => {
    expect(() =>
      estimateCoverageNeeds({
        annualIncome: -1,
        incomeReplacementYears: 10,
        outstandingDebt: 0,
        educationGoal: 0,
        existingCoverage: 0,
        finalExpenseEstimate: 0,
      }),
    ).toThrow("All coverage inputs must be non-negative numbers.");
  });
});
