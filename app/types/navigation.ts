export interface NavigationResponse {
  total: number;
  items: Item[];
}
export interface Item {
  contentType: string;
  name: string;
  createDate: string;
  updateDate: string;
  route: Route;
  id: string;
  properties: Properties;
}

export interface Route {
  path: string;
  queryString: any;
  startItem: StartItem;
}

export interface StartItem {
  id: string;
  path: string;
}

export interface Properties {
  navigationTitle: string;
  showInNavigation: any;
}
