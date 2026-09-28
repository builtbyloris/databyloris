"use client";

import type {EChartsCoreOption} from "echarts/core";
import {useLocale, useTranslations} from "next-intl";
import {useMemo} from "react";
import {Card} from "@/components/ui";
import {formatSales, prepareChartData} from "@/lib/dashboard";
import type {ChartConfig, DashboardRecord} from "@/types";
import {EChartsChart} from "./echarts-chart";

export function DashboardChart({config, records, featured = false}: {config: ChartConfig; records: DashboardRecord[]; featured?: boolean}) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const points = useMemo(() => prepareChartData(records, config), [config, records]);

  const option = useMemo<EChartsCoreOption>(() => {
    const valueFormatter = (value: string | number) => typeof value === "number" ? formatSales(value, locale) : String(value);
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
        xAxis: {type: "value", splitNumber: 3, axisLabel: {formatter: (value: number) => `${value}M`}},
        yAxis: {type: "category", inverse: true, data: points.map((point) => point.category)},
        series: [{type: "bar", data: points.map((point) => point.value), barMaxWidth: 20, itemStyle: {borderRadius: [0, 5, 5, 0]}}],
      };
    }
    return {
      aria: {enabled: true},
      tooltip,
      grid: {left: 10, right: 18, top: 18, bottom: 10, containLabel: true},
      xAxis: {type: "category", boundaryGap: false, data: points.map((point) => point.category)},
      yAxis: {type: "value", axisLabel: {formatter: (value: number) => `${value}M`}},
      series: [{type: "line", smooth: true, symbolSize: 8, data: points.map((point) => point.value), lineStyle: {width: 3}, areaStyle: {opacity: 0.08}}],
    };
  }, [config.type, locale, points]);

  return (
    <Card className={`min-w-0 p-5 sm:p-6 ${featured ? "lg:col-span-2 xl:col-span-2" : ""}`}>
      <h2 className="text-base font-bold tracking-tight sm:text-lg">{t(config.title)}</h2>
      <EChartsChart option={option} label={t("charts.accessibleLabel", {title: t(config.title)})} className={featured ? "h-80 sm:h-96" : "h-80"} />
    </Card>
  );
}
