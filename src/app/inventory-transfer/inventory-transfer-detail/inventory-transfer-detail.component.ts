import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

interface Transfer {
  DocEntry: number;
  DocNum: number;
  DocDate: string;
  CancelDate: string;
  DocDueDate: string;
  Comments: string;
  Filler: string;
  ToWhsCode: string;
  TransferRows: TransferRow[];
}

interface TransferRow {
  ItemCode: string;
  Dscription: string;
  Quantity: number;
  UomCode: string;
  InvQty: number;
  UomCode2: string;
}

// TODO: Document Base
@Component({
  selector: 'app-inventory-transfer-detail',
  templateUrl: './inventory-transfer-detail.component.html',
  styleUrls: ['./inventory-transfer-detail.component.scss']
})
export class InventoryTransferDetailComponent implements OnInit {

  transfer: Transfer;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private location: Location,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show(undefined, { fullScreen: true });
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.apiSAP}/InventoryTransfer/WMSDetail/${id}`)
    .toPromise()
    .then((transfer: Transfer) => this.transfer = transfer)
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
