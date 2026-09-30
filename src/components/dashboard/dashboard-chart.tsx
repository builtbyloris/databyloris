"use client";

import type {EChartsCoreOption} from "echarts/core";
import {useLocale, useTranslations} from "next-intl";
import {useMemo} from "react";
import {Card} from "@/components/ui";
import {formatCompactDashboardValue, formatDashboardValue, prepareChartData} from "@/lib/dashboard";
import type {ChartConfig, DashboardRecord} from "@/types";
import {EChartsChart} from "./echarts-chart";
import {useDashboardText} from "./use-dashboard-text";

export function DashboardChart({config, records, featured = false}: {config: ChartConfig; records: DashboardRecord[]; featured?: boolean}) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const dashboardText = useDashboardText();
  const points = useMemo(() => prepareChartData(records, config), [config, records]);
  const title = dashboardText(config.title);
  const description = dashboardText(config.description).trim();

  const option = useMemo<EChartsCoreOption>(() => {
    const format = config.valueFormat ?? "number";
    const valueFormatter = (value: string | number) => typeof value === "number" ? formatDashboardValue(value, format, locale) : String(value);
    const axisValueFormatter = (value: number) => formatCompactDashboardValue(value, format, locale);
    const tooltip = {trigger: config.type === "donut" || config.type === "pie" ? "item" : "axis", valueFormatter};
    if (config.type === "donut" || config.type === "pie") {
      return {
        aria: {enabled: true},
        tooltip,
        legend: {type: "scroll", bottom: 0, left: "center"},
        series: [{type: "pie", radius: config.type === "donut" ? ["46%", "70%"] : "70%", center: ["50%", "43%"], data: points.map((point) => ({name: String(point.category), value: point.value})), label: {show: false}, emphasis: {scaleSize: 5}}],
      };
    }
    if (config.type === "bar") {
      return {
        aria: {enabled: true},
        tooltip,
        grid: {left: 8, right: 18, top: 10, bottom: 10, containLabel: true},
        xAxis: {type: "value", splitNumber: 3, axisLabel: {formatter: axisValueFormatter, hideOverlap: true}},
        yAxis: {type: "category", inverse: true, data: points.map((point) => point.category), axisLabel: {overflow: "truncate", width: 110}},
        series: [{type: "bar", data: points.map((point) => point.value), barMaxWidth: 20, itemStyle: {borderRadius: [0, 5, 5, 0]}}],
      };
    }
    return {
      aria: {enabled: true},
      tooltip,
      grid: {left: 10, right: 18, top: 18, bottom: 10, containLabel: true},
      xAxis: {type: "category", boundaryGap: false, data: points.map((point) => point.category)},
      yAxis: {type: "value", splitNumber: 4, axisLabel: {formatter: axisValueFormatter, hideOverlap: true}},
      series: [{type: "line", smooth: true, symbolSize: 8, data: points.map((point) => point.value), lineStyle: {width: 3}, areaStyle: {opacity: 0.08}}],
    };
  }, [config.type, config.valueFormat, locale, points]);

  return (
    <Card data-dashboard-section="charts" className={`min-w-0 p-5 sm:p-6 ${featured ? "lg:col-span-2 xl:col-span-2" : ""}`}>
      <h2 className="text-base font-bold tracking-tight sm:text-lg">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-6 text-muted">{description}</p> : null}
      <EChartsChart option={option} label={t("charts.accessibleLabel", {title})} className={featured ? "h-80 sm:h-96" : "h-80"} />
    </Card>
  );
}
