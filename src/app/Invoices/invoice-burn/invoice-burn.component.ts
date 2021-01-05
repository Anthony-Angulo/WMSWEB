import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Time } from '@angular/common';

export interface InvoiceInfo {
  DocNum?: string;
  DocDate?: string;
  CardCode?: string;
  DocCur?: string;
  DocRate?: string;
  DocTotalSy?: string;
  Series?: string;
  CardFName?:string;
  CardName?:string;
  CodBar?:string;
}
export interface InvoiceGet{
  DocEntry?: string;
  UserName?: string;
  DocNum?: string;
  DateBurn?:Date
  Time?:Time
  FormatedDate?:string
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
    this.AppInfo=JSON.parse(localStorage.getItem('AppInfo')) 
    this.p= document.getElementById("info");
 
  }
    @ViewChild('Gafete', {static: false}) Gafete:ElementRef;
    @ViewChild('InvoiceInput', {static: false}) InvoiceInput:ElementRef;
    today: string;
    AppInfo;
    InvoiceInfo:InvoiceInfo={}
    InvoiceBurn:InvoiceGet={UserName:"Usuario",FormatedDate:"", Time:{hours:0,minutes:0}}
    checkScanner=true;
    IfGafete=false;
    InfoFacture=""
     p 
  VerifyGafete(Gafete:string){
    if(Gafete.length!=0)
    this.IfGafete=true
    else
    this.IfGafete=false
  }
  
 async SearchinCCFN(){
    var result=true
    await this.http.get(environment.apiCCFN+"/Invoice/"+this.InvoiceInfo.DocNum).toPromise().then((data)=>{
      this.InvoiceBurn=data[0]
      this.InvoiceBurn.DateBurn=new Date(this.InvoiceBurn.DateBurn)
      this.InvoiceBurn.Time={hours:this.InvoiceBurn.DateBurn.getHours(),minutes:this.InvoiceBurn.DateBurn.getMinutes()}
      this.InvoiceBurn.FormatedDate=this.InvoiceBurn.DateBurn.getFullYear() +"-"+ this.InvoiceBurn.DateBurn.getMonth()+1+"-"+ this.InvoiceBurn.DateBurn.getDate()
      result= false
      this.p.innerHTML="Esta factura ya se encuentra quemada"
    }).catch((error)=>{
      result= true
      this.p.innerHTML="Factura libre para quemar"

    })
    return result;
  }
  async Search(){
    this.spinner.show()
    if(!await this.SearchinCCFN()){
      this.Toast.warning("Esta factura ya fue quemada","Factura ya quemada")
      this.InvoiceInfo={'DocNum':this.InvoiceInfo.DocNum}
      this.InvoiceInput.nativeElement.focus();
      return;
    }
    this.InvoiceBurn={UserName:"Usuario",FormatedDate:"", Time:{hours:0,minutes:0}}
    if(this.InvoiceInfo.DocNum==undefined){
    this.spinner.hide()
    return;    
    }
    let user=(localStorage.getItem("token"))
    var headers=new HttpHeaders()
    headers=headers.set('Authorization' ,'Bearer '+ user)
       this.http.get(environment.apiSAP+"/Invoice/"+this.InvoiceInfo.DocNum,{headers}).toPromise().then((data:InvoiceInfo)=>{
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
  
  CanBurn(){
    if(this.AppInfo.Active_Burn==9)
    return true
    if(this.AppInfo.Active_Burn==1){
      if(this.AppInfo.Serie==this.InvoiceInfo.Series){
        return true;
      }else{
        this.Toast.error("","No tiene permisos para quemar esta factura",{
          positionClass:"toast-center-center",
          progressBar:true
        })
        return false
      }
    }    
  }
  Quemar(){
    this.spinner.show()
    if(this.InvoiceBurn.UserName=="Usuario" && this.InvoiceInfo.CardCode==undefined){
    this.spinner.hide()
      return;
    }
    const invoice =({
      DocEntry: this.InvoiceInfo.DocNum,
      UserName: this.AppInfo.User,
      DocNum: this.InvoiceInfo.DocNum,
      Series: this.InvoiceInfo.Series,
      IdUser: this.AppInfo.id,
      DocCur: this.InvoiceInfo.DocCur,
      DocRate: this.InvoiceInfo.DocRate,
      DocTotalIFC: this.InvoiceInfo.DocTotalSy,
      CodBar: this.InvoiceInfo.CodBar
 });
  if(!this.CanBurn()){
    this.spinner.hide()
    return;
  }
  this.http.post(environment.apiCCFN+"/invoice",invoice).toPromise().then((data)=>{
    this.Toast.success("","Factura quemada con exito",{
    positionClass:"toast-center-center",
    progressBar:true})
    this.InvoiceInfo={}
    this.InvoiceBurn={UserName:"Usuario",FormatedDate:"", Time:{hours:0,minutes:0}}
    this.Gafete.nativeElement.focus();
    this.p.innerHTML=""
   }).catch((error)=>{
    this.Toast.error("","Error al intentar quemar la factura",{
      positionClass:"toast-center-center",
      progressBar:true
    })

   console.log(error)
 }).finally(()=>{
  this.spinner.hide()
 })
  }
}
