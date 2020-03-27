import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

// #TODO: Refactor and Document Origin
@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.scss']
})
export class DeliveryDetailComponent implements OnInit {

  delivery;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private location: Location,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show(undefined, { fullScreen: true });
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.apiSAP}/delivery/Detail/${id}`).toPromise().then((data: any) => {
      this.delivery = data;
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      this.spinner.hide();
    });
  }

  backClicked() {
    this.location.back();
  }
}
