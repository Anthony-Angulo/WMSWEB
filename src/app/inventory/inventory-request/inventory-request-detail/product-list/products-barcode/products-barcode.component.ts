import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, Subscription } from 'rxjs';
import { ModalService } from 'src/app/common/modal/modal.service';
import { environment } from 'src/environments/environment';
import { IBarCode, IDetail } from '../../models';

@Component({
  selector: 'app-products-barcode',
  templateUrl: './products-barcode.component.html',
  styleUrls: ['./products-barcode.component.css']
})
export class ProductsBarcodeComponent implements OnInit {

  
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<ProductsBarcodeComponent> = new Subject();

  @Input() updateObservable: Observable<IDetail>;

  private updateSubscription: Subscription;

  updateSubject: Subject<IDetail> = new Subject<IDetail>();
  ProductDetail: IDetail;
  ProductCodeBar: IBarCode;

  constructor(public modalService: ModalService, private http: HttpClient) { }

  ngOnInit(): void {
    this.initProducts();
    this.updateSubscription = this.updateObservable.subscribe(Product => {
      this.ProductDetail = Product;
      this.http.get(`${environment.apiCCFN}/inventoryCodeBar/${Product.ID}`).toPromise().then((resp: IBarCode) => {
        this.ProductCodeBar = resp;
        this.Update();
      }).catch((err:any) => {
        if(err.status == 404) {
          this.ProductCodeBar = null
          this.Update();
        }
      });
    });
  }

  initProducts() {
    this.dtOptions = {
      autoWidth: false,
      ajax: (dataTablesParameters: any, callback) => {
        callback({data: (this.ProductCodeBar || [])});
      },
      columns: [
        { title: 'Codigo De Barra', data: 'CodeBar' },
        { title: 'Lote', data: 'Batch' },
        { title: 'Cantidad', data: 'Quantity' },
        { title: 'Fecha', data: 'DateCreated' },
      ],
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          // this.updateSubject.next(data);
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
