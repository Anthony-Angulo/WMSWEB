import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { ModalService } from 'src/app/common/modal/modal.service';
import { Subject } from 'rxjs';
import { utils, writeFile } from 'xlsx';

@Component({
  selector: 'app-inventory-request-location',
  templateUrl: './inventory-request-location.component.html',
  styleUrls: ['./inventory-request-location.component.scss']
})
export class InventoryRequestLocationComponent implements OnInit {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<InventoryRequestLocationComponent> = new Subject();

  inventoryList: any;
  inventorySelected: any;
  zona: any;
  Rows: any;
  UOMList = [];

  constructor(private http: HttpClient,
    public modalService: ModalService,
    private spinner: NgxSpinnerService) { }

  async ngOnInit(){

    this.spinner.show(undefined, { fullScreen: true });

    this.initTable(1,'p'); 

    await this.http.get(`${environment.apiCCFN}/inventory`).toPromise().then((resp: any) => {
      this.inventoryList = resp.filter(x => x.statusId == 2);
    }).catch(err => {
      console.log(err)
    }).finally(() => { this.spinner.hide() })

    
  }


  getZoneDetail() {

    this.dtOptions.destroy = true;

    this.dtOptions = {
      destroy: false,
      ajax: (dataTablesParameters: any, callback) => {
        this.http.get(`${environment.apiCCFN}/inventoryDetail/${this.inventorySelected.ID}/${this.zona}`).toPromise().then((data: any[]) => {
          this.afterView();
          callback({ data });
        });
      },
      columns: [{
        title: 'Producto',
        data: 'ItemName'
      }, {
        title: 'Cantidad',
        data: 'Quantity'
      }, {
        title: 'Zona',
        data: 'Zone'
      }, {
        title: 'Usuario',
        data: 'UserName'
      }],
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {

        });
        return row;
      },
      dom: 'ltipr',
      order: [[0, 'asc']],
    };

    this.dtTrigger.next();
    this.afterView();    
  }

  initTable(id, zona) {
    this.dtOptions = {
      // destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.http.get(`${environment.apiCCFN}/inventoryDetail/${id}/${zona}`).toPromise().then((data: any[]) => {
          this.afterView();
          callback({ data });
        });
      },
      columns: [{
        title: 'Producto',
        data: 'ItemName'
      }, {
        title: 'Cantidad',
        data: 'Quantity'
      }, {
        title: 'Zona',
        data: 'Zone'
      }, {
        title: 'Usuario',
        data: 'UserName'
      }],
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {

        });
        return row;
      },
      dom: 'ltipr',
      order: [[1, 'asc']],
    };
  }

  generateExcel() {

    if(this.inventorySelected == undefined || this.zona == undefined) {
      return
    }

    this.spinner.show('Generando Excel', { fullScreen: true });

    Promise.all([
      this.http.get(`${environment.apiCCFN}/inventoryDetail/${this.inventorySelected.ID}/${this.zona}`).toPromise(),
      this.http.get(`${environment.apiSAP}/products/Uoms/`).toPromise(),
    ]).then(([rows, uoms]: any[]) =>{
      this.Rows = rows;
      this.UOMList = uoms;
      const ItemCodes = rows.map(row => row.ItemCode);
      return this.http.post(`${environment.apiSAP}/products/UomDetailWithLastSellPrice`, ItemCodes).toPromise();
    }).then((items: any[]) => {
      this.Rows.forEach(Row => {
        const item = items.find(item => item.ItemCode == Row.ItemCode)
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

        if (Row.IUoMEntry == 185 && Row.NeedBatch == 'Y' && Row.WeightType == 'V') {
          // Carnes
          Row.InvQuantity2 = (Row.InvQuantity / (Row.U_IL_PesProm || 1)).toFixedNumber();
          Row.Quantity2 = (Row.Quantity / Row.U_IL_PesProm).toFixedNumber();
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
        Row.CurrencyDisplay = Row.Currency || 'Precio Invalido';
      });

      console.log(this.Rows)

      const workbook = utils.book_new();
      const rows: any[] = this.Rows.map(Row => {
      return {
        ItemCode: Row.ItemCode,
        ItemName: Row.ItemName,
        Zone: Row.Zone,
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
        User: Row.UserName
      };
    });
    rows.unshift({
      ItemCode: 'Numero de Articulo',
      ItemName: 'Descripcion del Articulo',
      Zone: 'Zona',
      CantTeorica: 'Cant. Teorica',
      CantContada: 'Cant. Contada',
      Desviacion: 'Desviacion',
      UM1: 'UM1',
      CantTeorica2: 'Cant. Teorica2',
      CantContada2: 'Cant. Contada2',
      Desviacion2: 'Desviacion2',
      UM2: 'UM2',
      Precio: 'Precio',
      Total: 'Total Escaneado',
      Moneda: 'Moneda',
      User: 'Usuario de Escaneado'
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
    writeFile(workbook, 'reporte_ubicacion.xlsx');

    }).catch(err => {
      console.log(err)
    }).finally(() => { this.spinner.hide() });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.afterView();
  }

  afterView() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function() {
        const that = this;
        $('input', this.footer()).on('keyup change', function() {
          if (that.search() !== this['value']) {
            that.search(this['value']).draw();
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

//   const data: any[] = rows.map(row => {
//     return {
//       Producto: row.ItemName,
//       Cantidad: row.Quantity,
//       Zona: row.Zone,
//       Usuario: row.UserName
//     }
//   });

//   const workbook = utils.book_new();

//   data.unshift({
//     Producto: 'Nombre de Artiuclo',
//     Cantidad: 'Cantidad',
//     Zona: 'Zona Donde Fue Escaneado',
//     Usuario: 'Persona Que Hizo EL Escaneado'
//   });

//   const objectMaxLength: number[] = [];
// for (let i = 0; i < data.length; i++) {
//   const value = <any[]> Object.values(data[i]);
//   for (let j = 0; j < value.length; j++) {
//     if (typeof value[j] == 'number') {
//       objectMaxLength[j] = 10;
//     } else {
//       if (value[j]) {
//         objectMaxLength[j] =
//           objectMaxLength[j] >= value[j].length
//             ? objectMaxLength[j]
//             : value[j].length;
//       }
//     }
//   }
// }

// const wscols = objectMaxLength.map(length => ({ width: length }));
// const worksheet = utils.json_to_sheet(data, {skipHeader: true});
// worksheet['!cols'] = wscols;

// utils.book_append_sheet(workbook, worksheet, 'tab1');
// writeFile(workbook, 'reporte_ubicacion.xlsx');

}


