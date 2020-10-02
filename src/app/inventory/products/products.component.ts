import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

interface Warehouse {
  WhsCode: string;
  WhsName: number;
}

interface Property {
  ItmsTypCod: string;
  ItmsGrpNam: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy, AfterViewInit  {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<ProductsComponent> = new Subject();

  warehouseList: Warehouse[] = [];
  warehouseSelected: Warehouse;

  propertyList: Property[] = [];
  propertySelected: Property;

  constructor(private spinner: NgxSpinnerService, private http: HttpClient) { }

  ngOnInit(): void {
    this.initGeneral();
    this.initProducts();
  }

  initGeneral() {
    this.spinner.show(undefined, { fullScreen: true });
    Promise.all([
      this.http.get(`${environment.apiSAP}/warehouse`).toPromise(),
      this.http.get(`${environment.apiSAP}/products/properties`).toPromise(),
    ]).then(([warehouse, properties]: any[]) => {

      this.warehouseList = warehouse;
      this.warehouseSelected = this.warehouseList[0];

      this.propertyList = properties.filter(p => [5, 6, 7, 8].includes(p.ItmsTypCod));
      this.propertyList.push({
        ItmsTypCod: '-1',
        ItmsGrpNam: 'Todos'
      });
      this.propertySelected = this.propertyList[0];

      this.filterChange();
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      this.spinner.hide();
    });
  }

  initProducts() {
    this.dtOptions = {
      processing: true,
      serverSide: true,
      searchDelay: 500,
      autoWidth: false,
      ajax: (dataTablesParameters: any, callback) => {
        if (this.warehouseSelected && this.propertySelected) {
          const url = `${environment.apiSAP}/products/search/${this.warehouseSelected.WhsCode}/${this.propertySelected.ItmsTypCod}`;
          this.http.post(url, dataTablesParameters)
            .toPromise()
            .then(data => callback(data));
        }
      },
      columns: [
        { title: 'Codigo', data: 'ItemCode' },
        { title: 'Producto', data: 'ItemName' },
        { title: 'Stock', data: 'OnHand' },
      ],
      language: {
        zeroRecords: 'No se Encontraron Productos',
        processing: 'Procesando...'
      },
      dom: 'lBtipr',
      order: [[0, 'asc']],
      deferRender: true,
      // lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']],
    };
  }

  filterChange() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
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
