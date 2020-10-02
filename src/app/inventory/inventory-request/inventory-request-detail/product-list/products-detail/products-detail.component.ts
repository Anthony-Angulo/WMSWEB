import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, Subscription } from 'rxjs';
import { ModalService } from 'src/app/common/modal/modal.service';

import { IRow } from '../../models';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.css']
})
export class ProductsDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<ProductsDetailComponent> = new Subject();

  @Input() updateObservable: Observable<IRow>;

  private updateSubscription: Subscription;
  Product: IRow;

  constructor(public modalService: ModalService, ) { }

  ngOnInit(): void {
    this.initProducts();
    this.updateSubscription = this.updateObservable.subscribe(Product => {
      console.log(Product)
      this.Product = Product;
      this.Update();
    });
  }

  initProducts() {
    this.dtOptions = {
      autoWidth: false,
      ajax: (dataTablesParameters: any, callback) => {
        callback({data: (this.Product?.Detail || [])});
      },
      columns: [
        { title: 'Numero de Articulo', data: 'ItemCode' },
        { title: 'Descripcion del Articulo', data: 'ItemName' },
        { title: 'Encargado', data: 'EmployeeName' },
        { title: 'Zona', data: 'Zone' },
        { title: 'Fecha', data: 'created_at' },
      ],
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          // this.modalService.open('products-detail-modal');
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
