"use client";

import {BarChart, LineChart, PieChart} from "echarts/charts";
import {AriaComponent, GridComponent, LegendComponent, TooltipComponent} from "echarts/components";
import * as echarts from "echarts/core";
import type {EChartsCoreOption} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {useTheme} from "next-themes";
import {useEffect, useRef, useSyncExternalStore} from "react";

echarts.use([BarChart, LineChart, PieChart, AriaComponent, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

function cssToken(styles: CSSStyleDeclaration, token: string) {
  return styles.getPropertyValue(token).trim();
}

function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const observer = new MutationObserver(onChange);
  media.addEventListener("change", onChange);
  observer.observe(document.documentElement, {attributes: true, attributeFilter: ["data-motion"]});
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || document.documentElement.dataset.motion === "reduced";
}

function withMotion(option: EChartsCoreOption, reduced: boolean): EChartsCoreOption {
  return {
    ...option,
    animation: !reduced,
    animationDuration: reduced ? 0 : 650,
    animationDurationUpdate: reduced ? 0 : 480,
    animationEasing: "cubicOut",
    animationEasingUpdate: "cubicOut",
  };
}

export function EChartsChart({option, label, className = "h-80"}: {option: EChartsCoreOption; label: string; className?: string}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null);
  const optionRef = useRef(option);
  const {resolvedTheme} = useTheme();
  const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => true);

  useEffect(() => {
    optionRef.current = option;
    chartRef.current?.setOption(withMotion(option, reducedMotion), {notMerge: true});
  }, [option, reducedMotion]);

  useEffect(() => {
    if (!containerRef.current) return;
    const styles = getComputedStyle(document.documentElement);
    const foreground = cssToken(styles, "--foreground");
    const muted = cssToken(styles, "--muted");
    const border = cssToken(styles, "--border");
    const surface = cssToken(styles, "--surface");
    const chart = echarts.init(containerRef.current, {
      color: [cssToken(styles, "--primary"), cssToken(styles, "--violet"), cssToken(styles, "--cyan")],
      backgroundColor: "transparent",
      textStyle: {color: muted, fontFamily: "Inter, sans-serif"},
      categoryAxis: {axisLine: {lineStyle: {color: border}}, axisTick: {show: false}, axisLabel: {color: muted}},
      valueAxis: {axisLine: {show: false}, axisTick: {show: false}, axisLabel: {color: muted}, splitLine: {lineStyle: {color: border}}},
      legend: {textStyle: {color: muted}},
      tooltip: {backgroundColor: surface, borderColor: border, textStyle: {color: foreground}},
    });
    chartRef.current = chart;
    chart.setOption(withMotion(optionRef.current, prefersReducedMotion()), {notMerge: true});

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      chartRef.current = null;
      chart.dispose();
    };
  }, [resolvedTheme]);

  return <div ref={containerRef} role="img" aria-label={label} className={`w-full ${className}`} />;
}
