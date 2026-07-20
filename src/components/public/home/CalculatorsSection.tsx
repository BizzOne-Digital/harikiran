"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  estimateCoverageNeeds,
  type CoverageNeedsResult,
} from "@/lib/utilities/coverage";
import {
  estimateMortgagePayment,
  getFrequencyLabel,
  type MortgageResult,
  type PaymentFrequency,
} from "@/lib/utilities/mortgage";
import { cn } from "@/lib/utilities/cn";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CalculatorsSection() {
  const [activeTab, setActiveTab] = useState<"mortgage" | "coverage">("mortgage");

  return (
    <section className="section-padding bg-surface">
      <div className="container-wide">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wider text-cyan uppercase">
            Educational calculators
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">
            Explore scenarios before your consultation
          </h2>
          <p className="mt-4 text-sm text-text-secondary">
            Results are educational estimates only — not quotations, approvals,
            guarantees or personalized financial advice.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <div className="mx-auto flex max-w-md rounded-xl border border-border bg-background p-1">
            {(["mortgage", "coverage"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  activeTab === tab
                    ? "bg-blue text-white"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                {tab === "mortgage" ? "Mortgage Payment" : "Coverage Needs"}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-8">
          {activeTab === "mortgage" ? <MortgageCalculator /> : <CoverageCalculator />}
        </Reveal>
      </div>
    </section>
  );
}

function MortgageCalculator() {
  const [principal, setPrincipal] = useState("400000");
  const [rate, setRate] = useState("5.25");
  const [years, setYears] = useState("25");
  const [frequency, setFrequency] = useState<PaymentFrequency>("monthly");
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    try {
      setError("");
      setResult(
        estimateMortgagePayment({
          principal: Number(principal),
          annualRatePercent: Number(rate),
          amortizationYears: Number(years),
          frequency,
        }),
      );
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Invalid input");
    }
  }

  return (
    <div className="glass-panel mx-auto max-w-3xl rounded-2xl p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="principal">Mortgage amount (CAD)</Label>
          <Input
            id="principal"
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rate">Annual interest rate (%)</Label>
          <Input
            id="rate"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="years">Amortization (years)</Label>
          <Input
            id="years"
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">Payment frequency</Label>
          <Select
            value={frequency}
            onValueChange={(v) => setFrequency(v as PaymentFrequency)}
          >
            <SelectTrigger id="frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="accelerated-biweekly">
                Accelerated bi-weekly
              </SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="accelerated-weekly">Accelerated weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="mt-6" onClick={calculate} variant="gold">
        Calculate estimate
      </Button>

      {error && (
        <p className="mt-4 text-sm text-accent" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8 rounded-xl border border-cyan/20 bg-navy/20 p-6">
          <Badge className="mb-4">Estimate only</Badge>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-text-secondary">
                {getFrequencyLabel(frequency)} payment
              </dt>
              <dd className="font-display text-2xl text-gradient">
                {formatCurrency(result.payment)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-secondary">Total interest</dt>
              <dd className="text-lg text-text-primary">
                {formatCurrency(result.totalInterest)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-secondary">Total amount paid</dt>
              <dd className="text-lg text-text-primary">
                {formatCurrency(result.totalAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-secondary">Number of payments</dt>
              <dd className="text-lg text-text-primary">{result.totalPayments}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-text-secondary">
            This calculator uses a semi-annual compounding assumption common for
            Canadian mortgages. Actual lender terms, fees and qualification may
            differ.
          </p>
        </div>
      )}
    </div>
  );
}

function CoverageCalculator() {
  const [annualIncome, setAnnualIncome] = useState("85000");
  const [years, setYears] = useState("10");
  const [debt, setDebt] = useState("250000");
  const [education, setEducation] = useState("80000");
  const [existing, setExisting] = useState("100000");
  const [finalExpense, setFinalExpense] = useState("15000");
  const [result, setResult] = useState<CoverageNeedsResult | null>(null);
  const [error, setError] = useState("");

  const rows = useMemo(
    () =>
      result
        ? [
            { label: "Income replacement", value: result.incomeReplacementNeed },
            { label: "Outstanding debt", value: result.debtNeed },
            { label: "Education goal", value: result.educationNeed },
            { label: "Final expenses", value: result.finalExpenseNeed },
          ]
        : [],
    [result],
  );

  function calculate() {
    try {
      setError("");
      setResult(
        estimateCoverageNeeds({
          annualIncome: Number(annualIncome),
          incomeReplacementYears: Number(years),
          outstandingDebt: Number(debt),
          educationGoal: Number(education),
          existingCoverage: Number(existing),
          finalExpenseEstimate: Number(finalExpense),
        }),
      );
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Invalid input");
    }
  }

  return (
    <div className="glass-panel mx-auto max-w-3xl rounded-2xl p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="income"
          label="Annual income (CAD)"
          value={annualIncome}
          onChange={setAnnualIncome}
        />
        <Field
          id="income-years"
          label="Income replacement years"
          value={years}
          onChange={setYears}
        />
        <Field
          id="debt"
          label="Outstanding debt (CAD)"
          value={debt}
          onChange={setDebt}
        />
        <Field
          id="education"
          label="Education goal (CAD)"
          value={education}
          onChange={setEducation}
        />
        <Field
          id="existing"
          label="Existing coverage (CAD)"
          value={existing}
          onChange={setExisting}
        />
        <Field
          id="final-expense"
          label="Final expense estimate (CAD)"
          value={finalExpense}
          onChange={setFinalExpense}
        />
      </div>

      <Button className="mt-6" onClick={calculate} variant="gold">
        Calculate estimate
      </Button>

      {error && (
        <p className="mt-4 text-sm text-accent" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8 rounded-xl border border-cyan/20 bg-navy/20 p-6">
          <Badge className="mb-4">Estimate only</Badge>
          <dl className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <dt className="text-text-secondary">{row.label}</dt>
                <dd className="text-text-primary">{formatCurrency(row.value)}</dd>
              </div>
            ))}
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between gap-4">
                <dt className="font-medium text-text-primary">Total need</dt>
                <dd className="font-display text-xl">
                  {formatCurrency(result.totalNeed)}
                </dd>
              </div>
              <div className="mt-2 flex items-center justify-between gap-4">
                <dt className="text-text-secondary">Estimated coverage gap</dt>
                <dd className="text-lg text-gradient">
                  {formatCurrency(result.coverageGap)}
                </dd>
              </div>
            </div>
          </dl>
          <p className="mt-4 text-xs text-text-secondary">
            This is a simplified educational model. Underwriting, product design
            and personal circumstances will affect suitable coverage.
          </p>
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
