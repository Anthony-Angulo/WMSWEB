import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

interface InventoryTransferRequest {
  DocEntry: string;
  DocNum: string;
  DocStatus: string;
  DocDate: string;
  Filler: string;
  ToWhsCode: string;
  InventoryTransferRequestRow: InventoryTransferRequestRow[];
}

interface InventoryTransferRequestRow {
  LineNum: number;
  LineStatus: string;
  ItemCode: string;
  Dscription: string;
  Quantity: number;
  UomCode: string;
}

@Component({
  selector: 'app-inventory-transfer-request-detail',
  templateUrl: './inventory-transfer-request-detail.component.html',
  styleUrls: ['./inventory-transfer-request-detail.component.scss']
})
export class InventoryTransferRequestDetailComponent {

  InventoryTransferRequest: InventoryTransferRequest;
  all = [];

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private location: Location,
              private spinner: NgxSpinnerService) {
    route.params.subscribe(val => {
      this.getdata();
    });
  }

  getdata() {
    this.spinner.show(undefined, { fullScreen: true });
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.apiSAP}/InventoryTransferRequest/Detail/${id}/DocEntry`)
      .toPromise()
      .then((inventoryTransferRequest: any) => {
        console.log(inventoryTransferRequest)
        // const request: InventoryTransferRequest = {
        //   OWTQ: inventoryTransferRequest.OWTQ,
        //   WTQ1: inventoryTransferRequest.WTQ1
        // };

        // if (InventoryTransferRequest.Transfers) {
        //   InventoryTransferRequest.TransfersDetail.forEach(td => {
        //     td.Codes = InventoryTransferRequest.Codes.filter(code => code.ItemCode == td.ItemCode && code.BaseEntry == td.DocEntry);
        //   });
        //   this.all = InventoryTransferRequest.TransfersDetail;
        //   request.Transfers = InventoryTransferRequest.Transfers;
        //   request.Transfers.map(t => {
        //     t.Detail = InventoryTransferRequest.TransfersDetail.filter(td => t.DocEntry == td.DocEntry);
        //   });

        //   if (InventoryTransferRequest.Requests) {
        //     request.Requests = InventoryTransferRequest.Requests;
        //     request.Requests.map(r => {
        //       r.Detail = InventoryTransferRequest.RequestsDetail.filter(rd => r.DocEntry == rd.DocEntry);
        //     });

        //     request.Transfers.map(t => {
        //       t.Request = request.Requests.find(r => {
        //         const detailmatch = t.Detail.map((d, i) => {
        //           try {
        //             if (d.ItemCode == r.Detail[i].ItemCode && d.Quantity == r.Detail[i].Quantity) {
        //               return true;
        //             } else {
        //               return false;
        //             }
        //           } catch (error) {
        //             return false;
        //           }
        //         }).some(result => result);
        //         console.log(detailmatch)
        //         return detailmatch;
        //       });
        //     });

          // }

        // }
        // this.inventoryTransferRequestRow = request;
      }).catch(error => {
        console.log(error);
      }).finally(() => {
        this.spinner.hide();
      });
  }

  // print(transfer) {
  //   console.log(transfer);
  //   const output = {
  //     WHS: transfer.Filler,
  //     Pallet: (transfer.Detail[0].U_Tarima) ? transfer.Detail[0].U_Tarima : '',
  //     Request: this.data.OWTQ.DocNum,
  //     Transfer: transfer.DocNum,
  //     RequestCopy: (transfer.Request) ? transfer.Request.DocNum : ''
  //   };
  //   console.log(output);
  //   // this.http.post(environment.apiSAP + '/TarimaImp', output).toPromise().catch(error => {
  //   //   console.error(error);
  //   // });
  // }

  // openModal(transfer) {
  // }

  backClicked() {
    this.location.back();
  }

}
