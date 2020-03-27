import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

interface Order {
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
  SlpName: string;
  SlpCode: number;
  Address: string;
  Address2: string;
  PymntGroup: string;
  OrderRows: OrderRow[];
}

interface OrderRow {
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

// TODO: DeliveryList
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  order: Order;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private location: Location,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show(undefined, { fullScreen: true });
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.apiSAP}/order/WMSDetail/${id}`)
    .toPromise()
    .then((order: Order) => this.order = order)
    .catch(error => {
      console.error(error);
    }).finally(() => {
      this.spinner.hide();
    });
  }

  backClicked() {
    this.location.back();
  }

}
