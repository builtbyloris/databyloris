export const DASHBOARD_CHART_INTERACTION_EVENT =
  "databyloris:dashboard-chart-interaction";

export interface DashboardChartInteractionDetail {
  moduleId: string;
  period: string;
}

export function reportDashboardChartInteraction(
  detail: DashboardChartInteractionDetail,
) {
  window.dispatchEvent(
    new CustomEvent<DashboardChartInteractionDetail>(
      DASHBOARD_CHART_INTERACTION_EVENT,
      { detail },
    ),
  );
}
