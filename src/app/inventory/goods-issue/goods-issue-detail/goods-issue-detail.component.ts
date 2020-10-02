import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

// #TODO: Refactor Api
@Component({
  selector: 'app-goods-issue-detail',
  templateUrl: './goods-issue-detail.component.html',
  styleUrls: ['./goods-issue-detail.component.css']
})
export class GoodsIssueDetailComponent implements OnInit {

  goodsIssue;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private location: Location,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show(undefined, { fullScreen: true });
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.apiSAP}/GoodsIssue/${id}`).toPromise().then((data: any) => {
      this.goodsIssue = data;
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
