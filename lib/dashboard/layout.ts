export type DashboardWidgetId =
  | "stat-trips"
  | "stat-countries"
  | "stat-moments"
  | "stat-media"
  | "hero-overview"
  | "recent-trips"
  | "trip-cadence"
  | "privacy-mix"
  | "archive-focus";

export type DashboardLayoutItem = {
  id: DashboardWidgetId;
  order: number;
  colSpan: number;
  rowSpan: number;
  visible: boolean;
};

export type DashboardWidgetMeta = {
  id: DashboardWidgetId;
  title: string;
  description: string;
  minColSpan: number;
  maxColSpan: number;
  minRowSpan: number;
  maxRowSpan: number;
};

export const DASHBOARD_WIDGETS: DashboardWidgetMeta[] = [
  {
    id: "stat-trips",
    title: "Trips pulse",
    description: "Total journeys logged across the archive.",
    minColSpan: 2,
    maxColSpan: 4,
    minRowSpan: 1,
    maxRowSpan: 2,
  },
  {
    id: "stat-countries",
    title: "Countries covered",
    description: "Unique country count from your trips.",
    minColSpan: 2,
    maxColSpan: 4,
    minRowSpan: 1,
    maxRowSpan: 2,
  },
  {
    id: "stat-moments",
    title: "Moments logged",
    description: "Highlights captured across all trips.",
    minColSpan: 2,
    maxColSpan: 4,
    minRowSpan: 1,
    maxRowSpan: 2,
  },
  {
    id: "stat-media",
    title: "Media stored",
    description: "Photos and videos attached to stories.",
    minColSpan: 2,
    maxColSpan: 4,
    minRowSpan: 1,
    maxRowSpan: 2,
  },
  {
    id: "hero-overview",
    title: "Atlas console",
    description: "Primary action hub and archive snapshot.",
    minColSpan: 6,
    maxColSpan: 12,
    minRowSpan: 2,
    maxRowSpan: 3,
  },
  {
    id: "recent-trips",
    title: "Recent trips",
    description: "Jump back into the latest entries.",
    minColSpan: 4,
    maxColSpan: 8,
    minRowSpan: 2,
    maxRowSpan: 3,
  },
  {
    id: "trip-cadence",
    title: "Trip cadence",
    description: "Last six months of entries added.",
    minColSpan: 4,
    maxColSpan: 8,
    minRowSpan: 2,
    maxRowSpan: 3,
  },
  {
    id: "privacy-mix",
    title: "Privacy mix",
    description: "How your trips are shared today.",
    minColSpan: 4,
    maxColSpan: 8,
    minRowSpan: 2,
    maxRowSpan: 3,
  },
  {
    id: "archive-focus",
    title: "Archive focus",
    description: "Gaps and momentum in the archive.",
    minColSpan: 6,
    maxColSpan: 12,
    minRowSpan: 2,
    maxRowSpan: 3,
  },
];

export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayoutItem[] = [
  { id: "stat-trips", order: 0, colSpan: 3, rowSpan: 1, visible: true },
  { id: "stat-countries", order: 1, colSpan: 3, rowSpan: 1, visible: true },
  { id: "stat-moments", order: 2, colSpan: 3, rowSpan: 1, visible: true },
  { id: "stat-media", order: 3, colSpan: 3, rowSpan: 1, visible: true },
  { id: "hero-overview", order: 4, colSpan: 7, rowSpan: 2, visible: true },
  { id: "recent-trips", order: 5, colSpan: 5, rowSpan: 2, visible: true },
  { id: "trip-cadence", order: 6, colSpan: 7, rowSpan: 2, visible: true },
  { id: "privacy-mix", order: 7, colSpan: 5, rowSpan: 2, visible: true },
  { id: "archive-focus", order: 8, colSpan: 12, rowSpan: 2, visible: true },
];

const widgetMetaMap = new Map(
  DASHBOARD_WIDGETS.map((widget) => [widget.id, widget])
);
const defaultOrderMap = new Map(
  DEFAULT_DASHBOARD_LAYOUT.map((item) => [item.id, item.order])
);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const toNumber = (value: unknown, fallback: number) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const toBoolean = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

export const normalizeDashboardLayout = (
  layout: unknown
): DashboardLayoutItem[] => {
  const stored = Array.isArray(layout) ? layout : [];
  const storedMap = new Map<DashboardWidgetId, Partial<DashboardLayoutItem>>();

  for (const entry of stored) {
    if (!entry || typeof entry !== "object") continue;
    const id = (entry as { id?: DashboardWidgetId }).id;
    if (!id || !widgetMetaMap.has(id)) continue;
    storedMap.set(id, entry as Partial<DashboardLayoutItem>);
  }

  const merged = DEFAULT_DASHBOARD_LAYOUT.map((item) => {
    const storedItem = storedMap.get(item.id);
    const meta = widgetMetaMap.get(item.id)!;
    return {
      id: item.id,
      order: toNumber(storedItem?.order, item.order),
      colSpan: clamp(
        toNumber(storedItem?.colSpan, item.colSpan),
        meta.minColSpan,
        meta.maxColSpan
      ),
      rowSpan: clamp(
        toNumber(storedItem?.rowSpan, item.rowSpan),
        meta.minRowSpan,
        meta.maxRowSpan
      ),
      visible: toBoolean(storedItem?.visible, item.visible),
    };
  });

  const sorted = [...merged].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return (defaultOrderMap.get(a.id) ?? 0) - (defaultOrderMap.get(b.id) ?? 0);
  });

  return sorted.map((item, index) => ({ ...item, order: index }));
};

export const serializeDashboardLayout = (
  layout: DashboardLayoutItem[]
): DashboardLayoutItem[] =>
  layout.map((item) => ({
    id: item.id,
    order: item.order,
    colSpan: item.colSpan,
    rowSpan: item.rowSpan,
    visible: item.visible,
  }));
