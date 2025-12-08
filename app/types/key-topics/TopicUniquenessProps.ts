export interface TopicUniquenessProps{
  heading: string;
            description: string;
            block: {
                gridColumns: number;
                items: {
                    content: {
                        id: string;
                        contentType: string;
                        properties: {
                            headline: string;
                            text?: any;
                            image: {
                                url: string;
                                name: string;
                            }[];
                        };
                    };
                }[];
            };
}