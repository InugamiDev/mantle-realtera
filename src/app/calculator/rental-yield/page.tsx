"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Percent, Home, TrendingUp, Calculator } from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";

export default function RentalYieldCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(3000); // triệu VND
  const [monthlyRent, setMonthlyRent] = useState(15); // triệu VND
  const [maintenanceCost, setMaintenanceCost] = useState(5); // % of rent
  const [vacancyRate, setVacancyRate] = useState(5); // %
  const [managementFee, setManagementFee] = useState(8); // % of rent

  // Calculations
  const annualRent = monthlyRent * 12;
  const effectiveRent = annualRent * (1 - vacancyRate / 100);
  const totalExpenses = effectiveRent * ((maintenanceCost + managementFee) / 100);
  const netRentalIncome = effectiveRent - totalExpenses;
  const grossYield = (annualRent / propertyPrice) * 100;
  const netYield = (netRentalIncome / propertyPrice) * 100;

  const formatNumber = (num: number) => num.toLocaleString("vi-VN");

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
          <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-amber-400">
            Công cụ tính toán
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Tính Lợi suất Cho thuê</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
          Tính toán lợi suất cho thuê thực tế sau khi trừ các chi phí
        </p>
      </header>

      <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <GlassCard className="p-4 sm:p-5">
          <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-foreground">Thông số đầu vào</h2>

          <div className="space-y-4 sm:space-y-6">
            {/* Property Price */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
                  Giá bất động sản
                </span>
                <span className="text-amber-400">{formatNumber(propertyPrice)} tr</span>
              </label>
              <input
                type="range"
                min="500"
                max="20000"
                step="100"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="slider w-full"
              />
              <div className="mt-1 flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                <span>500tr</span>
                <span>20 tỷ</span>
              </div>
            </div>

            {/* Monthly Rent */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                  Tiền thuê/tháng
                </span>
                <span className="text-emerald-400">{formatNumber(monthlyRent)} tr</span>
              </label>
              <input
                type="range"
                min="5"
                max="200"
                step="1"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="slider w-full"
              />
              <div className="mt-1 flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                <span>5tr</span>
                <span>200tr</span>
              </div>
            </div>

            {/* Vacancy Rate */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span>Tỷ lệ trống phòng</span>
                <span className="text-red-400">{vacancyRate}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={vacancyRate}
                onChange={(e) => setVacancyRate(Number(e.target.value))}
                className="slider w-full"
              />
              <div className="mt-1 flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                <span>0%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Maintenance Cost */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span>Chi phí bảo trì</span>
                <span className="text-orange-400">{maintenanceCost}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={maintenanceCost}
                onChange={(e) => setMaintenanceCost(Number(e.target.value))}
                className="slider w-full"
              />
              <div className="mt-1 flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                <span>0%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Management Fee */}
            <div>
              <label className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm font-medium text-foreground">
                <span>Phí quản lý</span>
                <span className="text-blue-400">{managementFee}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={managementFee}
                onChange={(e) => setManagementFee(Number(e.target.value))}
                className="slider w-full"
              />
              <div className="mt-1 flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                <span>0%</span>
                <span>15%</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Results Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Main Results */}
          <GlassCard className="p-4 sm:p-5">
            <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-foreground">Kết quả</h2>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="rounded-xl bg-emerald-500/10 p-2.5 sm:p-4">
                <div className="text-[10px] sm:text-sm text-emerald-300">Lợi suất gộp</div>
                <div className="mt-0.5 sm:mt-1 text-xl sm:text-3xl font-bold text-emerald-400">
                  {grossYield.toFixed(2)}%
                </div>
              </div>

              <div className="rounded-xl bg-amber-500/10 p-2.5 sm:p-4">
                <div className="text-[10px] sm:text-sm text-amber-300">Lợi suất ròng</div>
                <div className="mt-0.5 sm:mt-1 text-xl sm:text-3xl font-bold text-amber-400">
                  {netYield.toFixed(2)}%
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Breakdown */}
          <GlassCard className="p-4 sm:p-5">
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-medium text-muted-foreground">Chi tiết</h3>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Thu nhập thuê/năm</span>
                <span className="text-foreground">{formatNumber(annualRent)} tr</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Sau trừ trống phòng</span>
                <span className="text-foreground">{formatNumber(Math.round(effectiveRent))} tr</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Tổng chi phí</span>
                <span className="text-red-400">-{formatNumber(Math.round(totalExpenses))} tr</span>
              </div>
              <div className="border-t border-white/10 pt-2 sm:pt-3">
                <div className="flex justify-between text-sm sm:text-base font-semibold">
                  <span className="text-foreground">Thu nhập ròng/năm</span>
                  <span className="text-emerald-400">{formatNumber(Math.round(netRentalIncome))} tr</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Comparison */}
          <GlassCard className="p-4 sm:p-5">
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-medium text-muted-foreground">So sánh</h3>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Tiết kiệm (6%)</span>
                <span className={`text-xs sm:text-sm font-medium ${netYield > 6 ? "text-emerald-400" : "text-red-400"}`}>
                  {netYield > 6 ? "+" : ""}{(netYield - 6).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Trái phiếu (8%)</span>
                <span className={`text-xs sm:text-sm font-medium ${netYield > 8 ? "text-emerald-400" : "text-red-400"}`}>
                  {netYield > 8 ? "+" : ""}{(netYield - 8).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">TB thị trường (5%)</span>
                <span className={`text-xs sm:text-sm font-medium ${netYield > 5 ? "text-emerald-400" : "text-red-400"}`}>
                  {netYield > 5 ? "+" : ""}{(netYield - 5).toFixed(1)}%
                </span>
              </div>
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
          <Link href="/calculator/investment" className="glass-card glass-hover p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 sm:block">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 shrink-0 sm:mb-2" />
            <div className="min-w-0">
              <div className="font-medium text-foreground text-xs sm:text-base">Mô phỏng Đầu tư</div>
              <div className="text-[10px] sm:text-sm text-muted-foreground hidden sm:block">Dự báo lợi nhuận đầu tư</div>
            </div>
          </Link>
          <Link href="/calculator/mortgage" className="glass-card glass-hover p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 sm:block">
            <Home className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 shrink-0 sm:mb-2" />
            <div className="min-w-0">
              <div className="font-medium text-foreground text-xs sm:text-base">Khả năng Vay</div>
              <div className="text-[10px] sm:text-sm text-muted-foreground hidden sm:block">Tính toán khoản vay phù hợp</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
