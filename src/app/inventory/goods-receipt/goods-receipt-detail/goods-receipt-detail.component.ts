import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-goods-receipt-detail',
  templateUrl: './goods-receipt-detail.component.html',
  styleUrls: ['./goods-receipt-detail.component.scss']
})
export class GoodsReceiptDetailComponent implements OnInit {

  goodsReceipt;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private toastr: ToastrService,
              private location: Location) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.apiSAP}/GoodsReceipt/${id}`).toPromise().then((data: any) => {
      this.goodsReceipt = data;
    }).catch(error => {
      this.toastr.error(error);
      console.error(error);
    });
  }

  backClicked() {
    this.location.back();
  }

}
