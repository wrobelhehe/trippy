"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HighlightsEditor({
  value,
  onChange,
}: {
  value?: string[];
  onChange?: (items: string[]) => void;
}) {
  const initial = useMemo(() => {
    if (value && value.length >= 3) {
      return value;
    }

    return ["", "", ""];
  }, [value]);
  const [items, setItems] = useState<string[]>(initial);

  const updateItems = (nextItems: string[]) => {
    setItems(nextItems);
    onChange?.(nextItems);
  };

  const updateItem = (index: number, nextValue: string) => {
    const nextItems = [...items];
    nextItems[index] = nextValue;
    updateItems(nextItems);
  };

  const addItem = () => {
    if (items.length >= 7) return;
    updateItems([...items, ""]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 3) return;
    const nextItems = items.filter((_, itemIndex) => itemIndex !== index);
    updateItems(nextItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Trip highlights</Label>
        <span className="text-xs text-muted-foreground">
          {items.length}/7 highlights
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${index}-${item}`} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={`Highlight ${index + 1}`}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={items.length <= 3}
            >
              -
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={addItem} disabled={items.length >= 7}>
        Add highlight
      </Button>
    </div>
  );
}