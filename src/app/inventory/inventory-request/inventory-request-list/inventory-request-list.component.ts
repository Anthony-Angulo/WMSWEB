import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-request-list',
  templateUrl: './inventory-request-list.component.html',
  styleUrls: ['./inventory-request-list.component.scss']
})
export class InventoryRequestListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<InventoryRequestListComponent> = new Subject();

  inventoryRequestList = [];

  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit() {
    this.initTable();
  }

  initTable() {
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        this.http.get(`${environment.apiWMS}/getInventoryRequestSAP`).toPromise().then((data: any[]) => {
          this.afterView();
          data.forEach(element => {
            element.InventoryStatus = (element.InventoryStatus == 0) ? 'Creado' : (element.InventoryStatus == 1) ? 'Abierto' : 'Cerrado';
            element.InventoryType = (element.InventoryType == 0) ? 'Parcial' : 'Completo';
          });
          callback({ data });
        });
      },
      columns: [{
        title: 'Codigo',
        data: 'id'
      }, {
        title: 'Tipo',
        data: 'InventoryType'
      }, {
        title: 'Status',
        data: 'InventoryStatus'
      }, {
        title: 'Sucursal',
        data: 'WarehouseName'
      }, {
        title: 'Encargado',
        data: 'EmployeeName',
      }, {
        title: 'Fecha de Creacion',
        data: 'created_at'
      }],
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.router.navigate(['/Inventory/InventoryRequest', data.id]);
        });
        return row;
      },
      dom: 'ltipr',
      order: [[0, 'desc']],
    };
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
