import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

interface PurchaseDelivery {
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
  PurchaseDeliveryRows: PurchaseDeliveryRow[];
}

interface PurchaseDeliveryRow {
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

// TODO: Purchase Order Base
@Component({
  selector: 'app-purchase-order-delivery-detail',
  templateUrl: './purchase-order-delivery-detail.component.html',
  styleUrls: ['./purchase-order-delivery-detail.component.scss']
})
export class PurchaseOrderDeliveryDetailComponent implements OnInit {

  purchaseDelivery: PurchaseDelivery;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private location: Location,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.spinner.show(undefined, { fullScreen: true });
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.apiSAP}/purchaseDelivery/WMSDetail/${id}`)
    .toPromise()
    .then((purchaseDelivery: PurchaseDelivery) => this.purchaseDelivery = purchaseDelivery)
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
