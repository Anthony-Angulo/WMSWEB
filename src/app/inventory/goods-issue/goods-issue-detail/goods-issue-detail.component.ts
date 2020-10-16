import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-goods-issue-detail',
  templateUrl: './goods-issue-detail.component.html',
  styleUrls: ['./goods-issue-detail.component.scss']
})
export class GoodsIssueDetailComponent implements OnInit {

  goodsIssue;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private toastr: ToastrService,
              private location: Location) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.apiSAP}/GoodsIssue/${id}`).toPromise()
    .then((data: any) => {
      this.goodsIssue = data;
    }).catch(error => {
      this.toastr.error(error);
      console.error(error);
    });
  }

  backClicked() {
    this.location.back();
  }

}
