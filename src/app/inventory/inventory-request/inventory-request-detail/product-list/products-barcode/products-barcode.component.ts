import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, Subscription } from 'rxjs';
import { ModalService } from 'src/app/common/modal/modal.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
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

  prodInv: any;

  constructor(public modalService: ModalService, private http: HttpClient, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.initProducts();
    this.updateSubscription = this.updateObservable.subscribe(Product => {
      this.ProductDetail = Product;
      Promise.all([
        this.http.get(`${environment.apiCCFN}/inventoryCodeBar/${Product.ID}`).toPromise(),
        this.http.get(`${environment.apiCCFN}/inventoryProduct/find/${Product.InventoryProductID}`).toPromise()
      ]).then(([resp, prod]: [IBarCode, any] ) => {
        this.ProductCodeBar = resp;
        this.prodInv = prod[0];
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
        { cellType: 'button',
          createdCell: (cell: Node, cellData: any, rowData: any, row: number, col: number) => {
            $(cell).text("Eliminar");
            $(cell).addClass('btn btn-danger');

            $(cell).on('click', () => {

              console.log(rowData)  
              console.log(this.ProductDetail)
              console.log(this.prodInv)

              // this.spinner.show(undefined, { fullScreen: true });

              let updateDetail = {
                id: rowData.InventoryProductDetailID,
                quantity: this.ProductDetail.Quantity - rowData.Quantity 
              }

              let updateProd = {
                id: this.ProductDetail.InventoryProductID,
                itemcode: this.prodInv.ItemCode,
                quantity: this.prodInv.Quantity - rowData.Quantity
              }

              Promise.all([
                this.http.delete(`${environment.apiCCFN}/inventoryCodebar/delete/${rowData.ID}`).toPromise(),
                this.http.put(`${environment.apiCCFN}/inventoryDetail`, updateDetail).toPromise(),
                this.http.put(`${environment.apiCCFN}/inventoryProduct`, updateProd).toPromise()
              ]).then(([d, detail, product]:any) =>{
                console.log(detail)
                console.log(product)
              }).catch(async err => {
                console.log(err)
              }).finally(() => {
                window.location.reload()
                this.spinner.hide();
              });

            })
          }, title: 'Accion', data: 'InventoryProductDetailID'}
      ],
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      // rowCallback: (row: Node, data: any | object, index: number) => {
      //   const self = this;
      //   $('td', row).off('click');
      //   $('td', row).on('click', () => {

      //     console.log(this.ProductDetail)
      //     // this.spinner.show(undefined, { fullScreen: true });

      //     // let updateDetail = {
      //     //   id: data.InventoryProductID,
      //     //   quantity: 
      //     // }
      //   });
      //   return row;
      // },
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
