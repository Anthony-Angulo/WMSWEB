import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { utils, writeFile } from 'xlsx';

import { IBarCode, IDetail, IDocument, IRow } from './models';

@Component({
  selector: 'app-inventory-request-detail',
  templateUrl: './inventory-request-detail.component.html',
  styleUrls: ['./inventory-request-detail.component.scss']
})
export class InventoryRequestDetailComponent implements OnInit {

  UserCanClose = false;
  Document: IDocument;
  UOMList = [];
  ProductsDisplay: IRow[] = [];

  PropertyList = [
    {id: -1, label: 'Todos' },
    {id: 5, label: 'ABARROTES' },
    {id: 6, label: 'LACTEOS' },
    {id: 7, label: 'CARNES' },
    {id: 8, label: 'FRUTAS Y VERDURAS' },
    {id: 39, label: 'CONSUMO INTERNO' },
  ];

  PropertySelected = this.PropertyList[0];

  updateSubject: Subject<IRow[]> = new Subject<IRow[]>();

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private location: Location) { }

  ngOnInit(): void {
    this.spinner.show(undefined, { fullScreen: true });
    const id = this.route.snapshot.paramMap.get('id');
    Promise.all([
      this.http.get(`${environment.apiWMS}/getInventoryRequestSAPDetail/${id}`).toPromise(),
      this.http.get(`${environment.apiSAP}/products/Uoms/`).toPromise(),
    ]).then(([data, uoms]: any[]) => {

      this.UOMList = uoms;

      const BarcodesList: IBarCode[] = data.codes;
      const DetailList: IDetail[] = data.details;
      const Rows: IRow[] = data.rows;
      const Header: IDocument = data.order;

      if (BarcodesList.length != 0) {
        DetailList.forEach(Detail => {
          Detail.BarCodes = BarcodesList.filter(BarCode => BarCode.InventorySAPDetail == Detail.id);
        });
      }

      if (DetailList.length != 0) {
        Rows.forEach(Row => {
          Row.Detail = DetailList.filter(Detail => Detail.InventorySAPRow == Row.id);
          Row.Detail.forEach(Detail => Detail.Quantity = Number(Detail.Quantity));
          if (Row.Quantity == null) {
            Row.Quantity = Row.Detail
              .map(detail => Number(detail.Quantity))
              .reduce((a, b) => (a + b), 0).toFixedNumber();
          } else {
            Row.Quantity = Number(Row.Quantity).toFixedNumber();
          }
        });
      }

      const output = Rows.map(row => row.ItemCode);

      Header.Rows = Rows;
      this.Document = Header;
      this.UserCanClose = Rows.length != 0 && Header.InventoryStatus == '1';

      return this.http.post(`${environment.apiSAP}/products/UomDetailWithLastSellPrice`, output).toPromise();

    }).then((items: any[]) => {

      this.Document.Rows.forEach(Row => {
        Row.WarehouseCode = this.Document.WarehouseCode;
        const item = items.find(item => item.ItemCode == Row.ItemCode);
        Row = Object.assign(Row, item);
        const Uom1 = this.UOMList.find(uom => uom.UomEntry == Row.IUoMEntry);
        const Uom2 = this.UOMList.find(uom => uom.UomEntry == Row.SUoMEntry);
        if (Uom1 && Uom1.UomCode) {
          Row.UomCode1 = Uom1.UomCode;
        } else {
          Row.UomCode1 = 'Error Codigo de Unidad de Medida';
        }
        if (Uom2 && Uom2.UomCode) {
          Row.UomCode2 = Uom2.UomCode;
        } else {
          Row.UomCode2 = 'Error Codigo de Unidad de Medida';
        }

        Row.InvQuantity = Number(Row.InvQuantity);
        Row.Deviation = (Row.Quantity - Row.InvQuantity).toFixedNumber();


        if (Row.IUoMEntry == 185 && Row.ManejaLote == 'Y' && Row.TipoPeso == 'V') {
          // Carnes
          Row.InvQuantity2 = (Row.InvQuantity / (Row.U_IL_PesProm || 1)).toFixedNumber();
          Row.Quantity2 = Row.Detail.map(Detail => Detail.BarCodes.length).reduce((a, b) => a + b, 0).toFixedNumber();
          Row.Deviation2 = (Row.Quantity2 - (Row.InvQuantity / (Row.U_IL_PesProm || 1))).toFixedNumber();
          Row.Uom2Display = 'Caja';
        } else {
          // Abarrotes
          Row.InvQuantity2 = (Row.InvQuantity / Row.NumInSale).toFixedNumber();
          Row.Quantity2 = (Row.Quantity / Row.NumInSale).toFixedNumber();
          Row.Deviation2 = ((Row.Quantity - Row.InvQuantity) / Row.NumInSale).toFixedNumber();
          Row.Uom2Display = Row.UomCode2;
        }

        Row.Price = Row.Price || 0;
        Row.Total = (Row.Price * Row.Quantity).toFixedNumber();
        Row.CurrencyDisplay = Row.Currency || 'Precio Invalido',
        Row.StatusDisplay = (Row.Status == '0') ? 'Abierto' : 'Cerrado';

      });

      this.ProductsDisplay = this.Document.Rows;
      this.updateSubject.next(this.ProductsDisplay);

    }).catch(error => {
      console.error(error);
    }).finally(() => {
      console.log(this.Document);
      this.spinner.hide();
    });
  }

  propertyChange() {
    if (this.PropertySelected.id == -1) {
      this.ProductsDisplay = this.Document.Rows;
    } else {
      this.ProductsDisplay = this.Document.Rows.filter(p => p[`QryGroup${this.PropertySelected.id}`] == 'Y');
    }
    this.updateSubject.next(this.ProductsDisplay);
  }

  download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  generateTxt() {
    const lines = [];
    this.Document.Rows.forEach(Row => {
      Row.Detail.forEach(Detail => {
        if (Detail.Quantity) {
          const line = [Detail.ItemCode.substring(1), Detail.Quantity];

          if (Row.IUoMEntry == 185 && Row.ManejaLote == 'Y' && Row.TipoPeso == 'V') {
            line.push(Detail.Quantity);
          } else {
            line.push((Detail.Quantity / Row.NumInSale).toFixed(2));
          }
          line.push(Detail.EmployeeName.replace(/ /g, '').substr(0, 15));
          lines.push(line.join('|'));
        }
      });
    });
    this.download('inven.txt', lines.join('\n'));
  }

  generateExcel() {
    const workbook = utils.book_new();
    const rows: any[] = this.Document.Rows.map(Row => {
      return {
        Almacen: Row.WarehouseCode,
        ItemCode: Row.ItemCode,
        ItemName: Row.ItemName,
        CantTeorica: Row.InvQuantity,
        CantContada: Row.Quantity,
        Desviacion: Row.Deviation,
        UM1: Row.UomCode1,
        CantTeorica2: Row.InvQuantity2,
        CantContada2: Row.Quantity2,
        Desviacion2: Row.Deviation2,
        UM2: Row.Uom2Display,
        Precio: Row.Price,
        Total: Row.Total,
        Moneda: Row.Currency,
        Cerrado: Row.StatusDisplay,
      };
    });
    rows.unshift({
      Almacen: 'Almacen',
      ItemCode: 'Numero de Articulo',
      ItemName: 'Descripcion del Articulo',
      CantTeorica: 'Cant. Teorica',
      CantContada: 'Cant. Contada',
      Desviacion: 'Desviacion',
      UM1: 'UM1',
      CantTeorica2: 'Cant. Teorica2',
      CantContada2: 'Cant. Contada2',
      Desviacion2: 'Desviacion2',
      UM2: 'UM2',
      Precio: 'Precio',
      Total: 'Total',
      Moneda: 'Moneda',
      Cerrado: 'Cerrado',
    });

    const objectMaxLength: number[] = [];
    for (let i = 0; i < rows.length; i++) {
      const value = <any[]> Object.values(rows[i]);
      for (let j = 0; j < value.length; j++) {
        if (typeof value[j] == 'number') {
          objectMaxLength[j] = 10;
        } else {
          if (value[j]) {
            objectMaxLength[j] =
              objectMaxLength[j] >= value[j].length
                ? objectMaxLength[j]
                : value[j].length;
          }
        }
      }
    }

    const wscols = objectMaxLength.map(length => ({ width: length }));
    const worksheet = utils.json_to_sheet(rows, {skipHeader: true});
    worksheet['!cols'] = wscols;

    utils.book_append_sheet(workbook, worksheet, 'tab1');
    writeFile(workbook, 'excel_export.xlsx');
  }

  backClicked() {
    this.location.back();
  }

}
