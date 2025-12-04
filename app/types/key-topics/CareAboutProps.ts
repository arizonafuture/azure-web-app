export interface CareAboutProps{
     headline: string;
            description: string;
            keyIndicatorBlock: {
                gridColumns: number;
                items: {
                    content: {
                        id: string;
                        contentType: string;
                        properties: {
                            keyIndicator: string;
                            definition: {
                                markup: string;
                                blocks?: any[];
                            };
                            outcomeCta?: {
                                title?: string;
                                url?: string;
                                target?: string;
                            } | null;
                        };
                    };
                }[];
            };
}