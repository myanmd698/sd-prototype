/**
 * Combined trading prototype: ETF details, Self-Directed (account), Order entry, Stock selection carousel.
 * All four locally hosted projects in one file.
 */

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Screen } from "./Screen";
import {
  TopNavBar,
  PageTitleAccount,
  PerformanceGraph,
  Card,
  ListItem,
  SectionTitle,
  Button,
  Segment,
  Input,
  Select,
  Icon,
  toast,
  InlineText,
  Badge,
  HorizontalBarChart,
  BarChartDot,
} from "@qapital/qdl";
import type { BarChartColor, BarSegment, DateRangeValue } from "@qapital/qdl";
import { cn } from "../src/utils/cn";

// ---------------------------------------------------------------------------
// Shared data: chart data, position, securities list
// ---------------------------------------------------------------------------

const etfChartData = (() => {
  const points: number[] = [];
  let v = 418;
  for (let i = 0; i < 70; i++) {
    v = Math.max(395, Math.min(435, v + (Math.random() - 0.48) * 4 + 0.1));
    points.push(Math.round(v * 100) / 100);
  }
  return points;
})();

const positionByAccount = [
  { id: "taxable", label: "Taxable brokerage", shares: 5, avgCost: 412.2, marketValue: 2143.35, totalCost: 2061, gainLoss: 82.35, gainLossPercent: 4.0 },
  { id: "ira", label: "IRA", shares: 12, avgCost: 398.5, marketValue: 5144.04, totalCost: 4782, gainLoss: 362.04, gainLossPercent: 7.57 },
  { id: "roth", label: "Roth IRA", shares: 3, avgCost: 421.0, marketValue: 1286.01, totalCost: 1263, gainLoss: 23.01, gainLossPercent: 1.82 },
];

const performanceChartData = (() => {
  const points: number[] = [];
  let v = 118;
  for (let i = 0; i < 70; i++) {
    v = Math.max(102, Math.min(128, v + (Math.random() - 0.42) * 3 + 0.2));
    points.push(Math.round(v * 10) / 10);
  }
  return points;
})();

/** Mock stock price chart (same shape as etfChartData, for StockDetails) */
function stockChartData(seed = 100): number[] {
  const points: number[] = [];
  let v = seed;
  for (let i = 0; i < 70; i++) {
    v = Math.max(seed * 0.9, Math.min(seed * 1.15, v + (Math.random() - 0.48) * (seed * 0.02) + seed * 0.001));
    points.push(Math.round(v * 100) / 100);
  }
  return points;
}

// ---------------------------------------------------------------------------
// ETF Details
// ---------------------------------------------------------------------------

interface ETFDetailsLocationState {
  symbol?: string;
  name?: string;
  returnTo?: string;
}

export function ETFDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ETFDetailsLocationState) ?? {};
  const [dateRange, setDateRange] = useState<DateRangeValue>("1M");
  const [openSector, setOpenSector] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(positionByAccount[0].id);

  const etf = useMemo(
    () => ({
      symbol: "VOO",
      name: "Vanguard S&P 500 ETF",
      price: 428.67,
      changePercent: 0.82,
      changeAmount: 3.48,
      financials: {
        week52High: 432.18,
        week52Low: 368.42,
        dayHigh: 429.5,
        dayLow: 426.1,
        marketCap: "428B",
        peRatio: 24.2,
        expenseRatio: 0.03,
        dividendYield: 1.21,
      },
      description:
        "Vanguard S&P 500 ETF seeks to track the performance of the S&P 500 Index, representing 500 of the largest U.S. companies across all sectors.",
      tags: [
        { label: "Equity", category: "Asset class" },
        { label: "Large cap", category: "Size" },
        { label: "United States", category: "Location" },
        { label: "S&P 500", category: "Index" },
        { label: "Vanguard", category: "Provider" },
      ],
      sectorAllocation: [
        { sector: "Technology", weight: 28.4, color: "green" as BarChartColor, companies: [{ name: "Apple Inc.", symbol: "AAPL", weight: 7.02 }, { name: "Microsoft Corp.", symbol: "MSFT", weight: 6.48 }, { name: "NVIDIA Corp.", symbol: "NVDA", weight: 5.12 }, { name: "Broadcom Inc.", symbol: "AVGO", weight: 2.89 }, { name: "Oracle Corp.", symbol: "ORCL", weight: 1.95 }, { name: "Adobe Inc.", symbol: "ADBE", weight: 1.42 }, { name: "Salesforce Inc.", symbol: "CRM", weight: 1.38 }, { name: "Others", symbol: "", weight: 2.14 }] },
        { sector: "Healthcare", weight: 13.2, color: "purple" as BarChartColor, companies: [{ name: "UnitedHealth Group", symbol: "UNH", weight: 2.68 }, { name: "Johnson & Johnson", symbol: "JNJ", weight: 1.82 }, { name: "Eli Lilly and Co.", symbol: "LLY", weight: 1.75 }, { name: "Procter & Gamble", symbol: "PG", weight: 1.42 }, { name: "Merck & Co.", symbol: "MRK", weight: 1.38 }, { name: "Others", symbol: "", weight: 4.15 }] },
        { sector: "Financials", weight: 12.1, color: "golden" as BarChartColor, companies: [{ name: "Berkshire Hathaway", symbol: "BRK.B", weight: 1.84 }, { name: "JPMorgan Chase", symbol: "JPM", weight: 1.62 }, { name: "Visa Inc.", symbol: "V", weight: 1.48 }, { name: "Mastercard Inc.", symbol: "MA", weight: 1.12 }, { name: "Bank of America", symbol: "BAC", weight: 0.98 }, { name: "Others", symbol: "", weight: 5.06 }] },
        { sector: "Consumer discretionary", weight: 10.5, color: "citrus" as BarChartColor, companies: [{ name: "Amazon.com Inc.", symbol: "AMZN", weight: 3.65 }, { name: "Tesla Inc.", symbol: "TSLA", weight: 1.85 }, { name: "Home Depot", symbol: "HD", weight: 1.42 }, { name: "McDonald's Corp.", symbol: "MCD", weight: 0.92 }, { name: "Others", symbol: "", weight: 2.66 }] },
        { sector: "Communication services", weight: 8.8, color: "skyline" as BarChartColor, companies: [{ name: "Meta Platforms Inc.", symbol: "META", weight: 2.18 }, { name: "Alphabet Inc. Cl A", symbol: "GOOGL", weight: 1.78 }, { name: "Alphabet Inc. Cl C", symbol: "GOOG", weight: 1.62 }, { name: "Netflix Inc.", symbol: "NFLX", weight: 0.88 }, { name: "Others", symbol: "", weight: 2.34 }] },
        { sector: "Industrials", weight: 8.5, color: "peach" as BarChartColor, companies: [{ name: "Caterpillar Inc.", symbol: "CAT", weight: 1.12 }, { name: "Honeywell International", symbol: "HON", weight: 0.98 }, { name: "United Parcel Service", symbol: "UPS", weight: 0.85 }, { name: "Boeing Co.", symbol: "BA", weight: 0.62 }, { name: "Others", symbol: "", weight: 4.93 }] },
        { sector: "Consumer staples", weight: 6.2, color: "neutral" as BarChartColor, companies: [{ name: "Costco Wholesale", symbol: "COST", weight: 1.42 }, { name: "PepsiCo Inc.", symbol: "PEP", weight: 1.08 }, { name: "Coca-Cola Co.", symbol: "KO", weight: 0.95 }, { name: "Walmart Inc.", symbol: "WMT", weight: 0.88 }, { name: "Others", symbol: "", weight: 1.87 }] },
        { sector: "Energy", weight: 4.8, color: "red" as BarChartColor, companies: [{ name: "Exxon Mobil Corp.", symbol: "XOM", weight: 1.42 }, { name: "Chevron Corp.", symbol: "CVX", weight: 1.28 }, { name: "ConocoPhillips", symbol: "COP", weight: 0.52 }, { name: "Others", symbol: "", weight: 1.58 }] },
      ],
    }),
    []
  );

  const isPositive = etf.changePercent >= 0;
  const sectorBarSegments: BarSegment[] = useMemo(
    () => etf.sectorAllocation.map((s) => ({ id: s.sector, label: s.sector, value: s.weight, color: s.color })),
    [etf.sectorAllocation]
  );
  const selectedAccount = positionByAccount.find((a) => a.id === selectedAccountId) ?? positionByAccount[0];

  const handleTrade = () => {
    navigate("/order-entry", {
      state: { fromEtf: true, symbol: etf.symbol, name: etf.name, price: etf.price, accountId: selectedAccountId, accountLabel: selectedAccount.label },
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      <Screen className="pb-24">
        <TopNavBar variant="default" showStatusBar leftIcon="arrow-left" leftIconAriaLabel="Back" onLeftIconClick={() => (state.returnTo ? navigate(state.returnTo) : navigate(-1))} showTitle title="ETF details" />
        <div className="flex flex-col w-full px-4 pb-8">
          <PageTitleAccount
            title={etf.symbol}
            largeTitle={`$${etf.price.toFixed(2)}`}
            subtitle={etf.name}
            showSubtitle
            showInfoIcon
            changeLeadingIcon={isPositive ? "arrow-right-up" : "arrow-right-down"}
            changeText={`${isPositive ? "+" : ""}$${etf.changeAmount.toFixed(2)} (${isPositive ? "+" : ""}${etf.changePercent}%)`}
            changeSubtext=" today"
            showRightIcon={false}
          />
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full max-w-[361px]">
              <PerformanceGraph data={etfChartData} variant={isPositive ? "positive" : "negative"} dateRangeValue={dateRange} onDateRangeChange={setDateRange} className="w-full" aria-label="Price over time" />
            </div>
            <div className="w-full max-w-[361px] flex flex-col items-stretch">
              <SectionTitle title="Position" showTrailing={false} className="w-full" />
              <Card className="w-full flex flex-col gap-0 p-4 rounded-2xl">
                <ListItem title="Shares" trailingValue={selectedAccount.shares.toString()} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Average cost" trailingValue={`$${selectedAccount.avgCost.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Market value" trailingValue={`$${selectedAccount.marketValue.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Total cost" trailingValue={`$${selectedAccount.totalCost.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Gain / loss" trailingValue={`${selectedAccount.gainLoss >= 0 ? "+" : ""}$${selectedAccount.gainLoss.toFixed(2)} (${selectedAccount.gainLoss >= 0 ? "+" : ""}${selectedAccount.gainLossPercent}%)`} trailingValueEmphasis={selectedAccount.gainLoss >= 0 ? "primary" : "default"} showChevron={false} showDivider={false} />
              </Card>
            </div>
            <div className="w-full max-w-[361px] flex flex-col items-stretch">
              <SectionTitle title="What's in the fund" showTrailing={false} className="w-full" />
              <Card className="w-full flex flex-col gap-4 p-4 rounded-2xl overflow-hidden">
                <HorizontalBarChart segments={sectorBarSegments} barHeight={20} gap={4} label="Allocation by sector" className="w-full" />
                <div className="flex flex-col gap-0">
                  {etf.sectorAllocation.map((s, i) => {
                    const isOpen = openSector === s.sector;
                    return (
                      <div key={s.sector}>
                        <button type="button" className="w-full flex items-center gap-3 min-h-[56px] px-0 py-0 bg-transparent border-0 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-container)] rounded-[var(--radius-2xs)]" onClick={() => setOpenSector(isOpen ? null : s.sector)} aria-expanded={isOpen} aria-controls={`sector-${s.sector.replace(/\s+/g, "-")}`}>
                          <span className="shrink-0 flex justify-center items-center"><BarChartDot color={s.color} /></span>
                          <span className="flex-1 min-w-0 font-semibold truncate" style={{ fontFamily: "var(--font-family-text)", fontSize: "var(--font-size-body1)", lineHeight: "var(--line-height-body1)", color: "var(--text-base)" }}>{s.sector}</span>
                          <span className="shrink-0 font-semibold tabular-nums" style={{ fontFamily: "var(--font-family-text)", fontSize: "var(--font-size-body1)", lineHeight: "var(--line-height-body1)", color: "var(--text-base)" }}>{s.weight.toFixed(1)}%</span>
                          <span className="shrink-0 flex items-center justify-center w-10 h-10"><Icon name={isOpen ? "chevron-up" : "chevron-down"} size="md" color="var(--icon-base)" /></span>
                        </button>
                        {isOpen && (
                          <div id={`sector-${s.sector.replace(/\s+/g, "-")}`} className="pl-6 pb-2 flex flex-col gap-0 border-b border-[var(--border-base)]" style={{ marginLeft: "var(--spacing-2xs)" }}>
                            {s.companies.map((co, j) => (
                              <ListItem key={co.symbol || co.name} title={co.name} description={co.symbol || undefined} showDescription={!!co.symbol} trailingValue={`${co.weight.toFixed(2)}%`} trailingValueEmphasis="base" showChevron={false} showDivider={j < s.companies.length - 1} className="pl-0 min-h-[48px]" />
                            ))}
                          </div>
                        )}
                        {i < etf.sectorAllocation.length - 1 && !isOpen && <div className="border-b border-[var(--border-base)]" />}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
            <div className="w-full max-w-[361px] flex flex-col items-stretch">
              <SectionTitle title="About this ETF" showTrailing={false} className="w-full" />
              <Card className="w-full flex flex-col gap-4 p-4 rounded-2xl overflow-hidden">
                <InlineText showHeading={false} showSubheading={false} showParagraph={true} paragraph={etf.description} fullWidth noPadding className="pt-0" />
                <div className="flex flex-wrap gap-2">
                  {etf.tags.map((tag) => (
                    <Badge key={`${tag.category}-${tag.label}`} label={tag.label} appearance="grey" type="default" />
                  ))}
                </div>
              </Card>
            </div>
            <div className="w-full max-w-[361px] flex flex-col items-stretch">
              <SectionTitle title="Financials" showTrailing={false} className="w-full" />
              <Card className="w-full flex flex-col gap-0 p-4 rounded-2xl">
                <ListItem title="52-week high" trailingValue={`$${etf.financials.week52High.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="52-week low" trailingValue={`$${etf.financials.week52Low.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Day high" trailingValue={`$${etf.financials.dayHigh.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Day low" trailingValue={`$${etf.financials.dayLow.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Market cap" trailingValue={`$${etf.financials.marketCap}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="P/E ratio" trailingValue={etf.financials.peRatio.toFixed(1)} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Expense ratio" trailingValue={`${etf.financials.expenseRatio}%`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Dividend yield" trailingValue={`${etf.financials.dividendYield}%`} trailingValueEmphasis="base" showChevron={false} showDivider={false} />
              </Card>
            </div>
          </div>
        </div>
      </Screen>
      <div className="fixed bottom-0 left-0 right-0 z-20 w-full border-t border-[var(--border-base)]" style={{ backgroundColor: "var(--bg-container)", paddingBottom: "env(safe-area-inset-bottom)", paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}>
        <div className="w-full max-w-[393px] mx-auto px-4 py-4 flex flex-col gap-3">
          <Select label="Account" value={selectedAccountId} onValueChange={setSelectedAccountId} options={positionByAccount.map((a) => ({ value: a.id, label: a.label }))} placeholder="Choose account" fullWidth compact showBelow={false} className="w-full" />
          <Button variant="primary" size="lg" fullWidth onClick={handleTrade}>Trade</Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stock Details (single stock: same layout as ETF details, no holdings breakdown)
// ---------------------------------------------------------------------------

interface StockDetailsState {
  symbol?: string;
  name?: string;
  price?: number;
  changePercent?: number;
}

/** Mock position and financials for stock details (derived from price when not in state) */
function getStockDetailsData(symbol: string, name: string, price: number, changePercent: number) {
  const p = price || 100;
  const changeAmount = p * (changePercent / 100);
  const week52High = p * 1.08;
  const week52Low = p * 0.88;
  const dayHigh = p + Math.abs(changeAmount) * 0.6;
  const dayLow = p - Math.abs(changeAmount) * 0.4;
  return {
    price: p,
    changePercent,
    changeAmount,
    description: `${name} is a publicly traded company. This page shows key metrics and your position.`,
    tags: [
      { label: "Equity", category: "Asset class" },
      { label: "Common stock", category: "Type" },
      { label: "United States", category: "Location" },
    ],
    financials: {
      week52High,
      week52Low,
      dayHigh,
      dayLow,
      marketCap: "Large cap",
      peRatio: 28.5,
      dividendYield: 0.52,
    },
    position: {
      shares: 10,
      avgCost: p * 0.97,
      marketValue: 10 * p,
      totalCost: 10 * p * 0.97,
      gainLoss: 10 * changeAmount,
      gainLossPercent: changePercent,
    },
  };
}

export function StockDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as StockDetailsState) ?? {};
  const symbol = state.symbol ?? "—";
  const name = state.name ?? "—";
  const price = state.price ?? 0;
  const changePercent = state.changePercent ?? 0;
  const [dateRange, setDateRange] = useState<DateRangeValue>("1M");
  const [selectedAccountId, setSelectedAccountId] = useState<string>(positionByAccount[0].id);

  const stock = useMemo(
    () => getStockDetailsData(symbol, name, price, changePercent),
    [symbol, name, price, changePercent]
  );
  const chartData = useMemo(() => stockChartData(stock.price), [stock.price]);
  const isPositive = stock.changePercent >= 0;
  const pos = stock.position;

  const handleTrade = () => {
    navigate("/order-entry", { state: { fromEtf: false, symbol, name, price: stock.price } });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      <Screen className="pb-24">
        <TopNavBar variant="default" showStatusBar leftIcon="arrow-left" leftIconAriaLabel="Back" onLeftIconClick={() => navigate(-1)} showTitle title="Stock details" />
        <div className="flex flex-col w-full px-4 pb-8">
          <PageTitleAccount
            title={symbol}
            largeTitle={`$${stock.price.toFixed(2)}`}
            subtitle={name}
            showSubtitle
            showInfoIcon
            changeLeadingIcon={isPositive ? "arrow-right-up" : "arrow-right-down"}
            changeText={`${isPositive ? "+" : ""}$${stock.changeAmount.toFixed(2)} (${isPositive ? "+" : ""}${stock.changePercent}%)`}
            changeSubtext=" today"
            showRightIcon={false}
          />
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full max-w-[361px]">
              <PerformanceGraph data={chartData} variant={isPositive ? "positive" : "negative"} dateRangeValue={dateRange} onDateRangeChange={setDateRange} className="w-full" aria-label="Price over time" />
            </div>
            <div className="w-full max-w-[361px] flex flex-col items-stretch">
              <SectionTitle title="Position" showTrailing={false} className="w-full" />
              <Card className="w-full flex flex-col gap-0 p-4 rounded-2xl">
                <ListItem title="Shares" trailingValue={pos.shares.toString()} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Average cost" trailingValue={`$${pos.avgCost.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Market value" trailingValue={`$${pos.marketValue.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Total cost" trailingValue={`$${pos.totalCost.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Gain / loss" trailingValue={`${pos.gainLoss >= 0 ? "+" : ""}$${pos.gainLoss.toFixed(2)} (${pos.gainLoss >= 0 ? "+" : ""}${pos.gainLossPercent}%)`} trailingValueEmphasis={pos.gainLoss >= 0 ? "primary" : "default"} showChevron={false} showDivider={false} />
              </Card>
            </div>
            <div className="w-full max-w-[361px] flex flex-col items-stretch">
              <SectionTitle title="About this stock" showTrailing={false} className="w-full" />
              <Card className="w-full flex flex-col gap-4 p-4 rounded-2xl overflow-hidden">
                <InlineText showHeading={false} showSubheading={false} showParagraph={true} paragraph={stock.description} fullWidth noPadding className="pt-0" />
                <div className="flex flex-wrap gap-2">
                  {stock.tags.map((tag) => (
                    <Badge key={`${tag.category}-${tag.label}`} label={tag.label} appearance="grey" type="default" />
                  ))}
                </div>
              </Card>
            </div>
            <div className="w-full max-w-[361px] flex flex-col items-stretch">
              <SectionTitle title="Financials" showTrailing={false} className="w-full" />
              <Card className="w-full flex flex-col gap-0 p-4 rounded-2xl">
                <ListItem title="52-week high" trailingValue={`$${stock.financials.week52High.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="52-week low" trailingValue={`$${stock.financials.week52Low.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Day high" trailingValue={`$${stock.financials.dayHigh.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Day low" trailingValue={`$${stock.financials.dayLow.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Market cap" trailingValue={stock.financials.marketCap} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="P/E ratio" trailingValue={stock.financials.peRatio.toFixed(1)} trailingValueEmphasis="base" showChevron={false} showDivider />
                <ListItem title="Dividend yield" trailingValue={`${stock.financials.dividendYield}%`} trailingValueEmphasis="base" showChevron={false} showDivider={false} />
              </Card>
            </div>
          </div>
        </div>
      </Screen>
      <div className="fixed bottom-0 left-0 right-0 z-20 w-full border-t border-[var(--border-base)]" style={{ backgroundColor: "var(--bg-container)", paddingBottom: "env(safe-area-inset-bottom)", paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}>
        <div className="w-full max-w-[393px] mx-auto px-4 py-4 flex flex-col gap-3">
          <Select label="Account" value={selectedAccountId} onValueChange={setSelectedAccountId} options={positionByAccount.map((a) => ({ value: a.id, label: a.label }))} placeholder="Choose account" fullWidth compact showBelow={false} className="w-full" />
          <Button variant="primary" size="lg" fullWidth onClick={handleTrade}>Trade</Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Self-Directed Trading (account / stock overview)
// ---------------------------------------------------------------------------

export function SelfDirectedTrading() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRangeValue>("1M");
  const account = useMemo(
    () => ({
      value: 12450.0,
      buyingPower: 1250.0,
      changeAmount: 342.5,
      changePercent: 2.83,
      holdings: [
        { symbol: "AAPL", name: "Apple Inc.", value: 2222.4, changePercent: 2.4, isETF: false },
        { symbol: "VOO", name: "Vanguard S&P 500 ETF", value: 4286.7, changePercent: 0.82, isETF: true },
        { symbol: "MSFT", name: "Microsoft Corp.", value: 3156.0, changePercent: 1.92, isETF: false },
        { symbol: "GOOGL", name: "Alphabet Inc.", value: 2785.5, changePercent: -0.45, isETF: false },
      ],
      watchlist: [
        { symbol: "NVDA", name: "NVIDIA Corp.", price: 128.45, changePercent: 3.2 },
        { symbol: "AMZN", name: "Amazon.com Inc.", price: 185.32, changePercent: 0.95 },
        { symbol: "META", name: "Meta Platforms Inc.", price: 512.18, changePercent: -1.2 },
      ],
    }),
    []
  );
  const isPositive = account.changePercent >= 0;

  return (
    <Screen>
      <TopNavBar variant="default" showStatusBar leftIcon="arrow-left" leftIconAriaLabel="Back" onLeftIconClick={() => navigate(-1)} showTitle title="Self-Directed trading" />
      <div className="flex flex-col w-full px-4 pb-8">
        <PageTitleAccount title="Account value" largeTitle={`$${account.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} showSubtitle={false} showInfoIcon changeLeadingIcon={isPositive ? "arrow-right-up" : "arrow-right-down"} changeText={`${isPositive ? "+" : ""}$${account.changeAmount.toFixed(2)} (${isPositive ? "+" : ""}${account.changePercent}%)`} changeSubtext=" this month" showRightIcon={false} />
        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full max-w-[361px]">
            <PerformanceGraph data={performanceChartData} variant={isPositive ? "positive" : "negative"} dateRangeValue={dateRange} onDateRangeChange={setDateRange} className="w-full" aria-label="Account performance over time" />
          </div>
          <div className="w-full max-w-[361px] flex flex-col gap-3">
            <Button variant="secondary" size="md" className="w-full" onClick={() => navigate("/transfer", { state: { fromAccount: "self-directed" } })}>Deposit</Button>
            <Card className="w-full flex flex-col gap-0 p-4 rounded-2xl">
              <ListItem title="Buying power" trailingValue={`$${account.buyingPower.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} trailingValueEmphasis="base" showChevron={false} showDivider={false} />
            </Card>
          </div>
          <div className="w-full max-w-[361px] flex flex-col items-stretch">
            <SectionTitle title="Holdings" showTrailing={false} className="w-full" />
            <Button variant="primary" size="md" className="w-full" onClick={() => navigate("/stock-selection-carousel")}>Find securities</Button>
            <Card className="w-full flex flex-col gap-0 p-4 rounded-2xl overflow-hidden">
              {account.holdings.map((h, i) => (
                <ListItem key={h.symbol} title={h.symbol} description={h.name} showDescription trailingValue={`$${h.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} trailingValueEmphasis="base" trailingDescription={`${h.changePercent >= 0 ? "+" : ""}${h.changePercent}%`} showTrailingDescription showChevron showDivider={i < account.holdings.length - 1} onClick={() => (h.isETF ? navigate("/etf-details", { state: { returnTo: "/self-directed-trading" } }) : navigate("/stock-details", { state: { symbol: h.symbol, name: h.name, price: Math.round((h.value / 10) * 100) / 100, changePercent: h.changePercent } }))} />
              ))}
            </Card>
          </div>
          <div className="w-full max-w-[361px] flex flex-col items-stretch">
            <SectionTitle title="Watchlist" showTrailing={false} className="w-full" />
            <Card className="w-full flex flex-col gap-0 p-4 rounded-2xl overflow-hidden">
              {account.watchlist.map((w, i) => (
                <ListItem key={w.symbol} title={w.symbol} description={w.name} showDescription trailingValue={`$${w.price.toFixed(2)}`} trailingValueEmphasis="base" trailingDescription={`${w.changePercent >= 0 ? "+" : ""}${w.changePercent}%`} showTrailingDescription showChevron showDivider={i < account.watchlist.length - 1} onClick={() => {}} />
              ))}
            </Card>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ---------------------------------------------------------------------------
// Transfer (deposit to self-directed account)
// ---------------------------------------------------------------------------

const TRANSFER_TO_OPTIONS = [
  { value: "self-directed", label: "Self-Directed brokerage" },
  { value: "savings", label: "Savings goal" },
];
const TRANSFER_FROM_OPTIONS = [
  { value: "chase", label: "Chase ****1234" },
  { value: "bofa", label: "Bank of America ****5678" },
  { value: "wells", label: "Wells Fargo ****9012" },
];

export function Transfer() {
  const navigate = useNavigate();
  const [toAccount, setToAccount] = useState("self-directed");
  const [fromAccount, setFromAccount] = useState("chase");
  const [amount, setAmount] = useState("");

  const amountNum = amount ? parseFloat(amount.replace(/[^0-9.]/g, "")) : 0;
  const isValid = amountNum > 0;

  const handleDeposit = () => {
    if (!isValid) return;
    // Could show confirmation or toast, then navigate back
    navigate("/self-directed-trading");
  };

  return (
    <Screen>
      <TopNavBar variant="default" showStatusBar leftIcon="arrow-left" leftIconAriaLabel="Back" onLeftIconClick={() => navigate("/self-directed-trading")} showTitle title="Transfer" />
      <div className="flex flex-col w-full px-4 pb-8 gap-4">
        <p className="pt-4 pb-0" style={{ fontFamily: "var(--font-family-text)", fontSize: "var(--font-size-body2)", lineHeight: "var(--line-height-body2)", color: "var(--text-subtle)" }}>
          Move money into your Self-Directed account to fund trades.
        </p>
        <div className="w-full max-w-[361px] flex flex-col gap-4">
          <Select label="To" value={toAccount} onValueChange={setToAccount} options={TRANSFER_TO_OPTIONS} placeholder="Choose account" fullWidth compact showBelow={false} />
          <Select label="From" value={fromAccount} onValueChange={setFromAccount} options={TRANSFER_FROM_OPTIONS} placeholder="Choose account" fullWidth compact showBelow={false} />
          <Input label="Amount ($)" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} showBelow={false} />
          <div className="pt-2">
            <Button variant="primary" size="lg" fullWidth onClick={handleDeposit} disabled={!isValid}>Deposit</Button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ---------------------------------------------------------------------------
// Order Entry
// ---------------------------------------------------------------------------

type OrderStep = "list" | "order" | "review" | "confirmation";
type OrderSide = "buy" | "sell";
type OrderType = "market" | "limit";

interface FromEtfState {
  fromEtf?: boolean;
  symbol?: string;
  name?: string;
  price?: number;
  accountId?: string;
  accountLabel?: string;
}

interface Security {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

const SECURITIES: Security[] = [
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", price: 428.67, changePercent: 0.82 },
  { symbol: "AAPL", name: "Apple Inc.", price: 229.45, changePercent: -0.34 },
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", price: 585.12, changePercent: 0.56 },
];

export function OrderEntry() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromEtfState = (location.state as FromEtfState) ?? null;
  const fromEtf = Boolean(fromEtfState?.fromEtf && fromEtfState?.symbol && fromEtfState?.name != null && fromEtfState?.price != null);
  const hasPreselectedSecurity = Boolean(fromEtfState?.symbol && fromEtfState?.name != null && fromEtfState?.price != null);

  const [step, setStep] = useState<OrderStep>(() => (hasPreselectedSecurity ? "order" : "list"));
  const [selectedSecurity, setSelectedSecurity] = useState<Security | null>(() =>
    hasPreselectedSecurity && fromEtfState
      ? { symbol: fromEtfState.symbol, name: fromEtfState.name, price: fromEtfState.price, changePercent: 0 }
      : null
  );
  const [side, setSide] = useState<OrderSide>("buy");
  const [quantity, setQuantity] = useState("");
  const [amountDollars, setAmountDollars] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [limitPrice, setLimitPrice] = useState("");

  useEffect(() => {
    if (hasPreselectedSecurity && fromEtfState?.symbol && fromEtfState?.name != null && fromEtfState?.price != null) {
      setStep("order");
      setSelectedSecurity({ symbol: fromEtfState.symbol, name: fromEtfState.name, price: fromEtfState.price, changePercent: 0 });
      setAmountDollars("");
      setSide("buy");
    }
  }, [hasPreselectedSecurity, fromEtfState?.symbol, fromEtfState?.name, fromEtfState?.price]);

  const qtyNum = quantity ? parseFloat(quantity) : 0;
  const limitNum = limitPrice ? parseFloat(limitPrice) : 0;
  const amountNum = amountDollars ? parseFloat(amountDollars) : 0;
  const price = selectedSecurity?.price ?? 0;
  const estimatedTotal = orderType === "market" ? qtyNum * price : qtyNum * limitNum;
  const estimatedShares = price > 0 ? amountNum / price : 0;
  const isValidOrder = selectedSecurity && qtyNum > 0 && (orderType !== "limit" || limitNum > 0);
  const isValidEtfOrder = fromEtf && selectedSecurity && amountNum > 0;

  const handleBackFromOrder = () => {
    if (fromEtf) {
      navigate("/etf-details", { state: { returnTo: "/self-directed-trading" } });
      return;
    }
    if (hasPreselectedSecurity) {
      navigate(-1);
      return;
    }
    setStep("list");
    setSelectedSecurity(null);
  };

  const handleBackFromReview = () => setStep("order");
  const handleReview = () => {
    if (fromEtf ? !isValidEtfOrder : !isValidOrder) return;
    setStep("review");
  };

  const handlePlaceOrder = () => {
    if (fromEtf) {
      if (!isValidEtfOrder || !selectedSecurity) return;
      setStep("confirmation");
      return;
    }
    if (!isValidOrder || !selectedSecurity) return;
    toast.success(`${side === "buy" ? "Buy" : "Sell"} order placed: ${qtyNum} share${qtyNum !== 1 ? "s" : ""} of ${selectedSecurity.symbol}`);
    setStep("list");
    setSelectedSecurity(null);
    setQuantity("");
    setLimitPrice("");
  };

  const handleBackToEtfDetails = () => navigate("/etf-details", { state: { returnTo: "/self-directed-trading" } });

  return (
    <Screen>
      <TopNavBar
        variant="default"
        showStatusBar
        leftIcon={step !== "confirmation" ? "arrow-left" : undefined}
        leftIconAriaLabel="Back"
        onLeftIconClick={
          step === "list"
            ? () => navigate(-1)
            : step === "order"
              ? handleBackFromOrder
              : step === "review"
                ? handleBackFromReview
                : undefined
        }
        showTitle
        title={step === "confirmation" ? "Order placed" : step === "list" ? "Trade" : step === "order" ? "Order" : "Review order"}
      />
      <div className="flex flex-col w-full px-4 pb-8">
        {step === "list" && (
          <>
            <p className="mb-4" style={{ fontFamily: "var(--font-family-text)", fontSize: "var(--font-size-body2)", color: "var(--text-subtle)", marginTop: 8 }}>Select a security to place a trade.</p>
            <SectionTitle title="Securities" showTrailing={false} className="w-full" />
            <div className="flex flex-col gap-3 w-full max-w-[361px]">
              {SECURITIES.map((sec) => (
                <Card key={sec.symbol} className="w-full flex flex-col gap-0 p-4 rounded-2xl cursor-pointer transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2" onClick={() => navigate("/stock-details", { state: { symbol: sec.symbol, name: sec.name, price: sec.price, changePercent: sec.changePercent } })}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold" style={{ fontFamily: "var(--font-family-text)", fontSize: "var(--font-size-body1)", color: "var(--text-base)" }}>{sec.symbol}</div>
                      <div className="truncate max-w-[200px]" style={{ fontFamily: "var(--font-family-text)", fontSize: "var(--font-size-body2)", color: "var(--text-subtle)" }}>{sec.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums" style={{ fontFamily: "var(--font-family-text)", fontSize: "var(--font-size-body1)", color: "var(--text-base)" }}>${sec.price.toFixed(2)}</span>
                      <Icon name="chevron-right" size="md" color="var(--icon-base)" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {step === "order" && selectedSecurity && (
          <div className="flex flex-col gap-4 w-full max-w-[361px]">
            <Card className="w-full flex flex-col gap-0 p-4 rounded-2xl">
              <ListItem title={selectedSecurity.symbol} description={selectedSecurity.name} showDescription trailingValue={`$${selectedSecurity.price.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider={false} />
            </Card>
            <Segment options={[{ value: "buy", label: "Buy" }, { value: "sell", label: "Sell" }]} value={side} onValueChange={(v) => setSide(v as OrderSide)} fullWidth />
            {fromEtf ? (
              <Input label="Amount ($)" placeholder="0.00" value={amountDollars} onChange={(e) => setAmountDollars(e.target.value.replace(/[^0-9.]/g, ""))} showBelow={false} />
            ) : (
              <Input label="Quantity (shares)" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value.replace(/[^0-9.]/g, ""))} showBelow={false} />
            )}
            {!fromEtf && (
              <>
                <Select label="Order type" value={orderType} onValueChange={(v) => setOrderType(v as OrderType)} options={[{ value: "market", label: "Market" }, { value: "limit", label: "Limit" }]} placeholder="Order type" fullWidth compact showBelow={false} />
                {orderType === "limit" && <Input label="Limit price ($)" placeholder="0.00" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value.replace(/[^0-9.]/g, ""))} showBelow={false} />}
              </>
            )}
            <div className="pt-2">
              <Button variant="primary" size="lg" fullWidth onClick={handleReview} disabled={fromEtf ? !amountDollars || amountNum <= 0 : !quantity || qtyNum <= 0 || (orderType === "limit" && (!limitPrice || limitNum <= 0))}>Review order</Button>
            </div>
          </div>
        )}

        {step === "review" && selectedSecurity && (
          <div className="flex flex-col gap-4 w-full max-w-[361px]">
            <SectionTitle title="Order summary" showTrailing={false} className="w-full" />
            <Card className="w-full flex flex-col gap-0 p-4 rounded-2xl">
              {fromEtf && fromEtfState?.accountLabel && <ListItem title="Account" trailingValue={fromEtfState.accountLabel} trailingValueEmphasis="base" showChevron={false} showDivider />}
              <ListItem title="Security" trailingValue={selectedSecurity.symbol} trailingValueEmphasis="base" showChevron={false} showDivider />
              <ListItem title="Side" trailingValue={side === "buy" ? "Buy" : "Sell"} trailingValueEmphasis="base" showChevron={false} showDivider />
              {fromEtf ? (
                <>
                  <ListItem title="Amount" trailingValue={`$${amountNum.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                  <ListItem title="Estimated shares" trailingValue={estimatedShares > 0 ? estimatedShares.toFixed(4) : "—"} trailingValueEmphasis="base" showChevron={false} showDivider />
                  <ListItem title="Total" trailingValue={`$${amountNum.toFixed(2)}`} trailingValueEmphasis="primary" showChevron={false} showDivider={false} />
                </>
              ) : (
                <>
                  <ListItem title="Quantity" trailingValue={quantity} trailingValueEmphasis="base" showChevron={false} showDivider />
                  <ListItem title="Order type" trailingValue={orderType === "market" ? "Market" : "Limit"} trailingValueEmphasis="base" showChevron={false} showDivider={orderType === "limit"} />
                  {orderType === "limit" && <ListItem title="Limit price" trailingValue={`$${limitPrice}`} trailingValueEmphasis="base" showChevron={false} showDivider />}
                  <ListItem title="Estimated total" trailingValue={`$${estimatedTotal.toFixed(2)}`} trailingValueEmphasis="primary" showChevron={false} showDivider={false} />
                </>
              )}
            </Card>
            <div className="flex flex-col gap-3 pt-2">
              <Button variant="primary" size="lg" fullWidth onClick={handlePlaceOrder} disabled={fromEtf ? !isValidEtfOrder : !isValidOrder}>Place order</Button>
              <Button variant="secondary" size="lg" fullWidth onClick={handleBackFromReview}>Back</Button>
            </div>
          </div>
        )}

        {step === "confirmation" && selectedSecurity && (
          <div className="flex flex-col gap-4 w-full max-w-[361px]">
            <Card className="w-full flex flex-col gap-4 p-4 rounded-2xl">
              <div className="text-center" style={{ fontFamily: "var(--font-family-text)", fontSize: "var(--font-size-body1)", color: "var(--text-base)" }}>
                Your {side === "buy" ? "buy" : "sell"} order for ${amountNum.toFixed(2)} of {selectedSecurity.symbol}{fromEtfState?.accountLabel ? ` in ${fromEtfState.accountLabel}` : ""} has been placed.
              </div>
            </Card>
            <div className="pt-2">
              <Button variant="primary" size="lg" fullWidth onClick={handleBackToEtfDetails}>Back to ETF details</Button>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}

// ---------------------------------------------------------------------------
// Stock Selection (widgets with list previews + See all)
// ---------------------------------------------------------------------------

const PREVIEW_COUNT = 3;

export interface StockOrETF {
  symbol: string;
  name: string;
  isETF?: boolean;
  changePercent?: number;
}

export interface SelectionWidget {
  id: string;
  title: string;
  items: StockOrETF[];
}

export interface SelectionSection {
  id: string;
  title: string;
  description?: string;
  widgets: SelectionWidget[];
}

const SELECTION_SECTIONS: SelectionSection[] = [
  {
    id: "industry",
    title: "Industry",
    description: "Browse by sector",
    widgets: [
      { id: "tech", title: "Tech", items: [{ symbol: "AAPL", name: "Apple Inc.", isETF: false, changePercent: 2.4 }, { symbol: "MSFT", name: "Microsoft Corp.", isETF: false, changePercent: 1.92 }, { symbol: "GOOGL", name: "Alphabet Inc.", isETF: false, changePercent: -0.45 }, { symbol: "NVDA", name: "NVIDIA Corp.", isETF: false, changePercent: 3.2 }, { symbol: "META", name: "Meta Platforms Inc.", isETF: false, changePercent: -1.2 }] },
      { id: "healthcare", title: "Healthcare", items: [{ symbol: "UNH", name: "UnitedHealth Group Inc.", isETF: false, changePercent: 0.6 }, { symbol: "JNJ", name: "Johnson & Johnson", isETF: false, changePercent: 0.3 }, { symbol: "LLY", name: "Eli Lilly and Co.", isETF: false, changePercent: 1.2 }, { symbol: "PFE", name: "Pfizer Inc.", isETF: false, changePercent: -0.4 }] },
      { id: "energy", title: "Energy", items: [{ symbol: "XOM", name: "Exxon Mobil Corp.", isETF: false, changePercent: -0.8 }, { symbol: "CVX", name: "Chevron Corp.", isETF: false, changePercent: 0.2 }, { symbol: "COP", name: "ConocoPhillips", isETF: false, changePercent: 0.5 }] },
      { id: "financials", title: "Financials", items: [{ symbol: "JPM", name: "JPMorgan Chase & Co.", isETF: false, changePercent: 0.8 }, { symbol: "V", name: "Visa Inc.", isETF: false, changePercent: 0.4 }, { symbol: "MA", name: "Mastercard Inc.", isETF: false, changePercent: 0.6 }, { symbol: "BAC", name: "Bank of America Corp.", isETF: false, changePercent: -0.2 }] },
      { id: "consumer", title: "Consumer", items: [{ symbol: "AMZN", name: "Amazon.com Inc.", isETF: false, changePercent: 0.95 }, { symbol: "TSLA", name: "Tesla Inc.", isETF: false, changePercent: -2.1 }, { symbol: "COST", name: "Costco Wholesale Corp.", isETF: false, changePercent: 0.4 }, { symbol: "HD", name: "Home Depot Inc.", isETF: false, changePercent: 0.3 }] },
    ],
  },
  {
    id: "country",
    title: "Country",
    description: "Stocks and ETFs by region",
    widgets: [
      { id: "us", title: "United States", items: [{ symbol: "VOO", name: "Vanguard S&P 500 ETF", isETF: true, changePercent: 0.82 }, { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", isETF: true, changePercent: 0.56 }, { symbol: "VTI", name: "Vanguard Total Stock Market ETF", isETF: true, changePercent: 0.7 }, { symbol: "QQQ", name: "Invesco QQQ Trust", isETF: true, changePercent: 1.2 }] },
      { id: "europe", title: "Europe", items: [{ symbol: "VGK", name: "Vanguard FTSE Europe ETF", isETF: true, changePercent: -0.2 }, { symbol: "IEUR", name: "iShares Core MSCI Europe ETF", isETF: true, changePercent: 0.1 }] },
      { id: "japan", title: "Japan", items: [{ symbol: "EWJ", name: "iShares MSCI Japan ETF", isETF: true, changePercent: 1.1 }, { symbol: "DXJ", name: "WisdomTree Japan Hedged Equity Fund", isETF: true, changePercent: 0.5 }] },
      { id: "emerging", title: "Emerging markets", items: [{ symbol: "EEM", name: "iShares MSCI Emerging Markets ETF", isETF: true, changePercent: 0.4 }, { symbol: "VWO", name: "Vanguard FTSE Emerging Markets ETF", isETF: true, changePercent: 0.3 }] },
    ],
  },
  {
    id: "market-cap",
    title: "Market cap",
    description: "Browse by company size",
    widgets: [
      { id: "large-cap", title: "Large cap", items: [{ symbol: "AAPL", name: "Apple Inc.", isETF: false, changePercent: 2.4 }, { symbol: "MSFT", name: "Microsoft Corp.", isETF: false, changePercent: 1.92 }, { symbol: "GOOGL", name: "Alphabet Inc.", isETF: false, changePercent: -0.45 }, { symbol: "VOO", name: "Vanguard S&P 500 ETF", isETF: true, changePercent: 0.82 }, { symbol: "JPM", name: "JPMorgan Chase & Co.", isETF: false, changePercent: 0.8 }] },
      { id: "mid-cap", title: "Mid cap", items: [{ symbol: "ROKU", name: "Roku Inc.", isETF: false, changePercent: 1.2 }, { symbol: "ZM", name: "Zoom Video Communications", isETF: false, changePercent: -0.5 }, { symbol: "DDOG", name: "Datadog Inc.", isETF: false, changePercent: 2.1 }, { symbol: "MDY", name: "SPDR S&P MidCap 400 ETF", isETF: true, changePercent: 0.4 }] },
      { id: "small-cap", title: "Small cap", items: [{ symbol: "IWM", name: "iShares Russell 2000 ETF", isETF: true, changePercent: 0.6 }, { symbol: "VB", name: "Vanguard Small-Cap ETF", isETF: true, changePercent: 0.3 }, { symbol: "SCHA", name: "Schwab U.S. Small-Cap ETF", isETF: true, changePercent: 0.2 }] },
    ],
  },
  {
    id: "popular",
    title: "Popular",
    description: "Most traded",
    widgets: [
      { id: "most-traded", title: "Most traded", items: [{ symbol: "TSLA", name: "Tesla Inc.", isETF: false, changePercent: -2.1 }, { symbol: "VTI", name: "Vanguard Total Stock Market ETF", isETF: true, changePercent: 0.7 }, { symbol: "QQQ", name: "Invesco QQQ Trust", isETF: true, changePercent: 1.2 }, { symbol: "COST", name: "Costco Wholesale Corp.", isETF: false, changePercent: 0.4 }, { symbol: "NVDA", name: "NVIDIA Corp.", isETF: false, changePercent: 3.2 }] },
    ],
  },
];

function SelectionListWidget({
  widget,
  onSelect,
  onSeeAll,
}: {
  widget: SelectionWidget;
  onSelect: (item: StockOrETF) => void;
  onSeeAll: () => void;
}) {
  const previewItems = widget.items.slice(0, PREVIEW_COUNT);
  const hasMore = widget.items.length > PREVIEW_COUNT;

  return (
    <Card className="w-[280px] shrink-0 flex flex-col gap-0 p-0 rounded-2xl overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h4
          className="font-semibold"
          style={{
            fontFamily: "var(--font-family-headline)",
            fontSize: "var(--font-size-headline5)",
            lineHeight: "var(--line-height-headline5)",
            color: "var(--text-base)",
          }}
        >
          {widget.title}
        </h4>
      </div>
      <div className="flex flex-col px-4 gap-0">
        {previewItems.map((item, i) => (
          <ListItem
            key={item.symbol}
            title={item.symbol}
            description={item.name}
            showDescription
            trailingDescription={item.changePercent != null ? `${item.changePercent >= 0 ? "+" : ""}${item.changePercent}%` : undefined}
            showTrailingDescription={!!(item.changePercent != null)}
            trailingValueEmphasis="default"
            showChevron
            showDivider={i < previewItems.length - 1 || hasMore}
            onClick={() => onSelect(item)}
          />
        ))}
      </div>
      {hasMore && (
        <div className="px-4 pt-3 pb-4">
          <Button variant="secondary" size="sm" fullWidth onClick={onSeeAll}>
            See all
          </Button>
        </div>
      )}
    </Card>
  );
}

function FullListView({
  title,
  items,
  onSelect,
  onBack,
}: {
  title: string;
  items: StockOrETF[];
  onSelect: (item: StockOrETF) => void;
  onBack: () => void;
}) {
  return (
    <Screen>
      <TopNavBar variant="default" showStatusBar leftIcon="arrow-left" leftIconAriaLabel="Back" onLeftIconClick={onBack} showTitle title={title} />
      <div className="flex flex-col w-full px-4 pt-4 pb-8">
        <Card className="w-full flex flex-col gap-0 p-4 rounded-2xl overflow-hidden">
          {items.map((item, i) => (
            <ListItem
              key={item.symbol}
              title={item.symbol}
              description={item.name}
              showDescription
              trailingDescription={item.changePercent != null ? `${item.changePercent >= 0 ? "+" : ""}${item.changePercent}%` : undefined}
              showTrailingDescription={!!(item.changePercent != null)}
              trailingValueEmphasis="default"
              showChevron
              showDivider={i < items.length - 1}
              onClick={() => onSelect(item)}
            />
          ))}
        </Card>
      </div>
    </Screen>
  );
}

export function StockSelectionCarousel() {
  const navigate = useNavigate();
  const [fullList, setFullList] = useState<{ title: string; items: StockOrETF[] } | null>(null);

  const handleSelect = (item: StockOrETF) => {
    if (item.isETF) {
      navigate("/etf-details", { state: { symbol: item.symbol, name: item.name, returnTo: "/stock-selection-carousel" } });
    } else {
      navigate("/stock-details", { state: { symbol: item.symbol, name: item.name, price: 100, changePercent: item.changePercent ?? 0 } });
    }
  };

  if (fullList) {
    return (
      <FullListView
        title={fullList.title}
        items={fullList.items}
        onSelect={handleSelect}
        onBack={() => setFullList(null)}
      />
    );
  }

  return (
    <Screen>
      <TopNavBar variant="default" showStatusBar leftIcon="arrow-left" leftIconAriaLabel="Back" onLeftIconClick={() => navigate("/self-directed-trading")} showTitle title="Stocks & ETFs" />
      <div className="flex flex-col w-full px-4 pb-8 gap-4">
        <p className="pt-4 pb-0" style={{ fontFamily: "var(--font-family-text)", fontSize: "var(--font-size-body2)", lineHeight: "var(--line-height-body2)", color: "var(--text-subtle)" }}>
          Choose a category and tap a stock or ETF to view or trade.
        </p>
        {SELECTION_SECTIONS.map((section) => (
          <div key={section.id} className="w-full">
            <SectionTitle
              title={section.title}
              description={section.description}
              variant={section.description ? "title-and-description" : "title-only"}
              showTrailing={false}
              className="w-full pb-2"
            />
            <div
              className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 -mx-4 px-4"
              style={{ WebkitOverflowScrolling: "touch" }}
              role="list"
              aria-label={`${section.title} categories`}
            >
              {section.widgets.map((widget) => (
                <SelectionListWidget
                  key={widget.id}
                  widget={widget}
                  onSelect={handleSelect}
                  onSeeAll={() => setFullList({ title: widget.title, items: widget.items })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
