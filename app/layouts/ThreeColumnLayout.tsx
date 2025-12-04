import React from "react";
import GridRenderer from "./GridRenderer";
import { Content, Settings, Area, Item } from "../types";
import { getSettingsClass } from "../utils/settings";

interface ThreeColumnLayoutProps {
  content: Content;
  settings: Settings;
  areas: Area[];
  areaGridColumns?: number;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  content,
  settings,
  areas,
  areaGridColumns = 12,
}) => {
  const settingsClass = getSettingsClass(settings);

  // Config for 3-column: Even span 4 each (12/3), but use JSON columnSpan
  const getAreaSpan = (area: Area): number => area.columnSpan || 4;

  return (
    <div
      className={`three-column-layout grid grid-cols-3 gap-6 w-full ${settingsClass}`}
    >
      {areas.map((area, areaIdx) => (
        <div
          key={areaIdx}
          className={`area alias-${area.alias} col-span-${getAreaSpan(area)}`}
        >
          <GridRenderer
            items={area.items}
            gridColumns={areaGridColumns}
            parentContentType="three-column-area"
          />
        </div>
      ))}
    </div>
  );
};

export default ThreeColumnLayout;
