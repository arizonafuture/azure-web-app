import React from "react";
import GridRenderer from "./GridRenderer"; // Import for sub-areas
import { Content, Settings, Area, Item } from "../types";
import { getSettingsClass } from "../utils/settings"; // Shared util; adjust path

interface TwoColumnLayoutProps {
  content: Content;
  settings: Settings;
  areas: Area[]; // Passed from parent (JSON areas)
  areaGridColumns?: number; // From JSON item.areaGridColumns
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  content,
  settings,
  areas,
  areaGridColumns = 12,
}) => {
  const settingsClass = getSettingsClass(settings);

  // Config for 2-column: Even span 6 each (12/2), but use JSON columnSpan if provided
  const getAreaSpan = (area: Area): number => area.columnSpan || 6; // Default 6 for 2-col

  return (
    <div
      className={`two-column-layout grid grid-cols-2 gap-6 w-full ${settingsClass}`}
    >
      {areas.map((area, areaIdx) => (
        <div
          key={areaIdx}
          className={`area alias-${area.alias} col-span-${getAreaSpan(area)}`}
        >
          <GridRenderer
            items={area.items}
            gridColumns={areaGridColumns}
            parentContentType="two-column-area" // For nested styling
          />
        </div>
      ))}
    </div>
  );
};

export default TwoColumnLayout;
