import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { fakeAsync } from '@angular/core/testing';

export interface InvoiceInfo {
  DocNum?: string;
  DocDate?: string;
  CardCode?: string;
  DocCur?: string;
  DocRate?: string;
  DocTotalSy?: string;
  SeriesName?: string;
  CardFName?:string;
  CardName?:string;
}

@Component({
  selector: 'app-invoice-burn',
  templateUrl: './invoice-burn.component.html',
  styleUrls: ['./invoice-burn.component.scss']
})
export class InvoiceBurnComponent implements OnInit {
  
  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,private Toast:ToastrService,private router: Router) { }

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    }
  @ViewChild('Gafete', {static: false}) Gafete:ElementRef;
  @ViewChild('InvoiceInput', {static: false}) InvoiceInput:ElementRef;

  today: string;
  AppInfo;
  InvoiceInfo:InvoiceInfo={}
  checkScanner=true;
  IfGafete=false;
  VerifyGafete(Gafete:string){
    if(Gafete.length!=0)
    this.IfGafete=true
    else
    this.IfGafete=false
  }
  Search(){
    this.spinner.show()
    if(this.InvoiceInfo.DocNum==undefined){
    this.spinner.hide()
    return;    
    }
//    this.AppInfo=JSON.parse(localStorage.getItem("AppInfo"));

    this.http.get(environment.apiSAP+"/Invoice/"+this.InvoiceInfo.DocNum).toPromise().then((data:InvoiceInfo)=>{
      this.InvoiceInfo=data
      console.log(this.InvoiceInfo)

    }).catch((error)=>{
      this.Toast.error(error.error,"Factura no encontrada")
      this.InvoiceInfo={'DocNum':this.InvoiceInfo.DocNum}
      this.InvoiceInput.nativeElement.focus();

    })
    .finally(()=>{
      this.spinner.hide()
    })
    
  }
  CancelClick(){
    this.InvoiceInfo={}
    this.Gafete.nativeElement.focus();

  }
}
