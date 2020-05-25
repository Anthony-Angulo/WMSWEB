import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ModalService } from 'src/app/common/modal/modal.service';
import { environment } from 'src/environments/environment';
import { read, utils} from 'xlsx';

interface WarehouseTSR {
  WhsCode: string;
  WhsCodeTSR: string;
  WhsName: string;
}

interface Product {
  ItemName: string;
  ItemCode: string;
  PesProm: number;
  OnHand: number;
  Quantity: number;
  UOMList: UOMDetail[];
  SelectedUOM: UOMDetail;
}

interface UOMDetail {
  BaseUom: number;
  BaseCode: string;
  UomEntry: number;
  UomCode: string;
  BaseQty: number;
}

@Component({
  selector: 'app-inventory-transfer-request-create',
  templateUrl: './inventory-transfer-request-create.component.html',
  styleUrls: ['./inventory-transfer-request-create.component.scss']
})
export class InventoryTransferRequestCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<InventoryTransferRequestCreateComponent> = new Subject();

  products = [];
  fromWarehouse: WarehouseTSR;
  fromWarehouseList: WarehouseTSR[];
  toWarehouse: WarehouseTSR;
  toWarehouseList: WarehouseTSR[];
  comments = '';

  arrayBuffer: any;
  file: File;

  constructor(private modalService: ModalService,
              private http: HttpClient,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private location: Location) { }

  ngOnInit(): void {
    this.initGeneral();
    this.initProducts();
  }

  initGeneral() {
    this.spinner.show(undefined, { fullScreen: true });
    this.http.get(`${environment.apiSAP}/warehouse/tsr`)
    .toPromise()
    .then((warehouseList: WarehouseTSR[]) => {
      this.toWarehouseList = warehouseList;
      this.toWarehouse = this.toWarehouseList[0];
      this.fromWarehouseList = warehouseList.filter(wh => ['S01', 'S17', 'S35'].includes(wh.WhsCode));
      this.fromWarehouse = this.fromWarehouseList[0];
      this.warehouseChange();
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
        if (this.fromWarehouse) {
          this.http.post(`${environment.apiSAP}/products/search/ToTransferWithStock/${this.fromWarehouse.WhsCode}`, dataTablesParameters)
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
      createdRow: (row: Node, data: any | object, index: number) => {
        if (!data.OnHand || data.OnHand === 0) {
          $('td', row).addClass('bg-danger');
        } else {
          $('td', row).addClass('pointer');
        }
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          if (data.OnHand || data.OnHand !== 0) {
            this.spinner.show(undefined, { fullScreen: true });
            this.selectProduct(data.ItemCode).finally(() => {
              this.closeModal('products-modal');
              this.spinner.hide();
            });
          }
        });
        return row;
      },
      dom: 'ltipr',
      order: [[0, 'asc']],
      deferRender: true,
    };
  }

  selectProduct(ItemCode, quantity?: number) {
    return this.http.get(`${environment.apiSAP}/products/ToTransfer/${ItemCode}/${this.fromWarehouse.WhsCode}`)
      .toPromise()
      .then((product: Product) => {
        // console.log(data)
        product.UOMList = product.UOMList.filter(uom => uom.UomEntry != 7);
        if (product.PesProm != 0 && product.UOMList.length == 1 && product.UOMList[0].BaseUom == 6) {
          const uombox: UOMDetail = {
            BaseCode: 'KG',
            BaseQty: product.PesProm,
            BaseUom: 6,
            UomCode: 'Caja',
            UomEntry: -2
          };
          product.UOMList.push(uombox);
        }
        product.SelectedUOM = product.UOMList[0];
        if (!product.SelectedUOM.BaseCode) {
          this.toastr.error('El Producto no tiene unidad de medida valida');
          return;
        }
        product.Quantity = quantity || 1;
        this.products.push(product);
      }).catch(error => {
        console.error(error);
      });
  }

  createRequest() {

  }

  warehouseChange() {
    this.products = [];
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  removeProduct(index) {
    this.products.splice(index, 1);
  }

  backClicked() {
    this.location.back();
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  upload() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i != data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
      const bstr = arr.join('');
      const workbook = read(bstr, { type: 'binary' });
      let first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      this.processJSON(utils.sheet_to_json(worksheet, { raw: true }));
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  processJSON(data) {
    this.spinner.show(undefined, { fullScreen: true });
    const products = data.filter(p => p.Cantidad != 0).map(d => {
      return this.selectProduct(d.Codigo.trim(), d.Cantidad);
    });

    Promise.all(products).finally(() => {
      this.spinner.hide();
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
