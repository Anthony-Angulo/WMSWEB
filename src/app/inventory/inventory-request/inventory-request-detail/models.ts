export interface IBarCode {
  CodeBar: string;
  InventoryProductDetailID: string;
  Batch: string;
  Quantity: string;
  DateCreated: string;
  ID: string;
}

export interface IDetail {
  UserId: string;
  InventoryProductID: string;
  Quantity: number;
  Zone: string;
  DateCreated: string;
  ID: string;
  BarCodes: IBarCode[];
}

export interface IRow {
  Quantity2: number;
  Deviation: number;
  InvQuantity2: number;
  Deviation2: number;
  Uom2Display: string;
  Total: number;
  CurrencyDisplay: string;
  EmployeeName: string;
  UserId: string;
  InvQuantity: number;
  InventoryID: string;
  ItemCode: string;
  ItemName: string;
  NeedBatch: string;
  Quantity: number;
  updatedQty: number;
  Status: string;
  WeightType: string;
  UOM: string;
  UomCode1: string;
  UomCode2: string;
  created_at: string;
  ID: string;
  Currency: string;
  IUoMEntry: number;
  NumInSale: number;
  Price: number;
  QryGroup5: string;
  QryGroup6: string;
  QryGroup7: string;
  QryGroup8: string;
  QryGroup39: string;
  SUoMEntry: number;
  U_IL_PesProm: number;
  WarehouseCode: string;
  Detail: IDetail[];
  cajas: number;
}


export interface IDocument {
  DateCreated: string;
  Name: string;
  Status: string;
  StatusId: number;
  Label: string;
  WhsName: string;
  WhsCode: string;
  ID: string;
  Rows: IRow[];
}
