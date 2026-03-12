/**
 * ETF details screen – saved copy.
 * In the app: app/ETFDetails.tsx
 * Open: Hub → "ETF details" or http://localhost:3000/etf-details
 */
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "./Screen";
import {
  TopNavBar,
  PageTitleAccount,
  PerformanceGraph,
  Card,
  ListItem,
  SectionTitle,
  InlineText,
  Badge,
  HorizontalBarChart,
  BarChartDot,
  Icon,
  Select,
  type BarSegment,
} from "@qapital/qdl";
import type { BarChartColor } from "@qapital/qdl";
import type { DateRangeValue } from "@qapital/qdl";

const etfChartData = (() => {
  const points: number[] = [];
  let v = 418;
  for (let i = 0; i < 70; i++) {
    v = Math.max(395, Math.min(435, v + (Math.random() - 0.48) * 4 + 0.1));
    points.push(Math.round(v * 100) / 100);
  }
  return points;
})();

// Position data per account; only the Position section updates when account changes
const positionByAccount = [
  { id: "taxable", label: "Taxable brokerage", shares: 5, avgCost: 412.2, marketValue: 2143.35, totalCost: 2061, gainLoss: 82.35, gainLossPercent: 4.0 },
  { id: "ira", label: "IRA", shares: 12, avgCost: 398.5, marketValue: 5144.04, totalCost: 4782, gainLoss: 362.04, gainLossPercent: 7.57 },
  { id: "roth", label: "Roth IRA", shares: 3, avgCost: 421.0, marketValue: 1286.01, totalCost: 1263, gainLoss: 23.01, gainLossPercent: 1.82 },
];

/** ETF details page – price chart, position, sectors with company dropdowns (bars + %), financials, and ETF info. Uses VOO as example. */
export function ETFDetails() {
  const navigate = useNavigate();
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
        {
          sector: "Technology",
          weight: 28.4,
          color: "green" as BarChartColor,
          companies: [
            { name: "Apple Inc.", symbol: "AAPL", weight: 7.02 },
            { name: "Microsoft Corp.", symbol: "MSFT", weight: 6.48 },
            { name: "NVIDIA Corp.", symbol: "NVDA", weight: 5.12 },
            { name: "Broadcom Inc.", symbol: "AVGO", weight: 2.89 },
            { name: "Oracle Corp.", symbol: "ORCL", weight: 1.95 },
            { name: "Adobe Inc.", symbol: "ADBE", weight: 1.42 },
            { name: "Salesforce Inc.", symbol: "CRM", weight: 1.38 },
            { name: "Others", symbol: "", weight: 2.14 },
          ],
        },
        {
          sector: "Healthcare",
          weight: 13.2,
          color: "purple" as BarChartColor,
          companies: [
            { name: "UnitedHealth Group", symbol: "UNH", weight: 2.68 },
            { name: "Johnson & Johnson", symbol: "JNJ", weight: 1.82 },
            { name: "Eli Lilly and Co.", symbol: "LLY", weight: 1.75 },
            { name: "Procter & Gamble", symbol: "PG", weight: 1.42 },
            { name: "Merck & Co.", symbol: "MRK", weight: 1.38 },
            { name: "Others", symbol: "", weight: 4.15 },
          ],
        },
        {
          sector: "Financials",
          weight: 12.1,
          color: "golden" as BarChartColor,
          companies: [
            { name: "Berkshire Hathaway", symbol: "BRK.B", weight: 1.84 },
            { name: "JPMorgan Chase", symbol: "JPM", weight: 1.62 },
            { name: "Visa Inc.", symbol: "V", weight: 1.48 },
            { name: "Mastercard Inc.", symbol: "MA", weight: 1.12 },
            { name: "Bank of America", symbol: "BAC", weight: 0.98 },
            { name: "Others", symbol: "", weight: 5.06 },
          ],
        },
        {
          sector: "Consumer discretionary",
          weight: 10.5,
          color: "citrus" as BarChartColor,
          companies: [
            { name: "Amazon.com Inc.", symbol: "AMZN", weight: 3.65 },
            { name: "Tesla Inc.", symbol: "TSLA", weight: 1.85 },
            { name: "Home Depot", symbol: "HD", weight: 1.42 },
            { name: "McDonald's Corp.", symbol: "MCD", weight: 0.92 },
            { name: "Others", symbol: "", weight: 2.66 },
          ],
        },
        {
          sector: "Communication services",
          weight: 8.8,
          color: "skyline" as BarChartColor,
          companies: [
            { name: "Meta Platforms Inc.", symbol: "META", weight: 2.18 },
            { name: "Alphabet Inc. Cl A", symbol: "GOOGL", weight: 1.78 },
            { name: "Alphabet Inc. Cl C", symbol: "GOOG", weight: 1.62 },
            { name: "Netflix Inc.", symbol: "NFLX", weight: 0.88 },
            { name: "Others", symbol: "", weight: 2.34 },
          ],
        },
        {
          sector: "Industrials",
          weight: 8.5,
          color: "peach" as BarChartColor,
          companies: [
            { name: "Caterpillar Inc.", symbol: "CAT", weight: 1.12 },
            { name: "Honeywell International", symbol: "HON", weight: 0.98 },
            { name: "United Parcel Service", symbol: "UPS", weight: 0.85 },
            { name: "Boeing Co.", symbol: "BA", weight: 0.62 },
            { name: "Others", symbol: "", weight: 4.93 },
          ],
        },
        {
          sector: "Consumer staples",
          weight: 6.2,
          color: "neutral" as BarChartColor,
          companies: [
            { name: "Costco Wholesale", symbol: "COST", weight: 1.42 },
            { name: "PepsiCo Inc.", symbol: "PEP", weight: 1.08 },
            { name: "Coca-Cola Co.", symbol: "KO", weight: 0.95 },
            { name: "Walmart Inc.", symbol: "WMT", weight: 0.88 },
            { name: "Others", symbol: "", weight: 1.87 },
          ],
        },
        {
          sector: "Energy",
          weight: 4.8,
          color: "red" as BarChartColor,
          companies: [
            { name: "Exxon Mobil Corp.", symbol: "XOM", weight: 1.42 },
            { name: "Chevron Corp.", symbol: "CVX", weight: 1.28 },
            { name: "ConocoPhillips", symbol: "COP", weight: 0.52 },
            { name: "Others", symbol: "", weight: 1.58 },
          ],
        },
      ],
    }),
    []
  );

  const isPositive = etf.changePercent >= 0;
  const sectorBarSegments: BarSegment[] = useMemo(
    () =>
      etf.sectorAllocation.map((s) => ({
        id: s.sector,
        label: s.sector,
        value: s.weight,
        color: s.color,
      })),
    [etf.sectorAllocation]
  );

  return (
    <Screen>
      <TopNavBar
        variant="default"
        showStatusBar
        leftIcon="arrow-left"
        leftIconAriaLabel="Back"
        onLeftIconClick={() => navigate(-1)}
        showTitle
        title="ETF details"
      />

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
            <PerformanceGraph
              data={etfChartData}
              variant={isPositive ? "positive" : "negative"}
              dateRangeValue={dateRange}
              onDateRangeChange={setDateRange}
              className="w-full"
              aria-label="Price over time"
            />
          </div>

          <div className="w-full max-w-[361px] flex flex-col items-stretch">
            <SectionTitle title="Position" showTrailing={false} className="w-full" />
            <Select
              label="Account"
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}
              options={positionByAccount.map((a) => ({ value: a.id, label: a.label }))}
              placeholder="Choose account"
              fullWidth
              compact
              showBelow={false}
              className="mb-3"
            />
            {(() => {
              const position = positionByAccount.find((a) => a.id === selectedAccountId) ?? positionByAccount[0];
              return (
                <Card className="w-full flex flex-col gap-0 p-4 rounded-2xl">
                  <ListItem title="Shares" trailingValue={position.shares.toString()} trailingValueEmphasis="base" showChevron={false} showDivider />
                  <ListItem title="Average cost" trailingValue={`$${position.avgCost.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                  <ListItem title="Market value" trailingValue={`$${position.marketValue.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                  <ListItem title="Total cost" trailingValue={`$${position.totalCost.toFixed(2)}`} trailingValueEmphasis="base" showChevron={false} showDivider />
                  <ListItem
                    title="Gain / loss"
                    trailingValue={`${position.gainLoss >= 0 ? "+" : ""}$${position.gainLoss.toFixed(2)} (${position.gainLoss >= 0 ? "+" : ""}${position.gainLossPercent}%)`}
                    trailingValueEmphasis={position.gainLoss >= 0 ? "primary" : "default"}
                    showChevron={false}
                    showDivider={false}
                  />
                </Card>
              );
            })()}
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
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 min-h-[56px] px-0 py-0 bg-transparent border-0 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-container)] rounded-[var(--radius-2xs)]"
                        onClick={() => setOpenSector(isOpen ? null : s.sector)}
                        aria-expanded={isOpen}
                        aria-controls={`sector-${s.sector.replace(/\s+/g, "-")}`}
                      >
                        <span className="shrink-0 flex justify-center items-center">
                          <BarChartDot color={s.color} />
                        </span>
                        <span
                          className="flex-1 min-w-0 font-semibold truncate"
                          style={{ fontFamily: "var(--font-family-text)", fontSize: "var(--font-size-body1)", lineHeight: "var(--line-height-body1)", color: "var(--text-base)" }}
                        >
                          {s.sector}
                        </span>
                        <span
                          className="shrink-0 font-semibold tabular-nums"
                          style={{ fontFamily: "var(--font-family-text)", fontSize: "var(--font-size-body1)", lineHeight: "var(--line-height-body1)", color: "var(--text-base)" }}
                        >
                          {s.weight.toFixed(1)}%
                        </span>
                        <span className="shrink-0 flex items-center justify-center w-10 h-10">
                          <Icon name={isOpen ? "chevron-up" : "chevron-down"} size="md" color="var(--icon-base)" />
                        </span>
                      </button>
                      {isOpen && (
                        <div id={`sector-${s.sector.replace(/\s+/g, "-")}`} className="pl-6 pb-2 flex flex-col gap-0 border-b border-[var(--border-base)]" style={{ marginLeft: "var(--spacing-2xs)" }}>
                          {s.companies.map((co, j) => (
                            <ListItem
                              key={co.symbol || co.name}
                              title={co.name}
                              description={co.symbol || undefined}
                              showDescription={!!co.symbol}
                              trailingValue={`${co.weight.toFixed(2)}%`}
                              trailingValueEmphasis="base"
                              showChevron={false}
                              showDivider={j < s.companies.length - 1}
                              className="pl-0 min-h-[48px]"
                            />
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
  );
}
