"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Home, Percent, Calculator, DollarSign } from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";

export default function InvestmentSimulator() {
  const [initialInvestment, setInitialInvestment] = useState(3000); // triệu VND
  const [holdingPeriod, setHoldingPeriod] = useState(5); // years
  const [annualAppreciation, setAnnualAppreciation] = useState(8); // %
  const [rentalYield, setRentalYield] = useState(5); // %
  const [inflationRate, setInflationRate] = useState(4); // %
  const [sellingCosts, setSellingCosts] = useState(3); // %

  // Calculations
  const projections = useMemo(() => {
    const results = [];
    let cumulativeRent = 0;
    let currentValue = initialInvestment;

    for (let year = 1; year <= holdingPeriod; year++) {
      currentValue = currentValue * (1 + annualAppreciation / 100);
      const yearlyRent = initialInvestment * (rentalYield / 100);
      cumulativeRent += yearlyRent;

      const totalValue = currentValue + cumulativeRent;
      const sellingCost = currentValue * (sellingCosts / 100);
      const netValue = totalValue - sellingCost;
      const nominalGain = netValue - initialInvestment;
      const nominalROI = (nominalGain / initialInvestment) * 100;

      // Real return (adjusted for inflation)
      const inflationFactor = Math.pow(1 + inflationRate / 100, year);
      const realValue = netValue / inflationFactor;
      const realGain = realValue - initialInvestment;
      const realROI = (realGain / initialInvestment) * 100;

      results.push({
        year,
        propertyValue: Math.round(currentValue),
        cumulativeRent: Math.round(cumulativeRent),
        totalValue: Math.round(totalValue),
        netValue: Math.round(netValue),
        nominalGain: Math.round(nominalGain),
        nominalROI: Math.round(nominalROI * 10) / 10,
        realValue: Math.round(realValue),
        realGain: Math.round(realGain),
        realROI: Math.round(realROI * 10) / 10,
      });
    }

    return results;
  }, [initialInvestment, holdingPeriod, annualAppreciation, rentalYield, inflationRate, sellingCosts]);

  const finalResult = projections[projections.length - 1];
  const annualizedReturn = Math.pow(1 + finalResult.nominalROI / 100, 1 / holdingPeriod) - 1;

  const formatNumber = (num: number) => num.toLocaleString("vi-VN");

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/calculator"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Công cụ
      </Link>

      {/* Header */}
      <header className="page-header">
        <div className="mb-4 flex items-center justify-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-emerald-400">
            Công cụ tính toán
          </span>
        </div>
        <h1 className="page-title">Mô phỏng Đầu tư</h1>
        <p className="page-subtitle">
          Dự báo lợi nhuận đầu tư bất động sản theo thời gian
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Input Section */}
        <GlassCard className="lg:col-span-1">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Thông số</h2>

          <div className="space-y-5">
            {/* Initial Investment */}
            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-foreground">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-400" />
                  Vốn đầu tư
                </span>
                <span className="text-amber-400">{formatNumber(initialInvestment)} triệu</span>
              </label>
              <input
                type="range"
                min="500"
                max="20000"
                step="100"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* Holding Period */}
            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-foreground">
                <span>Thời gian nắm giữ</span>
                <span className="text-blue-400">{holdingPeriod} năm</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(Number(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* Annual Appreciation */}
            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-foreground">
                <span>Tăng giá hàng năm</span>
                <span className="text-emerald-400">{annualAppreciation}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={annualAppreciation}
                onChange={(e) => setAnnualAppreciation(Number(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* Rental Yield */}
            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-foreground">
                <span>Lợi suất cho thuê</span>
                <span className="text-purple-400">{rentalYield}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={rentalYield}
                onChange={(e) => setRentalYield(Number(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* Inflation Rate */}
            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-foreground">
                <span>Lạm phát</span>
                <span className="text-orange-400">{inflationRate}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* Selling Costs */}
            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-foreground">
                <span>Chi phí bán</span>
                <span className="text-red-400">{sellingCosts}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={sellingCosts}
                onChange={(e) => setSellingCosts(Number(e.target.value))}
                className="slider w-full"
              />
            </div>
          </div>
        </GlassCard>

        {/* Results Section */}
        <div className="space-y-6 lg:col-span-2">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <GlassCard className="p-4">
              <div className="text-xs text-muted-foreground">Giá trị cuối kỳ</div>
              <div className="mt-1 text-xl font-bold text-foreground">
                {formatNumber(finalResult.propertyValue)} tr
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="text-xs text-muted-foreground">Tổng tiền thuê</div>
              <div className="mt-1 text-xl font-bold text-purple-400">
                {formatNumber(finalResult.cumulativeRent)} tr
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="text-xs text-muted-foreground">Lợi nhuận danh nghĩa</div>
              <div className="mt-1 text-xl font-bold text-emerald-400">
                {formatNumber(finalResult.nominalGain)} tr
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="text-xs text-muted-foreground">ROI danh nghĩa</div>
              <div className="mt-1 text-xl font-bold text-amber-400">
                {finalResult.nominalROI}%
              </div>
            </GlassCard>
          </div>

          {/* Real Return */}
          <GlassCard>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Lợi nhuận thực (điều chỉnh lạm phát)</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-blue-500/10 p-4">
                <div className="text-sm text-blue-300">Giá trị thực</div>
                <div className="mt-1 text-2xl font-bold text-blue-400">
                  {formatNumber(finalResult.realValue)} tr
                </div>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-4">
                <div className="text-sm text-emerald-300">Lợi nhuận thực</div>
                <div className="mt-1 text-2xl font-bold text-emerald-400">
                  {formatNumber(finalResult.realGain)} tr
                </div>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-4">
                <div className="text-sm text-amber-300">ROI thực</div>
                <div className="mt-1 text-2xl font-bold text-amber-400">
                  {finalResult.realROI}%
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Year by Year Table */}
          <GlassCard>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Dự báo theo năm</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="py-2 font-medium text-muted-foreground">Năm</th>
                    <th className="py-2 font-medium text-muted-foreground">Giá trị BĐS</th>
                    <th className="py-2 font-medium text-muted-foreground">Tiền thuê</th>
                    <th className="py-2 font-medium text-muted-foreground">Tổng</th>
                    <th className="py-2 font-medium text-muted-foreground">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {projections.map((row) => (
                    <tr key={row.year} className="border-b border-white/5">
                      <td className="py-2 text-foreground">Năm {row.year}</td>
                      <td className="py-2 text-foreground">{formatNumber(row.propertyValue)} tr</td>
                      <td className="py-2 text-purple-400">{formatNumber(row.cumulativeRent)} tr</td>
                      <td className="py-2 text-foreground">{formatNumber(row.netValue)} tr</td>
                      <td className="py-2 text-emerald-400">{row.nominalROI}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Other Calculators */}
      <div className="mt-12">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Công cụ khác</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/calculator" className="glass-card glass-hover p-4">
            <Calculator className="mb-2 h-5 w-5 text-amber-400" />
            <div className="font-medium text-foreground">Thuê hay Mua?</div>
            <div className="text-sm text-muted-foreground">So sánh chi phí thuê và mua</div>
          </Link>
          <Link href="/calculator/rental-yield" className="glass-card glass-hover p-4">
            <Percent className="mb-2 h-5 w-5 text-purple-400" />
            <div className="font-medium text-foreground">Lợi suất Cho thuê</div>
            <div className="text-sm text-muted-foreground">Tính lợi suất thực tế</div>
          </Link>
          <Link href="/calculator/mortgage" className="glass-card glass-hover p-4">
            <Home className="mb-2 h-5 w-5 text-blue-400" />
            <div className="font-medium text-foreground">Khả năng Vay</div>
            <div className="text-sm text-muted-foreground">Tính toán khoản vay phù hợp</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
