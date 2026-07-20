/**
 * Life coverage needs estimator.
 * Educational estimate only — not a quotation, guarantee or advice.
 */

export interface CoverageNeedsInput {
  annualIncome: number;
  incomeReplacementYears: number;
  outstandingDebt: number;
  educationGoal: number;
  existingCoverage: number;
  finalExpenseEstimate: number;
}

export interface CoverageNeedsResult {
  incomeReplacementNeed: number;
  debtNeed: number;
  educationNeed: number;
  finalExpenseNeed: number;
  totalNeed: number;
  existingCoverage: number;
  coverageGap: number;
}

export function estimateCoverageNeeds(
  input: CoverageNeedsInput,
): CoverageNeedsResult {
  const {
    annualIncome,
    incomeReplacementYears,
    outstandingDebt,
    educationGoal,
    existingCoverage,
    finalExpenseEstimate,
  } = input;

  if (
    [
      annualIncome,
      incomeReplacementYears,
      outstandingDebt,
      educationGoal,
      existingCoverage,
      finalExpenseEstimate,
    ].some((v) => v < 0 || Number.isNaN(v))
  ) {
    throw new Error("All coverage inputs must be non-negative numbers.");
  }

  const incomeReplacementNeed = round(
    annualIncome * incomeReplacementYears,
  );
  const debtNeed = round(outstandingDebt);
  const educationNeed = round(educationGoal);
  const finalExpenseNeed = round(finalExpenseEstimate);
  const totalNeed = round(
    incomeReplacementNeed + debtNeed + educationNeed + finalExpenseNeed,
  );
  const existing = round(existingCoverage);
  const coverageGap = round(Math.max(0, totalNeed - existing));

  return {
    incomeReplacementNeed,
    debtNeed,
    educationNeed,
    finalExpenseNeed,
    totalNeed,
    existingCoverage: existing,
    coverageGap,
  };
}

function round(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
