import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

interface PurchaseOrder {
  DocEntry: number;
  DocNum: number;
  DocCur: string;
  Total: number;
  DocDate: string;
  DocDueDate: string;
  CancelDate: string;
  DocStatus: string;
  Comments: string;
  CardCode: string;
  CardName: string;
  CardFName: string;
  WhsName: string;
  PurchaseOrderRows: PurchaseOrderRow[];
}

interface PurchaseOrderRow {
  ItemCode: string;
  Dscription: string;
  Price: number;
  Currency: string;
  Quantity: number;
  UomCode: string;
  InvQty: number;
  UomCode2: string;
  Total: number;
}

// TODO: Purchase DeliveryList
@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent implements OnInit {

  purchaseOrder: PurchaseOrder;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private location: Location,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.spinner.show(undefined, { fullScreen: true });
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.apiSAP}/purchaseorder/WMSDetail/${id}`)
      .toPromise()
      .then((purchaseOrder: PurchaseOrder) => this.purchaseOrder = purchaseOrder)
      .catch(error => {
        this.toastr.error(error.error);
        console.error(error);
      }).finally(() => {
        this.spinner.hide();
      });
  }

  backClicked() {
    this.location.back();
  }

}
