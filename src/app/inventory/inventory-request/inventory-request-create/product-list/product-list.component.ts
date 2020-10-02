import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject<ProductListComponent> = new Subject();

  @Input() updateObservable: Observable<any[]>;

  @Output() productSelected = new EventEmitter();

  private updateSubscription: Subscription;
  products = [];

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initProducts();
    this.updateSubscription = this.updateObservable.subscribe(products => {
      this.products = products;
      this.Update();
    });
  }

  initProducts() {
    this.dtOptions = {
      autoWidth: false,
      ajax: (dataTablesParameters: any, callback) => {
        callback({data: this.products});
      },
      columns: [{
        title: 'Selection',
        data: '_'
      }, {
        title: 'Codigo de Producto',
        data: 'ItemCode'
      }, {
        title: 'Nombre de Producto',
        data: 'ItemName'
      }],
      columnDefs: [{
        orderable: false,
        className: 'select-checkbox',
        targets:   0,
        render: (data, type, row) => {
          return '';
        },
      }, ],
      select: {
        style:    'multi',
        selector: 'td:first-child'
      },
      dom: 'ltipr',
      deferRender: true,
    };
  }

  Update() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  SelectProducts() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const indexes = dtInstance.rows({ selected: true}).indexes().toArray();
      if (indexes.length == 0) {
        this.toastr.warning('No tiene ningun producto seleccionado');
        return;
      }
      this.productSelected.emit(indexes);
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
