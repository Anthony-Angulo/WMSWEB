export interface IBarCode {
  CodeBar: string;
  InventorySAPDetail: string;
  ItemCode: string;
  ItemName: string;
  Lote: string;
  Quantity: string;
  created_at: string;
  id: string;
}

export interface IDetail {
  EmployeeName: string;
  InventorySAPRow: string;
  ItemCode: string;
  ItemName: string;
  Quantity: number;
  Zone: string;
  created_at: string;
  id: string;
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
  StatusDisplay: string;
  ClosedDate: string;
  EmployeeName: string;
  EmployeeSAPID: string;
  InvQuantity: number;
  InventorySAPHeader: string;
  ItemCode: string;
  ItemName: string;
  ManejaLote: string;
  Quantity: number;
  Status: string;
  TipoPeso: string;
  UOM: string;
  UomCode1: string;
  UomCode2: string;
  created_at: string;
  id: string;
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
}

export interface IDocument {
  ClosedDate: string;
  EmployeeName: string;
  EmployeeSAPID: string;
  InventoryStatus: string;
  InventoryType: string;
  WarehouseCode: string;
  WarehouseName: string;
  created_at: string;
  id: string;
  Rows: IRow[];
}
