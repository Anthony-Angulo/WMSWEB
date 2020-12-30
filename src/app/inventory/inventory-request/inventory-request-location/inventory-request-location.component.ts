import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { ModalService } from 'src/app/common/modal/modal.service';
import { Location } from '@angular/common';
import { throwError, Subject } from 'rxjs';
import { utils, writeFile } from 'xlsx';
import { env } from 'process';
import { retryWhen } from 'rxjs/operators';

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

  constructor(private http: HttpClient,
    public modalService: ModalService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private router: Router) { }

  async ngOnInit(){

    this.spinner.show(undefined, { fullScreen: true });

    this.initTable(1,'p'); 

    await this.http.get(`${environment.apiCCFN}/inventory/fullInventory`).toPromise().then((resp) => {
      this.inventoryList = resp;
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

    this.http.get(`${environment.apiCCFN}/inventoryDetail/${this.inventorySelected.ID}/${this.zona}`).toPromise().then((rows: any) => {
      const data: any[] = rows.map(row => {
        return {
          Producto: row.ItemName,
          Cantidad: row.Quantity,
          Zona: row.Zone,
          Usuario: row.UserName
        }
      });

      const workbook = utils.book_new();

      data.unshift({
        Producto: 'Nombre de Artiuclo',
        Cantidad: 'Cantidad',
        Zona: 'Zona Donde Fue Escaneado',
        Usuario: 'Persona Que Hizo EL Escaneado'
      });

      const objectMaxLength: number[] = [];
    for (let i = 0; i < data.length; i++) {
      const value = <any[]> Object.values(data[i]);
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
    const worksheet = utils.json_to_sheet(data, {skipHeader: true});
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

}
