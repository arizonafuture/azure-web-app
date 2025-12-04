import React from "react";
import GridRenderer from "./GridRenderer";
import { Content, Settings, Area, Item } from "../types";
import { getSettingsClass } from "../utils/settings";

interface RowLayoutProps {
  content: Content;
  settings: Settings;
  areas: Area[];
  areaGridColumns?: number;
}

const RowLayout: React.FC<RowLayoutProps> = ({
  content,
  settings,
  areas,
  areaGridColumns = 12,
}) => {
  const settingsClass = getSettingsClass(settings);

  // Config for row: Horizontal flex (not grid), even distribution
  const getAreaSpan = (area: Area): number =>
    area.columnSpan || Math.floor(12 / areas.length); // Dynamic even span

  return (
    <div className={`row-layout flex flex-row gap-4 w-full ${settingsClass}`}>
      {areas.map((area, areaIdx) => (
        <div
          key={areaIdx}
          className={`area alias-${area.alias} flex-1 min-w-0`} // Flex-grow, even distribution
          style={{ flexBasis: `${(getAreaSpan(area) / 12) * 100}%` }} // CSS for span (fallback to flex)
        >
          <GridRenderer
            items={area.items}
            gridColumns={areaGridColumns}
            parentContentType="row-area"
          />
        </div>
      ))}
    </div>
  );
};

export default RowLayout;
