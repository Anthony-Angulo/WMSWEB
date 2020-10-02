import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, Subscription } from 'rxjs';

import { IRow } from '../models';
import { ModalService } from 'src/app/common/modal/modal.service';

@Component({
  selector: 'app-product-detail-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<ProductListComponent> = new Subject();

  @Input() updateObservable: Observable<IRow[]>;

  private updateSubscription: Subscription;
  ProductsDisplay: IRow[] = [];

  updateSubject: Subject<IRow> = new Subject<IRow>();

  constructor(public modalService: ModalService, ) { }

  ngOnInit(): void {
    this.initProducts();
    this.updateSubscription = this.updateObservable.subscribe(products => {
      this.ProductsDisplay = products;
      this.Update();
    });
  }

  initProducts() {
    this.dtOptions = {
      autoWidth: false,
      ajax: (dataTablesParameters: any, callback) => {
        callback({data: this.ProductsDisplay});
      },
      columns: [
        { title: 'Numero de Articulo', data: 'ItemCode' },
        { title: 'Descripcion del Articulo', data: 'ItemName' },
        { title: 'Cant. Teorica', data: 'InvQuantity' },
        { title: 'Cant. Contada', data: 'Quantity' },
        { title: 'Desviacion', data: 'Deviation' },
        { title: 'UM1', data: 'UomCode1' },
        { title: 'Cant. Teorica2', data: 'InvQuantity2' },
        { title: 'Cant. Contada2', data: 'Quantity2' },
        { title: 'Desviacion2', data: 'Deviation2' },
        { title: 'UM2', data: 'Uom2Display' },
        { title: 'Precio', data: 'Price' },
        { title: 'Total', data: 'Total' },
        { title: 'Moneda', data: 'CurrencyDisplay' },
      ],
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          console.log(data);
          this.updateSubject.next(data);
          this.modalService.open('products-detail-modal');
        });
        return row;
      },
      order: [[0, 'asc']],
      dom: 'ltipr',
      deferRender: true,
    };
  }

  Update() {
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
    this.updateSubscription.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

}
