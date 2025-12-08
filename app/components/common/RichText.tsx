"use client";

import { cleanRichText } from "@/app/utils/extractRichText";
import parse from "html-react-parser";

export default function RichText({
    html,
    className = "",
}: {
    html: string;
    className?: string;
}) {
    const sanitized = cleanRichText(html);

    return (
        <div
            className={`
        ${className}

        /* Tailwind list styling inline */
        [&_ul]:list-disc
        [&_ul]:ml-6
        [&_ul]:mb-4
        [&_ol]:list-decimal
        [&_ol]:ml-6
        [&_ol]:mb-4
        [&_li]:mb-2
      `}
        >
            {parse(sanitized)}
        </div>
    );
}
