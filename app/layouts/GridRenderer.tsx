import React from "react";
import ContentRenderer from "./ContentRenderer";
import { Item, Settings, GridRendererProps, Area } from "../types"; // Import Area for item.areas typing
import { getSettingsClass } from "../utils/settings";

const GridRenderer: React.FC<GridRendererProps> = ({
  items,
  gridColumns = 12,
  parentContentType = "",
}) => {
  if (!items || items.length === 0) return null;
  return items.map((item, idx) => {
    const settingsClass = getSettingsClass(item.settings);
    const itemClass = `grid-item row-span-${item.rowSpan || 1} col-span-${
      item.columnSpan || 12
    } ${settingsClass}`;
    // Simple content: Unchanged
    return <ContentRenderer content={item.content} settings={item.settings} />;
  });
};

export default GridRenderer;
