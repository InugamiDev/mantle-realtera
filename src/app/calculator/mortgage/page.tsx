"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Home, Wallet, TrendingUp, Percent, Calculator, AlertTriangle, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";

export default function MortgageCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(50); // triệu VND
  const [otherIncome, setOtherIncome] = useState(0); // triệu VND
  const [monthlyExpenses, setMonthlyExpenses] = useState(15); // triệu VND
  const [existingDebt, setExistingDebt] = useState(0); // triệu VND/month
  const [downPayment, setDownPayment] = useState(30); // %
  const [interestRate, setInterestRate] = useState(9); // %
  const [loanTerm, setLoanTerm] = useState(20); // years

  // Calculations
  const calculations = useMemo(() => {
    const totalIncome = monthlyIncome + otherIncome;
    const availableForDebt = totalIncome - monthlyExpenses - existingDebt;

    // Banks typically allow 40-50% of income for debt service
    const maxDebtService = totalIncome * 0.45;
    const maxMortgagePayment = Math.max(0, maxDebtService - existingDebt);

    // Calculate max loan amount based on payment
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    // PMT formula reversed to get PV (loan amount)
    let maxLoanAmount = 0;
    if (monthlyRate > 0) {
      maxLoanAmount = maxMortgagePayment *
        ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
    } else {
      maxLoanAmount = maxMortgagePayment * numPayments;
    }

    // Max property price
    const maxPropertyPrice = maxLoanAmount / (1 - downPayment / 100);
    const requiredDownPayment = maxPropertyPrice * (downPayment / 100);

    // Monthly payment for max loan
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = maxLoanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = maxLoanAmount / numPayments;
    }

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - maxLoanAmount;

    // Debt-to-income ratio
    const dti = ((monthlyPayment + existingDebt) / totalIncome) * 100;

    // Risk assessment
    let riskLevel: "low" | "medium" | "high" = "low";
    if (dti > 50) riskLevel = "high";
    else if (dti > 40) riskLevel = "medium";

    return {
      totalIncome,
      availableForDebt: Math.round(availableForDebt),
      maxMortgagePayment: Math.round(maxMortgagePayment),
      maxLoanAmount: Math.round(maxLoanAmount),
      maxPropertyPrice: Math.round(maxPropertyPrice),
      requiredDownPayment: Math.round(requiredDownPayment),
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      dti: Math.round(dti * 10) / 10,
      riskLevel,
    };
  }, [monthlyIncome, otherIncome, monthlyExpenses, existingDebt, downPayment, interestRate, loanTerm]);

  const formatNumber = (num: number) => num.toLocaleString("vi-VN");

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-emerald-400";
      case "medium": return "text-amber-400";
      case "high": return "text-red-400";
      default: return "text-foreground";
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case "low": return "bg-emerald-500/10";
      case "medium": return "bg-amber-500/10";
      case "high": return "bg-red-500/10";
      default: return "bg-white/5";
    }
  };

  return (
    <div className="container-app py-4 sm:py-8">
      {/* Back link */}
      <Link
        href="/calculator"
        className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Quay lại Công cụ
      </Link>

      {/* Header */}
      <header className="mb-4 sm:mb-8 text-center">
        <div className="mb-2 sm:mb-4 flex items-center justify-center gap-2">
          <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
          <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-blue-400">
            Công cụ tính toán
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Khả năng Vay Mua Nhà</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
          Tính toán khoản vay phù hợp với thu nhập của bạn
        </p>
      </header>

      <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <GlassCard className="p-4 sm:p-5">
          <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-foreground">Thu nhập & Chi phí</h2>

          <div className="space-y-4 sm:space-y-5">
            {/* Monthly Income */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                  Thu nhập hàng tháng
                </span>
                <span className="text-emerald-400">{formatNumber(monthlyIncome)} tr</span>
              </label>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* Other Income */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span>Thu nhập khác</span>
                <span className="text-blue-400">{formatNumber(otherIncome)} tr</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={otherIncome}
                onChange={(e) => setOtherIncome(Number(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* Monthly Expenses */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span>Chi phí sinh hoạt/tháng</span>
                <span className="text-orange-400">{formatNumber(monthlyExpenses)} tr</span>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* Existing Debt */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span>Nợ hiện tại/tháng</span>
                <span className="text-red-400">{formatNumber(existingDebt)} tr</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={existingDebt}
                onChange={(e) => setExistingDebt(Number(e.target.value))}
                className="slider w-full"
              />
            </div>
          </div>

          <h2 className="mb-4 sm:mb-6 mt-6 sm:mt-8 text-base sm:text-lg font-semibold text-foreground">Điều kiện vay</h2>

          <div className="space-y-4 sm:space-y-5">
            {/* Down Payment */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span>Tỷ lệ trả trước</span>
                <span className="text-amber-400">{downPayment}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span>Lãi suất/năm</span>
                <span className="text-purple-400">{interestRate}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* Loan Term */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span>Thời hạn vay</span>
                <span className="text-blue-400">{loanTerm} năm</span>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="slider w-full"
              />
            </div>
          </div>
        </GlassCard>

        {/* Results Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Main Result */}
          <GlassCard className="p-4 sm:p-5">
            <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-foreground">Kết quả</h2>

            <div className="mb-3 sm:mb-6 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-3 sm:p-6">
              <div className="text-[10px] sm:text-sm text-amber-300">Giá nhà tối đa bạn có thể mua</div>
              <div className="mt-1 sm:mt-2 text-xl sm:text-4xl font-bold text-amber-400">
                {formatNumber(calculations.maxPropertyPrice)} tr
              </div>
              <div className="mt-1 sm:mt-2 text-[10px] sm:text-sm text-muted-foreground">
                ≈ {(calculations.maxPropertyPrice / 1000).toFixed(1)} tỷ VND
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="rounded-xl bg-white/5 p-2.5 sm:p-4">
                <div className="text-[10px] sm:text-sm text-muted-foreground">Số tiền vay</div>
                <div className="mt-0.5 sm:mt-1 text-base sm:text-xl font-bold text-foreground">
                  {formatNumber(calculations.maxLoanAmount)} tr
                </div>
              </div>
              <div className="rounded-xl bg-white/5 p-2.5 sm:p-4">
                <div className="text-[10px] sm:text-sm text-muted-foreground">Trả trước</div>
                <div className="mt-0.5 sm:mt-1 text-base sm:text-xl font-bold text-amber-400">
                  {formatNumber(calculations.requiredDownPayment)} tr
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Monthly Payment */}
          <GlassCard className="p-4 sm:p-5">
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-medium text-muted-foreground">Thanh toán hàng tháng</h3>

            <div className="mb-3 sm:mb-4 rounded-xl bg-blue-500/10 p-3 sm:p-4">
              <div className="text-[10px] sm:text-sm text-blue-300">Trả góp hàng tháng</div>
              <div className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-bold text-blue-400">
                {formatNumber(calculations.monthlyPayment)} tr
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng trả cả kỳ</span>
                <span className="text-foreground">{formatNumber(calculations.totalPayment)} tr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng lãi phải trả</span>
                <span className="text-red-400">{formatNumber(calculations.totalInterest)} tr</span>
              </div>
            </div>
          </GlassCard>

          {/* Risk Assessment */}
          <GlassCard className="p-4 sm:p-5">
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-medium text-muted-foreground">Đánh giá rủi ro</h3>

            <div className={`mb-3 sm:mb-4 flex items-center gap-2.5 sm:gap-3 rounded-xl p-3 sm:p-4 ${getRiskBg(calculations.riskLevel)}`}>
              {calculations.riskLevel === "low" ? (
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className={`h-5 w-5 sm:h-6 sm:w-6 shrink-0 ${getRiskColor(calculations.riskLevel)}`} />
              )}
              <div>
                <div className={`text-sm sm:text-base font-semibold ${getRiskColor(calculations.riskLevel)}`}>
                  {calculations.riskLevel === "low" && "Rủi ro thấp"}
                  {calculations.riskLevel === "medium" && "Rủi ro trung bình"}
                  {calculations.riskLevel === "high" && "Rủi ro cao"}
                </div>
                <div className="text-[10px] sm:text-sm text-muted-foreground">
                  Nợ/thu nhập: {calculations.dti}%
                </div>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng thu nhập</span>
                <span className="text-emerald-400">{formatNumber(calculations.totalIncome)} tr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Khả năng trả nợ</span>
                <span className="text-foreground">{formatNumber(calculations.maxMortgagePayment)} tr</span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 rounded-lg bg-white/5 p-2 sm:p-3 text-[10px] sm:text-xs text-muted-foreground">
              * Ngân hàng cho phép tỷ lệ nợ/thu nhập tối đa 40-50%
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Other Calculators */}
      <div className="mt-6 sm:mt-12">
        <h2 className="mb-3 sm:mb-6 text-sm sm:text-lg font-semibold text-foreground">Công cụ khác</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
          <Link href="/calculator" className="glass-card glass-hover p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 sm:block">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 shrink-0 sm:mb-2" />
            <div className="min-w-0">
              <div className="font-medium text-foreground text-xs sm:text-base">Thuê hay Mua?</div>
              <div className="text-[10px] sm:text-sm text-muted-foreground hidden sm:block">So sánh chi phí thuê và mua</div>
            </div>
          </Link>
          <Link href="/calculator/rental-yield" className="glass-card glass-hover p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 sm:block">
            <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 shrink-0 sm:mb-2" />
            <div className="min-w-0">
              <div className="font-medium text-foreground text-xs sm:text-base">Lợi suất Cho thuê</div>
              <div className="text-[10px] sm:text-sm text-muted-foreground hidden sm:block">Tính lợi suất thực tế</div>
            </div>
          </Link>
          <Link href="/calculator/investment" className="glass-card glass-hover p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 sm:block">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 shrink-0 sm:mb-2" />
            <div className="min-w-0">
              <div className="font-medium text-foreground text-xs sm:text-base">Mô phỏng Đầu tư</div>
              <div className="text-[10px] sm:text-sm text-muted-foreground hidden sm:block">Dự báo lợi nhuận đầu tư</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
