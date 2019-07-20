export interface Item {
  count: number;
  expanded: any;
  locations: {
    [location: string]: any;
  };
  name: string;
  plural: string;
  pos: Position;
  val: number;
}

interface ExpandedItem {
  name: string;
  count: number;
  dir: string;
  loc: {
    [location: string]: {};
  };
  plural: string;
  totalValue: number;
}

export interface SurroundingsItem {
  name: string;
  count: number;
  expanded: {
    [location: string]: ExpandedItem;
  };
  locations: {
    [location: string]: {};
  };
  plural: string;
}
