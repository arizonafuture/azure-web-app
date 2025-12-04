import { Item, MediaItem } from "..";

export interface WhatYouWillFindProps {
     heading: string;
                subHeadline: string;
                description: string;
                backgroundImages?: MediaItem[];
                cards?: {
                    gridColumns: number;
                    items: Item[];
                };
}