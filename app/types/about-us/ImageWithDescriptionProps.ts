import { MediaItem } from "..";

export interface ImageWithDescriptionProps{
     headLine: string;
            imageSide?: string | null; // "Left" or "Right"
            image?:MediaItem[];
            description?: {
               markup: any;
            };
}