import { Route, Item } from "../index";

export interface ContactUsSection {
  heading: string;
  subHeading: string;
  getInTouchButton: GetInTouchButton[];
  contactListItems: ContactListItems;
  getInTouchButtonText: string;
}

export interface GetInTouchButton {
  url: any;
  queryString: any;
  title: string;
  target: any;
  destinationId: string;
  destinationType: string;
  route: Route;
  linkType: string;
}
export interface ContactListItems {
  gridColumns: number;
  items: Item[];
}
