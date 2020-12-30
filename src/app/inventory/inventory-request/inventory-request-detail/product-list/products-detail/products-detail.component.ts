import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, Subscription } from 'rxjs';
import { ModalService } from 'src/app/common/modal/modal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IRow, IDetail } from '../../models';
import { environment } from 'src/environments/environment';
import { InventoryRequestListComponent } from '../../../inventory-request-list/inventory-request-list.component';

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

  updateSubject: Subject<IRow> = new Subject<IRow>();
  ProductRow: IRow;
  ProductDetail: IDetail;

  constructor(public modalService: ModalService, private http: HttpClient, private spinner: NgxSpinnerService ) { }

  async ngOnInit() {
    this.initProducts();
    this.updateSubscription =  this.updateObservable.subscribe(Product => {
      this.ProductRow = Product;
      this.http.get(`${environment.apiCCFN}/inventoryDetail/${Product.ID}`).toPromise().then((resp: IDetail) => {
        this.ProductDetail = resp;
        this.Update();
      }).catch((err:any) => {
        if(err.status == 404) {
          this.ProductDetail = null
          this.Update();
        }
      });  
    });
    
  }


  initProducts() {
    var contInput = 0
    var conBut = 0    
    this.dtOptions = {
      autoWidth: false,
      ajax: (dataTablesParameters: any, callback) => {
        callback({data: (this.ProductDetail || [])});
      },
      columns: [
        { cellType: 'input',
          createdCell: (cell: Node, cellData: any, rowData: any, row: number, col: number) => {
          $(cell).val(rowData.Quantity);
          $(cell).attr('id','quantity-input[' + contInput + ']');
          contInput = contInput + 1
        }, title: 'Cantidad Unidad Base', data: 'Quantity'},
        { title: 'Encargado', data: 'UserName' },
        { title: 'Zona', data: 'Zone' },
        { title: 'Fecha', data: 'DateCreated' },
        { cellType: 'button',
          createdCell: (cell: Node, cellData: any, rowData: any, row: number, col: number) => {
            $(cell).text("Modificar");
            $(cell).addClass('button');
            $(cell).attr('id',conBut);
            conBut = conBut + 1
            $(cell).on('click', () => {

              var inputValue = (<HTMLInputElement>document.getElementById('quantity-input['+$(cell).attr('id')+']')).value

              if(inputValue == rowData.Quantity) {
                console.log("No hay cambios en la cantidad")
                return
              }

              if(this.ProductRow.NeedBatch == 'Y') {
                console.log("Debes eliminar el lote para productos con lotes");
                return
              }

              this.spinner.show(undefined, { fullScreen: true });

              let updateDetail = {
                id: rowData.ID,
                quantity: inputValue
              }

              let dif = this.ProductRow.Quantity - Number(inputValue)

              let updateProduct = {
                id: rowData.InventoryProductID,
                itemcode: this.ProductRow.ItemCode,
                quantity: dif
              }

              Promise.all([
                this.http.put(`${environment.apiCCFN}/inventoryDetail`, updateDetail).toPromise(),
                this.http.put(`${environment.apiCCFN}/inventoryProduct`, updateProduct).toPromise()
              ]).then(([detail, product]:any) =>{
                console.log(detail)
                console.log(product)
              }).catch(async err => {
                console.log(err)
              }).finally(() => {
                this.spinner.hide();
              });
            }) 
        }, title: 'Accion', data: 'Zone'},
      ],
      
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          console.log(data)
          this.updateSubject.next(data);
          this.modalService.close('products-detail-modal');
          this.modalService.open('products-barcode-modal');
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
