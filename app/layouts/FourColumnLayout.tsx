// src/components/components/FourColumnLayout.tsx (updated interface)
import React from "react";
import GridRenderer from "./GridRenderer";
import { Content, Settings, Area } from "../types"; // Import Area
import { getSettingsClass } from "../utils/settings";

interface FourColumnLayoutProps {
  content: Content;
  settings: Settings;
  areas: Area[]; // Required for layouts
  areaGridColumns?: number;
}

const FourColumnLayout: React.FC<FourColumnLayoutProps> = ({
  content,
  settings,
  areas,
  areaGridColumns = 12,
}) => {
  const settingsClass = getSettingsClass(settings);

  const getAreaSpan = (area: Area): number => area.columnSpan || 3; // Default for 4-col

  return (
    <div
      className={`four-column-layout grid grid-cols-4 gap-4 w-full ${settingsClass}`}
    >
      {areas.map((area, areaIdx) => (
        <div
          key={areaIdx}
          className={`area alias-${area.alias} col-span-${getAreaSpan(area)}`}
        >
          <GridRenderer
            items={area.items}
            gridColumns={areaGridColumns}
            parentContentType="four-column-area"
          />
        </div>
      ))}
    </div>
  );
};

export default FourColumnLayout;
