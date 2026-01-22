"use client";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  LayoutGrid,
  Plus,
  RotateCcw,
  Save,
  Settings2,
  X,
} from "lucide-react";

import { Shine } from "@/components/animate-ui/primitives/effects/shine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  DASHBOARD_WIDGETS,
  DEFAULT_DASHBOARD_LAYOUT,
  normalizeDashboardLayout,
  serializeDashboardLayout,
  type DashboardLayoutItem,
  type DashboardWidgetId,
} from "@/lib/dashboard/layout";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type EditableDashboardProps = {
  initialLayout: DashboardLayoutItem[];
  widgets: Partial<Record<DashboardWidgetId, ReactNode>>;
};

const LAYOUT_ROW_HEIGHT = 150;

const getLayoutById = (layout: DashboardLayoutItem[]) =>
  new Map(layout.map((item) => [item.id, item]));

const toPayload = (layout: DashboardLayoutItem[]) =>
  serializeDashboardLayout(normalizeDashboardLayout(layout));

const getDragId = (data: Record<string, unknown>) => {
  const id = data.id;
  return typeof id === "string" ? (id as DashboardWidgetId) : null;
};

const getInstanceId = (data: Record<string, unknown>) => {
  const instanceId = data.instanceId;
  return typeof instanceId === "symbol" ? instanceId : null;
};

type Edge = "top" | "bottom";

const getVisibleOrder = (layout: DashboardLayoutItem[]) =>
  layout
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order)
    .map((item) => item.id);

type DropIndicator = {
  id: DashboardWidgetId;
  edge: Edge | null;
};

const getClosestEdge = (element: Element, clientY: number): Edge => {
  const rect = element.getBoundingClientRect();
  const midpoint = rect.top + rect.height / 2;
  return clientY < midpoint ? "top" : "bottom";
};

const getReorderIndex = (startIndex: number, targetIndex: number, edge: Edge) => {
  let finishIndex = edge === "bottom" ? targetIndex + 1 : targetIndex;
  if (startIndex < finishIndex) {
    finishIndex -= 1;
  }
  return finishIndex;
};

type DashboardTileProps = {
  item: DashboardLayoutItem;
  node: ReactNode;
  instanceId: symbol;
  editMode: boolean;
  isDropTarget: boolean;
  dropEdge: Edge | null;
  isDragging: boolean;
  showDropHint: boolean;
  isFlash: boolean;
  onDragStart: (id: DashboardWidgetId) => void;
  onDragClear: () => void;
};

function DashboardTile({
  item,
  node,
  instanceId,
  editMode,
  isDropTarget,
  dropEdge,
  isDragging,
  showDropHint,
  isFlash,
  onDragStart,
  onDragClear,
}: DashboardTileProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editMode) return;
    const element = ref.current;
    if (!element) return;

    const cleanup = combine(
      draggable({
        element,
        canDrag: () => editMode,
        getInitialData: () => ({ id: item.id, instanceId }),
        onGenerateDragPreview: ({ nativeSetDragImage, location }) => {
          if (!nativeSetDragImage) return;
          const rect = element.getBoundingClientRect();
          const clone = element.cloneNode(true) as HTMLElement;
          const computed = window.getComputedStyle(element);

          clone.style.width = `${rect.width}px`;
          clone.style.height = `${rect.height}px`;
          clone.style.margin = "0";
          clone.style.pointerEvents = "none";
          clone.style.transform = "translateZ(0) scale(0.98)";
          clone.style.opacity = "0.95";
          clone.style.borderRadius = computed.borderRadius || "24px";
          clone.style.boxShadow =
            "0 35px 90px -55px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)";
          clone.style.filter = "saturate(1.02)";
          clone.querySelector("[data-drag-hint]")?.remove();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element,
              input: location.initial.input,
            }),
            render: ({ container }) => {
              container.style.width = `${rect.width}px`;
              container.style.height = `${rect.height}px`;
              container.style.pointerEvents = "none";
              container.style.transform = "translateZ(0)";
              container.appendChild(clone);
              return () => {
                clone.remove();
              };
            },
          });
        },
        onDragStart: () => onDragStart(item.id),
        onDrop: () => onDragClear(),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) =>
          editMode && getInstanceId(source.data) === instanceId,
        getData: () => ({ id: item.id, instanceId }),
      })
    );
    return () => {
      cleanup();
    };
  }, [editMode, instanceId, item.id, onDragClear, onDragStart]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative transition-[transform,opacity,box-shadow,outline-color,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none lg:[grid-column:span_var(--col-span)_/_span_var(--col-span)] lg:[grid-row:span_var(--row-span)_/_span_var(--row-span)]",
        editMode && "rounded-3xl outline outline-1 outline-white/10 bg-white/[0.02]",
        editMode &&
          isDropTarget &&
          "outline-2 outline-emerald-400/80 shadow-[0_0_0_1px_rgba(16,185,129,0.35),0_18px_45px_-35px_rgba(16,185,129,0.85)]",
        editMode &&
          isDragging &&
          "opacity-80 scale-[0.98] shadow-[0_20px_60px_-40px_rgba(0,0,0,0.7)]",
        editMode &&
          isFlash &&
          "outline-2 outline-emerald-300/90 shadow-[0_0_0_1px_rgba(52,211,153,0.4),0_24px_55px_-35px_rgba(16,185,129,0.9)]",
        editMode && "cursor-grab select-none active:cursor-grabbing transform-gpu will-change-transform"
      )}
      style={
        {
          order: item.order,
          minHeight: item.rowSpan * LAYOUT_ROW_HEIGHT,
          "--col-span": item.colSpan,
          "--row-span": item.rowSpan,
        } as CSSProperties
      }
    >
      {editMode && showDropHint && dropEdge ? (
        <div
          className={cn(
            "pointer-events-none absolute left-4 right-4 h-[3px] rounded-full bg-emerald-300/80 shadow-[0_0_22px_-8px_rgba(16,185,129,0.85)] transition-all duration-150 ease-out",
            dropEdge === "top" ? "top-3" : "bottom-3"
          )}
        >
          <div className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-300/90 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
        </div>
      ) : null}
      {editMode ? (
        <div
          data-drag-hint
          className="pointer-events-none absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-900 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.6)] ring-1 ring-black/10 backdrop-blur"
        >
          <GripVertical className="size-4 text-slate-900/70" />
          <span className="hidden sm:inline">Drag to move</span>
        </div>
      ) : null}
      <div
        className={cn(
          "h-full",
          editMode && "pointer-events-none",
          editMode && isDragging && "scale-[0.98]"
        )}
      >
        {node}
      </div>
    </div>
  );
}

export function EditableDashboard({ initialLayout, widgets }: EditableDashboardProps) {
  const [savedLayout, setSavedLayout] = useState(() =>
    normalizeDashboardLayout(initialLayout)
  );
  const [draftLayout, setDraftLayout] = useState(() =>
    normalizeDashboardLayout(initialLayout)
  );
  const [editMode, setEditMode] = useState(false);
  const [draggingId, setDraggingId] = useState<DashboardWidgetId | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  const [flashId, setFlashId] = useState<DashboardWidgetId | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition();
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropIndicatorRaf = useRef<number | null>(null);
  const layoutRef = useRef<DashboardLayoutItem[]>([]);
  const [instanceId] = useState(() => Symbol("dashboard-instance"));

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    return () => {
      if (flashTimeout.current) {
        clearTimeout(flashTimeout.current);
      }
      if (dropIndicatorRaf.current) {
        cancelAnimationFrame(dropIndicatorRaf.current);
      }
    };
  }, []);

  useEffect(() => {
    layoutRef.current = draftLayout;
  }, [draftLayout]);

  const widgetMap = useMemo(
    () => new Map(Object.entries(widgets) as [DashboardWidgetId, ReactNode][]),
    [widgets]
  );

  const activeLayout = editMode ? draftLayout : savedLayout;
  const orderedLayout = useMemo(
    () => [...activeLayout].sort((a, b) => a.order - b.order),
    [activeLayout]
  );
  const visibleLayout = orderedLayout.filter((item) => item.visible);
  const layoutById = useMemo(() => getLayoutById(activeLayout), [activeLayout]);

  const draftSignature = useMemo(
    () => JSON.stringify(serializeDashboardLayout(draftLayout)),
    [draftLayout]
  );
  const savedSignature = useMemo(
    () => JSON.stringify(serializeDashboardLayout(savedLayout)),
    [savedLayout]
  );
  const isDirty = editMode && draftSignature !== savedSignature;

  const startEditing = () => {
    setDraftLayout(savedLayout);
    setEditMode(true);
    scheduleDropIndicator(null);
    setDraggingId(null);
    setStatusMessage(null);
  };

  const cancelEditing = () => {
    setDraftLayout(savedLayout);
    setEditMode(false);
    setDraggingId(null);
    scheduleDropIndicator(null);
    setIsLibraryOpen(false);
    setStatusMessage(null);
  };

  const reorderVisibleWidgets = useCallback((startIndex: number, finishIndex: number) => {
    setDraftLayout((prev) => {
      const visible = prev.filter((item) => item.visible).sort((a, b) => a.order - b.order);
      const orderedIds = visible.map((item) => item.id);
      if (
        startIndex < 0 ||
        finishIndex < 0 ||
        startIndex >= orderedIds.length ||
        finishIndex >= orderedIds.length
      ) {
        return prev;
      }

      const nextOrder = reorder({
        list: orderedIds,
        startIndex,
        finishIndex,
      });
      const orderMap = new Map(nextOrder.map((id, index) => [id, index]));
      return prev.map((item) =>
        orderMap.has(item.id) ? { ...item, order: orderMap.get(item.id)! } : item
      );
    });
  }, []);

  const moveWidget = useCallback((widgetId: DashboardWidgetId, direction: "up" | "down") => {
    setDraftLayout((prev) => {
      const visible = prev.filter((item) => item.visible);
      const order = visible.sort((a, b) => a.order - b.order).map((item) => item.id);
      const currentIndex = order.indexOf(widgetId);
      if (currentIndex === -1) return prev;
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= order.length) return prev;
      const nextOrder = [...order];
      nextOrder.splice(currentIndex, 1);
      nextOrder.splice(targetIndex, 0, widgetId);
      const orderMap = new Map(nextOrder.map((id, index) => [id, index]));
      return prev.map((item) =>
        orderMap.has(item.id) ? { ...item, order: orderMap.get(item.id)! } : item
      );
    });
  }, []);

  const handleToggleWidget = (
    widgetId: DashboardWidgetId,
    nextVisible: boolean
  ) => {
    setDraftLayout((prev) => {
      const visibleOrders = prev
        .filter((item) => item.visible)
        .map((item) => item.order);
      const maxOrder = visibleOrders.length
        ? Math.max(...visibleOrders)
        : -1;
      return prev.map((item) => {
        if (item.id !== widgetId) return item;
        return {
          ...item,
          visible: nextVisible,
          order: nextVisible ? maxOrder + 1 : item.order,
        };
      });
    });
  };

  const scheduleDropIndicator = useCallback((next: DropIndicator | null) => {
    if (dropIndicatorRaf.current) {
      cancelAnimationFrame(dropIndicatorRaf.current);
    }
    dropIndicatorRaf.current = requestAnimationFrame(() => {
      dropIndicatorRaf.current = null;
      setDropIndicator((current) => {
        if (current?.id === next?.id && current?.edge === next?.edge) {
          return current;
        }
        return next;
      });
    });
  }, []);

  const flashTile = useCallback((id: DashboardWidgetId) => {
    setFlashId(id);
    if (flashTimeout.current) {
      clearTimeout(flashTimeout.current);
    }
    flashTimeout.current = setTimeout(() => {
      setFlashId(null);
    }, 380);
  }, []);

  const handleDragStart = useCallback((id: DashboardWidgetId) => {
    setDraggingId(id);
  }, []);

  const handleDragClear = useCallback(() => {
    setDraggingId(null);
    scheduleDropIndicator(null);
  }, [scheduleDropIndicator]);

  useEffect(() => {
    if (!editMode) return;
    return monitorForElements({
      canMonitor: ({ source }) => getInstanceId(source.data) === instanceId,
      onDragStart: ({ source }) => {
        const sourceId = getDragId(source.data);
        if (sourceId) {
          setDraggingId(sourceId);
        }
      },
      onDrag: ({ location }) => {
        const target = location.current.dropTargets[0];
        if (!target) {
          scheduleDropIndicator(null);
          return;
        }
        const targetId = getDragId(target.data);
        if (!targetId) {
          scheduleDropIndicator(null);
          return;
        }
        const edge = getClosestEdge(target.element, location.current.input.clientY);
        scheduleDropIndicator({ id: targetId, edge });
      },
      onDrop: ({ location, source }) => {
        scheduleDropIndicator(null);
        setDraggingId(null);

        const target = location.current.dropTargets[0];
        const sourceId = getDragId(source.data);
        if (!target || !sourceId) {
          return;
        }

        const targetId = getDragId(target.data);
        if (!targetId) {
          return;
        }

        const orderedVisibleIds = getVisibleOrder(layoutRef.current);
        const startIndex = orderedVisibleIds.indexOf(sourceId);
        const indexOfTarget = orderedVisibleIds.indexOf(targetId);
        if (startIndex === -1 || indexOfTarget === -1) {
          return;
        }

        const closestEdgeOfTarget = getClosestEdge(
          target.element,
          location.current.input.clientY
        );
        const finishIndex = getReorderIndex(startIndex, indexOfTarget, closestEdgeOfTarget);

        if (finishIndex === startIndex || finishIndex === -1) {
          return;
        }

        reorderVisibleWidgets(startIndex, finishIndex);
        flashTile(sourceId);
      },
    });
  }, [editMode, flashTile, instanceId, reorderVisibleWidgets, scheduleDropIndicator]);

  const handleSave = () => {
    const payload = toPayload(draftLayout);
    startTransition(async () => {
      setStatusMessage(null);
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        setStatusMessage("Sign in to save your layout.");
        return;
      }

      const { error } = await supabase.from("dashboard_layouts").upsert({
        user_id: auth.user.id,
        layout: payload,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        setStatusMessage("We couldn't save your layout. Try again in a moment.");
        return;
      }

      setSavedLayout(payload);
      setEditMode(false);
      setIsLibraryOpen(false);
      setDraggingId(null);
      scheduleDropIndicator(null);
    });
  };

  const handleReset = () => {
    setDraftLayout(DEFAULT_DASHBOARD_LAYOUT);
    setStatusMessage("Layout reset to the default view.");
  };

  return (
    <section className="space-y-6">
      <Shine asChild color="rgba(255,255,255,0.25)" enableOnHover opacity={0.18}>
        <Card className="border border-white/10 bg-[linear-gradient(140deg,rgba(16,21,30,0.98),rgba(10,14,20,0.88))] shadow-[0_30px_80px_rgba(5,10,14,0.5)] backdrop-blur">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Badge className="border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.4em] text-white/70">
                  Dashboard studio
                </Badge>
                {editMode ? (
                  <Badge className="border border-emerald-400/30 bg-emerald-500/20 text-[10px] uppercase tracking-[0.3em] text-emerald-100">
                    Edit mode
                  </Badge>
                ) : null}
              </div>
              {!editMode ? (
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={startEditing}
                >
                  <Settings2 className="size-4" />
                  Customize dashboard
                </Button>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                    onClick={handleReset}
                  >
                    <RotateCcw className="size-4" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                    onClick={cancelEditing}
                  >
                    <X className="size-4" />
                    Discard
                  </Button>
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={handleSave}
                    disabled={!isDirty || isSaving}
                  >
                    <Save className="size-4" />
                    {isSaving ? "Saving..." : "Save layout"}
                  </Button>
                </div>
              )}
            </div>
            {editMode ? (
              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <div className="space-y-3">
                  <CardTitle className="text-2xl text-white sm:text-3xl">
                    Shape the view that keeps your travel momentum alive.
                  </CardTitle>
                  <CardDescription className="text-base text-white/70">
                    Arrange the tiles around what matters most. Edit mode lets you
                    drag and decide which widgets should stay front and center.
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 sm:flex">
                      <GripVertical className="size-3 text-white/70" />
                      Drag tiles to reorder
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 sm:hidden">
                      <ArrowUp className="size-3 text-white/70" />
                      Use arrows in the library to reorder
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      <LayoutGrid className="size-3 text-white/70" />
                      Toggle widgets from the library
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[color:var(--panel-2)]/80 p-4 text-sm text-muted-foreground">
                  <p className="text-xs uppercase tracking-[0.32em] text-white/60">
                    What you can do
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-2">
                      <ArrowUp className="size-4 text-emerald-300" />
                      Prioritize the tiles that keep you moving.
                    </li>
                    <li className="flex items-center gap-2">
                      <LayoutGrid className="size-4 text-sky-300" />
                      Show only the widgets you care about.
                    </li>
                    <li className="flex items-center gap-2">
                      <Plus className="size-4 text-amber-300" />
                      Bring back any widget in one click.
                    </li>
                  </ul>
                </div>
              </div>
            ) : null}
            {editMode ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Editing
                  </span>
                  <span className="hidden sm:inline">
                    Drag tiles or open the widget library.
                  </span>
                  <span className="sm:hidden">
                    Use arrows in the widget library to reorder.
                  </span>
                </div>
                <Sheet open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2 border-white/15 bg-white/10 text-white/80">
                      <LayoutGrid className="size-4" />
                      Widget library
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="min-h-0 gap-0 overflow-y-auto border-white/10 bg-[#0b0f14] text-white sm:max-w-[520px]">
                    <SheetHeader className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0f14]/95 px-4 pt-6 pb-3 backdrop-blur sm:px-6">
                      <SheetTitle>Widget library</SheetTitle>
                      <SheetDescription className="text-white/60">
                        Add or hide tiles to keep the view focused.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 grid gap-4 px-4 pb-6 sm:px-6">
                      {DASHBOARD_WIDGETS.map((widget) => {
                        const layoutItem = layoutById.get(widget.id);
                        const isVisible = layoutItem?.visible ?? true;
                        const isLastVisible = isVisible && visibleLayout.length <= 1;
                        const visibleIndex = visibleLayout.findIndex(
                          (item) => item.id === widget.id
                        );
                        const isFirstVisible = visibleIndex <= 0;
                        const isLastVisibleOrder =
                          visibleIndex === visibleLayout.length - 1;
                        return (
                          <div
                            key={widget.id}
                            className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(22,29,40,0.92),rgba(10,15,20,0.9))] p-4 shadow-[0_18px_45px_rgba(5,10,14,0.35)] sm:p-5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-white">
                                  {widget.title}
                                </p>
                                <p className="text-xs text-white/60">
                                  {widget.description}
                                </p>
                              </div>
                              <Switch
                                checked={isVisible}
                                disabled={isLastVisible}
                                onCheckedChange={(checked) =>
                                  handleToggleWidget(widget.id, checked)
                                }
                              />
                            </div>
                            {!isVisible ? (
                              <p className="mt-4 text-xs text-white/45">
                                Hidden from dashboard. Toggle on to place it.
                              </p>
                            ) : (
                              <div className="mt-4 flex items-center justify-between sm:hidden">
                                <span className="text-[10px] uppercase tracking-[0.32em] text-white/40">
                                  Order
                                </span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                                    onClick={() => moveWidget(widget.id, "up")}
                                    disabled={isFirstVisible || isLastVisible}
                                    aria-label={`Move ${widget.title} up`}
                                  >
                                    <ArrowUp className="size-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                                    onClick={() => moveWidget(widget.id, "down")}
                                    disabled={isLastVisibleOrder || isLastVisible}
                                    aria-label={`Move ${widget.title} down`}
                                  >
                                    <ArrowDown className="size-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            ) : null}
            {statusMessage ? (
              <p className="text-sm text-white/70">{statusMessage}</p>
            ) : null}
          </CardHeader>
        </Card>
      </Shine>

      <div className="grid gap-6 sm:grid-cols-2 lg:auto-rows-[minmax(150px,auto)] lg:grid-cols-12 lg:grid-flow-dense">
        {visibleLayout.map((item) => {
          const node = widgetMap.get(item.id);
          if (!node) return null;
          const isDragging = draggingId === item.id;
          const isFlash = flashId === item.id;
          const isDropTarget = dropIndicator?.id === item.id && draggingId !== item.id;
          const dropEdge = isDropTarget ? dropIndicator?.edge ?? null : null;
          const showDropHint = Boolean(draggingId) && isDropTarget;

          return (
            <DashboardTile
              key={item.id}
              item={item}
              node={node}
              instanceId={instanceId}
              editMode={editMode}
              isDropTarget={isDropTarget}
              dropEdge={dropEdge}
              isDragging={isDragging}
              showDropHint={showDropHint}
              isFlash={isFlash}
              onDragStart={handleDragStart}
              onDragClear={handleDragClear}
            />
          );
        })}
      </div>
    </section>
  );
}
