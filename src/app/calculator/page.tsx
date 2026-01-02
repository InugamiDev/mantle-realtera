"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  Home,
  Building,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Wallet,
  PiggyBank,
  BarChart3,
} from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";
import { BreakEvenChart } from "@/components/realtera/BreakEvenChart";


// Format percentage
function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Input component with slider and number input
interface DualInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  format?: (v: number) => string;
  accentColor?: string;
  helpText?: string;
}

function DualInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
  format = (v) => v.toLocaleString("vi-VN"),
  accentColor = "cyan",
  helpText,
}: DualInputProps) {
  const [showInput, setShowInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    const num = Number(raw);
    if (!isNaN(num)) {
      onChange(Math.min(max, Math.max(min, num)));
    }
  };

  const accentClasses: Record<string, string> = {
    cyan: "accent-cyan-500",
    purple: "accent-purple-500",
    emerald: "accent-emerald-500",
    amber: "accent-amber-500",
  };

  return (
    <div className="space-y-1.5 sm:space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm text-muted-foreground">{label}</label>
        {helpText && (
          <span className="group relative">
            <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5 cursor-help text-muted-foreground/50" />
            <span className="absolute bottom-full right-0 z-10 mb-1 hidden w-40 sm:w-48 rounded-lg bg-foreground p-2 text-[10px] sm:text-xs text-background group-hover:block">
              {helpText}
            </span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`flex-1 ${accentClasses[accentColor]}`}
        />
        <button
          onClick={() => setShowInput(!showInput)}
          className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10"
        >
          <Calculator className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
      {showInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value.toLocaleString("vi-VN")}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-2 sm:px-3 py-1.5 sm:py-2 text-right text-xs sm:text-sm text-foreground focus:border-cyan-500 focus:outline-none"
          />
          <span className="shrink-0 text-xs sm:text-sm text-muted-foreground">{unit}</span>
        </div>
      ) : (
        <p className="text-right text-base sm:text-lg font-bold text-foreground">
          {format(value)}
          {unit && <span className="ml-1 text-xs sm:text-sm font-normal text-muted-foreground">{unit}</span>}
        </p>
      )}
    </div>
  );
}

// Collapsible section
interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-white/5 bg-white/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-3 sm:p-4 text-left"
      >
        <span className="text-sm sm:text-base font-medium text-foreground">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {isOpen && <div className="border-t border-white/5 p-3 sm:p-4">{children}</div>}
    </div>
  );
}

export default function CalculatorPage() {
  const t = useTranslations("calculator");
  const tCommon = useTranslations("common");
  const tUnits = useTranslations("units");

  // Format currency with translations - shorter on mobile
  const formatCurrency = (value: number, short = false): string => {
    if (value >= 1_000_000_000) {
      return short
        ? `${(value / 1_000_000_000).toFixed(1)}T`
        : `${(value / 1_000_000_000).toFixed(1)} ${tUnits("billion")}`;
    }
    if (value >= 1_000_000) {
      return short
        ? `${(value / 1_000_000).toFixed(0)}Tr`
        : `${(value / 1_000_000).toFixed(0)} ${tUnits("million")}`;
    }
    return `${value.toLocaleString("vi-VN")} ${tUnits("dong")}`;
  };

  // Input states
  const [propertyPrice, setPropertyPrice] = useState<number>(3_000_000_000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [loanTermYears, setLoanTermYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [monthlyRent, setMonthlyRent] = useState<number>(15_000_000);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(50_000_000);
  const [propertyAppreciation, setPropertyAppreciation] = useState<number>(5);
  const [rentInflation, setRentInflation] = useState<number>(5);
  const [investmentReturn, setInvestmentReturn] = useState<number>(10);
  const [analysisYears, setAnalysisYears] = useState<number>(20);

  // Calculations
  const calculations = useMemo(() => {
    // === BASIC CALCULATIONS ===
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;

    // Monthly mortgage payment using PMT formula
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    const monthlyMortgage =
      monthlyRate > 0
        ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
        : loanAmount / numberOfPayments;

    // Total mortgage payments
    const totalMortgagePaid = monthlyMortgage * numberOfPayments;
    const totalInterestPaid = totalMortgagePaid - loanAmount;

    // === BUYING SCENARIO ===
    const transactionCost = propertyPrice * 0.035;
    const annualMaintenance = propertyPrice * 0.01;
    const annualPropertyTax = propertyPrice * 0.0003;

    const futurePropertyValue =
      propertyPrice * Math.pow(1 + propertyAppreciation / 100, analysisYears);
    const propertyGain = futurePropertyValue - propertyPrice;

    const mortgagePaymentsInPeriod = Math.min(analysisYears * 12, numberOfPayments);
    const mortgagePaidInPeriod = monthlyMortgage * mortgagePaymentsInPeriod;

    let remainingLoanBalance = 0;
    if (analysisYears * 12 < numberOfPayments) {
      remainingLoanBalance =
        loanAmount * Math.pow(1 + monthlyRate, mortgagePaymentsInPeriod) -
        (monthlyMortgage * (Math.pow(1 + monthlyRate, mortgagePaymentsInPeriod) - 1)) / monthlyRate;
    }

    const totalMaintenanceCost = annualMaintenance * analysisYears;
    const totalPropertyTax = annualPropertyTax * analysisYears;
    const totalBuyCost =
      downPayment + transactionCost + mortgagePaidInPeriod + totalMaintenanceCost + totalPropertyTax;

    const netBuyPosition = futurePropertyValue - remainingLoanBalance - totalBuyCost;
    const equityBuilt = futurePropertyValue - remainingLoanBalance;

    // === RENTING SCENARIO ===
    let totalRentCost = 0;
    let currentRent = monthlyRent;
    const rentByYear: number[] = [];

    for (let year = 0; year < analysisYears; year++) {
      const yearlyRent = currentRent * 12;
      totalRentCost += yearlyRent;
      rentByYear.push(yearlyRent);
      currentRent *= 1 + rentInflation / 100;
    }

    const finalYearMonthlyRent = monthlyRent * Math.pow(1 + rentInflation / 100, analysisYears - 1);

    // === INVESTMENT ALTERNATIVE ===
    const monthlyBuyCost = monthlyMortgage + annualMaintenance / 12 + annualPropertyTax / 12;
    const monthlySavings = monthlyBuyCost - monthlyRent;

    const monthlyInvestmentRate = investmentReturn / 100 / 12;
    const downPaymentInvested =
      (downPayment + transactionCost) * Math.pow(1 + investmentReturn / 100, analysisYears);

    let monthlySavingsInvested = 0;
    if (monthlySavings > 0) {
      monthlySavingsInvested =
        monthlySavings *
        ((Math.pow(1 + monthlyInvestmentRate, analysisYears * 12) - 1) / monthlyInvestmentRate);
    }

    const totalInvestmentValue = downPaymentInvested + monthlySavingsInvested;
    const investmentGain = totalInvestmentValue - (downPayment + transactionCost);
    const netRentPosition = totalInvestmentValue - totalRentCost;

    // === COMPARISON ===
    const buyVsRentDifference = netBuyPosition - netRentPosition;

    // === KEY METRICS ===
    const annualRent = monthlyRent * 12;
    const priceToRentRatio = propertyPrice / annualRent;
    const grossRentalYield = (annualRent / propertyPrice) * 100;
    const debtToIncomeRatio = (monthlyMortgage / monthlyIncome) * 100;
    const isAffordable = debtToIncomeRatio <= 40;

    const maxAffordablePrice =
      monthlyRate > 0
        ? ((monthlyIncome * 0.4) / monthlyRate) *
          (1 - Math.pow(1 + monthlyRate, -numberOfPayments)) *
          (1 / (1 - downPaymentPercent / 100))
        : 0;

    // Break-even analysis
    let breakEvenYear = -1;
    let cumulativeBuyCost = downPayment + transactionCost;
    let cumulativeRentCost = 0;
    let cumulativeInvestment = downPayment + transactionCost;
    let currentYearRent = monthlyRent * 12;
    let currentPropertyValue = propertyPrice;

    const yearlyComparison: {
      year: number;
      buyCost: number;
      rentCost: number;
      propertyValue: number;
      investmentValue: number;
      buyNetPosition: number;
      rentNetPosition: number;
    }[] = [];

    for (let year = 1; year <= Math.min(analysisYears, 30); year++) {
      const yearMortgage = monthlyMortgage * 12;
      const yearMaintenance = annualMaintenance;
      const yearTax = annualPropertyTax;
      cumulativeBuyCost += yearMortgage + yearMaintenance + yearTax;

      currentPropertyValue *= 1 + propertyAppreciation / 100;
      cumulativeRentCost += currentYearRent;

      cumulativeInvestment *= 1 + investmentReturn / 100;
      if (monthlySavings > 0) {
        cumulativeInvestment += monthlySavings * 12 * (1 + investmentReturn / 100 / 2);
      }

      const paymentsCompleted = Math.min(year * 12, numberOfPayments);
      const remainingLoan =
        paymentsCompleted >= numberOfPayments
          ? 0
          : loanAmount * Math.pow(1 + monthlyRate, paymentsCompleted) -
            (monthlyMortgage * (Math.pow(1 + monthlyRate, paymentsCompleted) - 1)) / monthlyRate;

      const buyNet = currentPropertyValue - remainingLoan - cumulativeBuyCost;
      const rentNet = cumulativeInvestment - cumulativeRentCost;

      yearlyComparison.push({
        year,
        buyCost: cumulativeBuyCost,
        rentCost: cumulativeRentCost,
        propertyValue: currentPropertyValue,
        investmentValue: cumulativeInvestment,
        buyNetPosition: buyNet,
        rentNetPosition: rentNet,
      });

      if (buyNet > rentNet && breakEvenYear === -1) {
        breakEvenYear = year;
      }

      currentYearRent *= 1 + rentInflation / 100;
    }

    // Recommendation logic
    let recommendation: "buy" | "rent" | "consider";
    let recommendationReasonKey: string;
    let recommendationReasonParams: Record<string, string | number> = {};

    if (!isAffordable) {
      recommendation = "rent";
      recommendationReasonKey = "dtiExceeds";
      recommendationReasonParams = { ratio: formatPercent(debtToIncomeRatio) };
    } else if (priceToRentRatio > 25) {
      recommendation = "rent";
      recommendationReasonKey = "priceToRentHigh";
      recommendationReasonParams = { ratio: priceToRentRatio.toFixed(1) };
    } else if (buyVsRentDifference > 0 && breakEvenYear <= 7) {
      recommendation = "buy";
      recommendationReasonKey = "buyBetterShort";
      recommendationReasonParams = { amount: "__AMOUNT__", years: analysisYears, breakEven: breakEvenYear };
    } else if (buyVsRentDifference > 0) {
      recommendation = "consider";
      recommendationReasonKey = "buyBetterLong";
      recommendationReasonParams = { breakEven: breakEvenYear > 0 ? breakEvenYear : ">30" };
    } else {
      recommendation = "rent";
      recommendationReasonKey = "rentBetterBy";
      recommendationReasonParams = { amount: "__AMOUNT__", years: analysisYears };
    }

    return {
      downPayment,
      loanAmount,
      monthlyMortgage,
      totalMortgagePaid,
      totalInterestPaid,
      numberOfPayments,
      monthlyRate,
      transactionCost,
      totalMaintenanceCost,
      totalPropertyTax,
      totalBuyCost,
      futurePropertyValue,
      propertyGain,
      remainingLoanBalance,
      equityBuilt,
      netBuyPosition,
      monthlyBuyCost,
      totalRentCost,
      finalYearMonthlyRent,
      rentByYear,
      monthlySavings,
      downPaymentInvested,
      monthlySavingsInvested,
      totalInvestmentValue,
      investmentGain,
      netRentPosition,
      buyVsRentDifference,
      breakEvenYear,
      yearlyComparison,
      priceToRentRatio,
      grossRentalYield,
      debtToIncomeRatio,
      isAffordable,
      maxAffordablePrice,
      recommendation,
      recommendationReasonKey,
      recommendationReasonParams,
    };
  }, [
    propertyPrice,
    downPaymentPercent,
    loanTermYears,
    interestRate,
    monthlyRent,
    monthlyIncome,
    propertyAppreciation,
    rentInflation,
    investmentReturn,
    analysisYears,
  ]);

  return (
    <div className="container-app py-4 sm:py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        {tCommon("backToRanking")}
      </Link>

      {/* Page Header */}
      <header className="page-header mb-4 sm:mb-8">
        <div className="mb-2 sm:mb-4 flex items-center justify-center gap-2">
          <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
          <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-cyan-400">
            {t("badge")}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center">{t("title")}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground text-center mt-1 sm:mt-2">{t("subtitle")}</p>
      </header>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Input Panel */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-1">
          {/* Property Info */}
          <GlassCard className="p-4 sm:p-6">
            <h2 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              {t("buyInfo")}
            </h2>

            <div className="space-y-4 sm:space-y-5">
              <DualInput
                label={t("propertyPrice")}
                value={propertyPrice}
                onChange={setPropertyPrice}
                min={500_000_000}
                max={50_000_000_000}
                step={100_000_000}
                unit={tUnits("dong")}
                format={formatCurrency}
                accentColor="cyan"
                helpText={t("propertyPriceHelp")}
              />

              <DualInput
                label={`${t("downPayment")} (${downPaymentPercent}%)`}
                value={downPaymentPercent}
                onChange={setDownPaymentPercent}
                min={10}
                max={90}
                step={5}
                unit="%"
                format={(v) => `${v}% = ${formatCurrency(propertyPrice * v / 100)}`}
                accentColor="cyan"
                helpText={t("downPaymentHelp")}
              />

              <DualInput
                label={t("loanTerm")}
                value={loanTermYears}
                onChange={setLoanTermYears}
                min={5}
                max={35}
                step={1}
                unit={tUnits("years")}
                format={(v) => `${v}`}
                accentColor="cyan"
                helpText={t("loanTermHelp")}
              />

              <DualInput
                label={t("interestRate")}
                value={interestRate}
                onChange={setInterestRate}
                min={5}
                max={15}
                step={0.1}
                unit={`%${tUnits("perYear")}`}
                format={(v) => `${v.toFixed(1)}`}
                accentColor="cyan"
                helpText={t("interestRateHelp")}
              />

              <DualInput
                label={t("appreciation")}
                value={propertyAppreciation}
                onChange={setPropertyAppreciation}
                min={0}
                max={15}
                step={0.5}
                unit={`%${tUnits("perYear")}`}
                format={(v) => `${v.toFixed(1)}`}
                accentColor="cyan"
                helpText={t("appreciationHelp")}
              />
            </div>
          </GlassCard>

          {/* Rent Info */}
          <GlassCard className="p-4 sm:p-6">
            <h2 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              {t("rentInfo")}
            </h2>

            <div className="space-y-4 sm:space-y-5">
              <DualInput
                label={t("monthlyRent")}
                value={monthlyRent}
                onChange={setMonthlyRent}
                min={1_000_000}
                max={200_000_000}
                step={500_000}
                unit={tUnits("dong")}
                format={formatCurrency}
                accentColor="purple"
                helpText={t("monthlyRentHelp")}
              />

              <DualInput
                label={t("rentInflation")}
                value={rentInflation}
                onChange={setRentInflation}
                min={0}
                max={15}
                step={0.5}
                unit={`%${tUnits("perYear")}`}
                format={(v) => `${v.toFixed(1)}`}
                accentColor="purple"
                helpText={t("rentInflationHelp")}
              />
            </div>
          </GlassCard>

          {/* Investment */}
          <GlassCard className="p-4 sm:p-6">
            <h2 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
              <PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
              {t("altInvestment")}
            </h2>

            <div className="space-y-4 sm:space-y-5">
              <DualInput
                label={t("investmentReturn")}
                value={investmentReturn}
                onChange={setInvestmentReturn}
                min={0}
                max={20}
                step={0.5}
                unit={`%${tUnits("perYear")}`}
                format={(v) => `${v.toFixed(1)}`}
                accentColor="amber"
                helpText={t("investmentReturnHelp")}
              />
            </div>
          </GlassCard>

          {/* Income & Analysis Period */}
          <GlassCard className="p-4 sm:p-6">
            <h2 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
              {t("incomeTime")}
            </h2>

            <div className="space-y-4 sm:space-y-5">
              <DualInput
                label={t("monthlyIncome")}
                value={monthlyIncome}
                onChange={setMonthlyIncome}
                min={5_000_000}
                max={500_000_000}
                step={1_000_000}
                unit={tUnits("dong")}
                format={formatCurrency}
                accentColor="emerald"
                helpText={t("monthlyIncomeHelp")}
              />

              <DualInput
                label={t("analysisPeriod")}
                value={analysisYears}
                onChange={setAnalysisYears}
                min={5}
                max={30}
                step={1}
                unit={tUnits("years")}
                format={(v) => `${v}`}
                accentColor="emerald"
                helpText={t("analysisPeriodHelp")}
              />
            </div>
          </GlassCard>
        </div>

        {/* Results Panel */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          {/* Main Recommendation */}
          <GlassCard
            className={`p-4 sm:p-6 ${
              calculations.recommendation === "buy"
                ? "border-emerald-500/30 bg-emerald-500/5"
                : calculations.recommendation === "rent"
                  ? "border-purple-500/30 bg-purple-500/5"
                  : "border-amber-500/30 bg-amber-500/5"
            }`}
          >
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
              <div
                className={`mb-3 flex h-14 w-14 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl sm:mb-0 sm:mr-6 ${
                  calculations.recommendation === "buy"
                    ? "bg-emerald-500/20"
                    : calculations.recommendation === "rent"
                      ? "bg-purple-500/20"
                      : "bg-amber-500/20"
                }`}
              >
                {calculations.recommendation === "buy" ? (
                  <Home className="h-7 w-7 sm:h-10 sm:w-10 text-emerald-400" />
                ) : calculations.recommendation === "rent" ? (
                  <Building className="h-7 w-7 sm:h-10 sm:w-10 text-purple-400" />
                ) : (
                  <HelpCircle className="h-7 w-7 sm:h-10 sm:w-10 text-amber-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">
                  {t("recommendation", { years: analysisYears })}
                </p>
                <h3
                  className={`text-2xl sm:text-3xl font-bold ${
                    calculations.recommendation === "buy"
                      ? "text-emerald-400"
                      : calculations.recommendation === "rent"
                        ? "text-purple-400"
                        : "text-amber-400"
                  }`}
                >
                  {calculations.recommendation === "buy"
                    ? t("shouldBuy")
                    : calculations.recommendation === "rent"
                      ? t("shouldRent")
                      : t("consider")}
                </h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  {t(`reasons.${calculations.recommendationReasonKey}`, {
                    ...calculations.recommendationReasonParams,
                    amount: calculations.recommendationReasonParams.amount === "__AMOUNT__"
                      ? formatCurrency(Math.abs(calculations.buyVsRentDifference))
                      : calculations.recommendationReasonParams.amount
                  })}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            <GlassCard className="min-w-0 p-2.5 sm:p-4">
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{t("monthlyPayment")}</p>
              <p className="text-base sm:text-xl font-bold text-foreground mt-0.5">
                {formatCurrency(calculations.monthlyMortgage, true)}
              </p>
              <p
                className={`mt-1 text-[10px] sm:text-xs ${
                  calculations.debtToIncomeRatio <= 30
                    ? "text-emerald-400"
                    : calculations.debtToIncomeRatio <= 40
                      ? "text-amber-400"
                      : "text-red-400"
                }`}
              >
                {formatPercent(calculations.debtToIncomeRatio)} {t("incomeRatio")}
              </p>
            </GlassCard>

            <GlassCard className="min-w-0 p-2.5 sm:p-4">
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{t("priceToRent")}</p>
              <p
                className={`text-base sm:text-xl font-bold mt-0.5 ${
                  calculations.priceToRentRatio < 15
                    ? "text-emerald-400"
                    : calculations.priceToRentRatio < 20
                      ? "text-amber-400"
                      : "text-red-400"
                }`}
              >
                {calculations.priceToRentRatio.toFixed(1)}x
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">
                {calculations.priceToRentRatio < 15 ? t("shouldBuyLabel") : calculations.priceToRentRatio < 20 ? t("shouldConsider") : t("shouldRentLabel")}
              </p>
            </GlassCard>

            <GlassCard className="min-w-0 p-2.5 sm:p-4">
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{t("breakEven")}</p>
              <p className="text-base sm:text-xl font-bold text-foreground mt-0.5">
                {calculations.breakEvenYear > 0 ? `${calculations.breakEvenYear} ${tUnits("years")}` : ">30"}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">{t("buyBetter")}</p>
            </GlassCard>

            <GlassCard className="min-w-0 p-2.5 sm:p-4">
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{t("after", { years: analysisYears })}</p>
              <p
                className={`text-base sm:text-xl font-bold mt-0.5 ${
                  calculations.buyVsRentDifference > 0 ? "text-emerald-400" : "text-purple-400"
                }`}
              >
                {calculations.buyVsRentDifference > 0 ? "+" : ""}
                {formatCurrency(calculations.buyVsRentDifference, true)}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">
                {calculations.buyVsRentDifference > 0 ? t("buyBetter") : t("rentBetter")}
              </p>
            </GlassCard>
          </div>

          {/* Affordability Warning */}
          {!calculations.isAffordable && (
            <GlassCard className="border-red-500/30 bg-red-500/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                <div>
                  <p className="font-medium text-red-400">{t("exceedsAffordability")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("exceedsAffordabilityDesc", { ratio: formatPercent(calculations.debtToIncomeRatio) })}{" "}
                    <strong className="text-foreground">
                      {formatCurrency(calculations.maxAffordablePrice)}
                    </strong>
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Detailed Comparison */}
          <GlassCard className="p-4 sm:p-6">
            <h2 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              {t("comparison", { years: analysisYears })}
            </h2>

            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              {/* Buy Column */}
              <div className="rounded-xl bg-emerald-500/5 p-3 sm:p-4">
                <div className="mb-3 sm:mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Home className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                    <h3 className="text-sm sm:text-base font-bold text-emerald-400">{t("buyHouse")}</h3>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{t("costOut")}</span>
                </div>
                <dl className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t("downPaymentLabel")}</dt>
                    <dd className="font-medium text-foreground">
                      -{formatCurrency(calculations.downPayment, true)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t("transactionFee")}</dt>
                    <dd className="font-medium text-foreground">
                      -{formatCurrency(calculations.transactionCost, true)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {t("totalMortgage", { years: Math.min(analysisYears, loanTermYears) })}
                    </dt>
                    <dd className="font-medium text-foreground">
                      -{formatCurrency(calculations.monthlyMortgage * Math.min(analysisYears, loanTermYears) * 12, true)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-xs">
                    <dt className="text-muted-foreground/70 pl-4">{t("ofWhichInterest")}</dt>
                    <dd className="text-red-400/70">
                      ({formatCurrency(calculations.totalInterestPaid * Math.min(analysisYears, loanTermYears) / loanTermYears, true)})
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t("maintenance")}</dt>
                    <dd className="font-medium text-foreground">
                      -{formatCurrency(calculations.totalMaintenanceCost, true)}
                    </dd>
                  </div>
                  <div className="border-t border-white/10 pt-2">
                    <div className="flex justify-between font-medium">
                      <dt className="text-foreground">{t("totalCost")}</dt>
                      <dd className="text-red-400">-{formatCurrency(calculations.totalBuyCost, true)}</dd>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="mb-2 text-xs text-muted-foreground">{t("valueReceived")}</p>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{t("propertyValueAfter", { years: analysisYears })}</dt>
                      <dd className="font-medium text-emerald-400">
                        +{formatCurrency(calculations.futurePropertyValue, true)}
                      </dd>
                    </div>
                    <div className="flex justify-between text-xs">
                      <dt className="text-muted-foreground/70 pl-4">{t("appreciation2")}</dt>
                      <dd className="text-emerald-400/70">
                        (+{formatCurrency(calculations.propertyGain, true)})
                      </dd>
                    </div>
                    {calculations.remainingLoanBalance > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">{t("remainingDebt")}</dt>
                        <dd className="font-medium text-red-400">
                          -{formatCurrency(calculations.remainingLoanBalance, true)}
                        </dd>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-emerald-500/30 pt-2">
                    <div className="flex justify-between">
                      <dt className="font-bold text-emerald-400">{t("netPosition")}</dt>
                      <dd className="font-bold text-emerald-400">
                        {formatCurrency(calculations.netBuyPosition, true)}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>

              {/* Rent Column */}
              <div className="rounded-xl bg-purple-500/5 p-3 sm:p-4">
                <div className="mb-3 sm:mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Building className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    <h3 className="text-sm sm:text-base font-bold text-purple-400">{t("rentInvest")}</h3>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{t("costOut")}</span>
                </div>
                <dl className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t("firstMonthRent")}</dt>
                    <dd className="font-medium text-foreground">{formatCurrency(monthlyRent, true)}{tUnits("perMonth")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t("lastYearRent")}</dt>
                    <dd className="font-medium text-foreground">
                      {formatCurrency(calculations.finalYearMonthlyRent, true)}{tUnits("perMonth")}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t("totalRent", { years: analysisYears })}</dt>
                    <dd className="font-medium text-red-400">
                      -{formatCurrency(calculations.totalRentCost, true)}
                    </dd>
                  </div>
                  <div className="border-t border-white/10 pt-2">
                    <div className="flex justify-between font-medium">
                      <dt className="text-foreground">{t("totalCost")}</dt>
                      <dd className="text-red-400">-{formatCurrency(calculations.totalRentCost, true)}</dd>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="mb-2 text-xs text-muted-foreground">
                      {t("investmentAlternative", { rate: investmentReturn })}
                    </p>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{t("investmentCapital")}</dt>
                      <dd className="font-medium text-foreground">
                        {formatCurrency(calculations.downPayment + calculations.transactionCost, true)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{t("valueAfterYears", { years: analysisYears })}</dt>
                      <dd className="font-medium text-amber-400">
                        +{formatCurrency(calculations.downPaymentInvested, true)}
                      </dd>
                    </div>
                    {calculations.monthlySavings > 0 && (
                      <>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">{t("additionalSavings")}</dt>
                          <dd className="font-medium text-foreground">
                            {formatCurrency(calculations.monthlySavings, true)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">{t("additionalAccumulated")}</dt>
                          <dd className="font-medium text-amber-400">
                            +{formatCurrency(calculations.monthlySavingsInvested, true)}
                          </dd>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="border-t border-purple-500/30 pt-2">
                    <div className="flex justify-between">
                      <dt className="font-bold text-purple-400">{t("netPosition")}</dt>
                      <dd className="font-bold text-purple-400">
                        {formatCurrency(calculations.netRentPosition, true)}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>

            {/* Difference summary */}
            <div className="mt-3 sm:mt-4 rounded-lg bg-white/5 p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">{t("netPositionDiff", { years: analysisYears })}</p>
              <p
                className={`text-lg sm:text-2xl font-bold ${
                  calculations.buyVsRentDifference > 0 ? "text-emerald-400" : "text-purple-400"
                }`}
              >
                {calculations.buyVsRentDifference > 0 ? t("buyAdvantage") + " " : t("rentAdvantage") + " "}
                {formatCurrency(Math.abs(calculations.buyVsRentDifference))}
              </p>
            </div>
          </GlassCard>

          {/* Break-even Chart */}
          <GlassCard className="p-4 sm:p-6">
            <h2 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              {t("comparisonChart")}
            </h2>
            <BreakEvenChart
              data={calculations.yearlyComparison}
              breakEvenYear={calculations.breakEvenYear}
            />
          </GlassCard>

          {/* Calculation Details */}
          <GlassCard className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
              <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              {t("formulaDetails")}
            </h2>

            <Collapsible title={t("pmtFormula")}>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  {t("pmtDesc")}
                </p>
                <div className="rounded-lg bg-white/5 p-3 font-mono text-xs">
                  <p>PMT = P × [r(1+r)^n] / [(1+r)^n - 1]</p>
                  <p className="mt-2 text-muted-foreground">{t("where")}</p>
                  <p className="text-muted-foreground">P = {formatCurrency(calculations.loanAmount)} ({t("loanPrincipal")})</p>
                  <p className="text-muted-foreground">
                    r = {(interestRate / 12).toFixed(4)}% ({t("monthlyRateLabel")})
                  </p>
                  <p className="text-muted-foreground">
                    n = {calculations.numberOfPayments} ({t("paymentPeriods")})
                  </p>
                </div>
                <p className="font-medium text-foreground">
                  {t("result")} {formatCurrency(calculations.monthlyMortgage)}{tUnits("perMonth")}
                </p>
              </div>
            </Collapsible>

            <Collapsible title={t("priceToRentRatio")}>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  {t("priceToRentDesc")}
                </p>
                <div className="rounded-lg bg-white/5 p-3 font-mono text-xs">
                  <p>Ratio = {t("propertyPrice")} / {t("monthlyRent")} × 12</p>
                  <p className="mt-2 text-muted-foreground">
                    = {formatCurrency(propertyPrice)} / {formatCurrency(monthlyRent * 12)}
                  </p>
                </div>
                <p className="font-medium text-foreground">
                  {t("result")} {calculations.priceToRentRatio.toFixed(1)}x
                </p>
                <ul className="list-inside list-disc text-muted-foreground">
                  <li>&lt; 15: {t("shouldBuyLabel")}</li>
                  <li>15-20: {t("shouldConsider")}</li>
                  <li>&gt; 20: {t("shouldRentLabel")}</li>
                  <li>{t("atVN")}</li>
                </ul>
              </div>
            </Collapsible>

            <Collapsible title={t("futureValue")}>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  {t("futureValueDesc")}
                </p>
                <div className="rounded-lg bg-white/5 p-3 font-mono text-xs">
                  <p>FV = PV × (1 + g)^n</p>
                  <p className="mt-2 text-muted-foreground">{t("realEstate")}</p>
                  <p className="text-muted-foreground">
                    = {formatCurrency(propertyPrice)} × (1 + {propertyAppreciation}%)^{analysisYears}
                  </p>
                  <p className="text-muted-foreground">= {formatCurrency(calculations.futurePropertyValue)}</p>
                  <p className="mt-2 text-muted-foreground">{t("investmentAlt")}</p>
                  <p className="text-muted-foreground">
                    = {formatCurrency(calculations.downPayment)} × (1 + {investmentReturn}%)^{analysisYears}
                  </p>
                  <p className="text-muted-foreground">= {formatCurrency(calculations.downPaymentInvested)}</p>
                </div>
              </div>
            </Collapsible>

            <Collapsible title={t("breakEvenPoint")}>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  {t("breakEvenDesc")}
                </p>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-muted-foreground">
                    {t("breakEvenWhen")}
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    ({t("propertyValue")} - {t("remainingDebt")} - {t("totalCost")}) &gt; ({t("investmentValue")} - {t("totalRent", { years: "" })})
                  </p>
                </div>
                <p className="font-medium text-foreground">
                  {t("result")} {calculations.breakEvenYear > 0 ? `${calculations.breakEvenYear} ${tUnits("years")}` : t("noBreakEven")}
                </p>
                {calculations.breakEvenYear > 0 && (
                  <p className="text-muted-foreground">
                    {t("ifStayLess", { years: calculations.breakEvenYear })}
                  </p>
                )}
              </div>
            </Collapsible>

            <Collapsible title={t("dtiRatio")}>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  {t("dtiDesc")}
                </p>
                <div className="rounded-lg bg-white/5 p-3 font-mono text-xs">
                  <p>DTI = ({t("monthlyPayment")} / {t("monthlyIncome")}) × 100%</p>
                  <p className="mt-2 text-muted-foreground">
                    = ({formatCurrency(calculations.monthlyMortgage)} / {formatCurrency(monthlyIncome)}) ×
                    100%
                  </p>
                </div>
                <p
                  className={`font-medium ${
                    calculations.debtToIncomeRatio <= 30
                      ? "text-emerald-400"
                      : calculations.debtToIncomeRatio <= 40
                        ? "text-amber-400"
                        : "text-red-400"
                  }`}
                >
                  {t("result")} {formatPercent(calculations.debtToIncomeRatio)}
                </p>
                <ul className="list-inside list-disc text-muted-foreground">
                  <li>&lt; 30%: {t("safe")}</li>
                  <li>30-40%: {t("acceptable")}</li>
                  <li>&gt; 40%: {t("highRisk")}</li>
                </ul>
              </div>
            </Collapsible>
          </GlassCard>

          {/* Year by Year Table */}
          <Collapsible title={t("yearlyComparison", { years: analysisYears })} defaultOpen={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="whitespace-nowrap pb-2 pr-4 font-medium text-muted-foreground">{t("year")}</th>
                    <th className="whitespace-nowrap pb-2 pr-4 font-medium text-emerald-400">{t("propertyValue")}</th>
                    <th className="whitespace-nowrap pb-2 pr-4 font-medium text-emerald-400">{t("buyPosition")}</th>
                    <th className="whitespace-nowrap pb-2 pr-4 font-medium text-amber-400">{t("investmentValue")}</th>
                    <th className="whitespace-nowrap pb-2 pr-4 font-medium text-purple-400">{t("rentPosition")}</th>
                    <th className="whitespace-nowrap pb-2 font-medium text-foreground">{t("difference")}</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.yearlyComparison.map((year) => (
                    <tr key={year.year} className="border-b border-white/5">
                      <td className="whitespace-nowrap py-2 pr-4 text-foreground">{year.year}</td>
                      <td className="whitespace-nowrap py-2 pr-4 text-emerald-400/80">
                        {formatCurrency(year.propertyValue, true)}
                      </td>
                      <td className="whitespace-nowrap py-2 pr-4 text-emerald-400">
                        {formatCurrency(year.buyNetPosition, true)}
                      </td>
                      <td className="whitespace-nowrap py-2 pr-4 text-amber-400/80">
                        {formatCurrency(year.investmentValue, true)}
                      </td>
                      <td className="whitespace-nowrap py-2 pr-4 text-purple-400">
                        {formatCurrency(year.rentNetPosition, true)}
                      </td>
                      <td
                        className={`whitespace-nowrap py-2 font-medium ${
                          year.buyNetPosition > year.rentNetPosition ? "text-emerald-400" : "text-purple-400"
                        }`}
                      >
                        {year.buyNetPosition > year.rentNetPosition ? t("buyPlus") : t("rentPlus")}
                        {formatCurrency(Math.abs(year.buyNetPosition - year.rentNetPosition), true)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>

          {/* Disclaimer */}
          <GlassCard className="border-amber-500/20 p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              <strong className="text-amber-400">{t("disclaimer")}</strong> {t("disclaimerText")}
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
