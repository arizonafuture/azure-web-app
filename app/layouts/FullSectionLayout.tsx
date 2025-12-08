import React from "react";
import GridRenderer from "./GridRenderer";
import { Content, Settings, Area, Item } from "../types";
import { getSettingsClass } from "../utils/settings";

interface FullSectionLayoutProps {
  content: Content;
  settings: Settings;
  areas: Area[];
  areaGridColumns?: number;
}

const FullSectionLayout: React.FC<FullSectionLayoutProps> = ({
  content,
  settings,
  areas,
  areaGridColumns = 12,
}) => {
  const settingsClass = getSettingsClass(settings);

  // Config for full-section: Single full-width area (span 12)
  const getAreaSpan = (area: Area): number => area.columnSpan || 12;

  return (
    <div
      className={`full-section-layout grid grid-cols-1 gap-0 w-full ${settingsClass}`}
    >
      {areas.map((area, areaIdx) => (
        <div
          key={areaIdx}
          className={`area alias-${area.alias} col-span-${getAreaSpan(area)}`}
        >
          <GridRenderer
            items={area.items}
            gridColumns={areaGridColumns}
            parentContentType="full-section-area"
          />
        </div>
      ))}
    </div>
  );
};

export default FullSectionLayout;
