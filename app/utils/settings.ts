// src/utils/settings.ts
import { Settings } from "../types/index";

export const getSettingsClass = (settings: Settings | null): string => {
  if (!settings || !settings.properties) return "";
  const props = settings.properties;
  let classes: string[] = [];
  if (props.alignContentLeft) classes.push("align-left");
  if (props.alignContentCenter) classes.push("align-center");
  if (props.alignContentRight) classes.push("align-right");
  if (props.indentTop) classes.push("indent-top");
  if (props.indentBottom) classes.push("indent-bottom");
  if (props.indentSide) classes.push("indent-side");
  if (props.cssStyles) classes.push(props.cssStyles);
  if (props.additionalParameters && Array.isArray(props.additionalParameters)) {
    classes.push(...props.additionalParameters);
  }
  return classes.join(" ");
};
