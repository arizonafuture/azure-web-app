//  const button = buttonUrl?.[0];
//     const buttonPath = button?.route?.path || button?.url || "#";
//     const buttonTitle = button?.title || "Learn More";

//  buttonUrl: {
//                 url?: string | null;
//                 route?: { path?: string | null } | null;
//                 title?: string;
//             }[];

export const extractInternalLink = (linkArr: any[]) => {
  if (!linkArr || linkArr.length === 0) return { title: "", url: "#" };

  const link = linkArr[0];

  return {
    title: link.title || "",
    url: link.route?.path || "#",
  };
};

export const extractExternalLink = (linkArr: any[]) => {
  if (!linkArr || linkArr.length === 0) return { title: "", url: "#" };

  const link = linkArr[0];

  return {
    title: link.title || "",
    url: link.url || "#",
  };
};
