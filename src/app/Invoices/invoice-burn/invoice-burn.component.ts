import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export interface InvoiceInfo {
  DocEntry?: string;
  DocNum?: string;
  DocDate?: string;
  CardCode?: string;
  DocCur?: string;
  DocRate?: string;
  CodBar?: string;
  DocTotalSy?: string;
  Series?: string;
  CardFName?: string;
  CardName?: string;
}

@Component({
  selector: 'app-invoice-burn',
  templateUrl: './invoice-burn.component.html',
  styleUrls: ['./invoice-burn.component.scss']
})
export class InvoiceBurnComponent implements OnInit {

  InvoiceInfo: InvoiceInfo = {};

  today: any;
  gafete: any;
  factura: any;
  scanner: any;
  user: any;

  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private Toast: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    // this.today = new Date().toISOString().split('T')[0];
  }

  searchInCCFN() {

    if (this.factura == undefined || this.factura == '') {
      this.Toast.info("Debes ingresar numero de factura", "Numero de factura");
      return;
    }

    if(this.scanner) {
      this.http.get(`${environment.apiCCFN}/Invoice/${this.factura}`).toPromise().then((resp: any) => {
        if(resp.length) {
          console.log(resp[0])
          this.Toast.info(`Factura Quemada por el usuario ${resp[0].UserName} en la fecha ${resp[0].DateBurn}`);
        } else {
          this.search();
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      this.http.get(`${environment.apiCCFN}/Invoice/docnum/${this.factura}`).toPromise().then((resp: any) => {
        if(resp.length) {
          console.log(resp[0])
          this.Toast.info(`Factura Quemada por el usuario ${resp[0].UserName} en la fecha ${resp[0].DateBurn}`);
        } else {
          this.search();
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }


  search() {

    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();

    headers = headers.set('Authorization', `Bearer ${token}`);
    

    if(this.scanner) {
      this.searchByCodeBar();
      return;
    }

    if (this.factura == undefined || this.factura == '') {
      this.Toast.info("Debes ingresar numero de factura", "Numero de factura");
      return;
    }

    this.http.get(`${environment.apiSAP}/Invoice/${this.factura}`, { headers }).toPromise().then((data: InvoiceInfo) => {
      this.InvoiceInfo = data;
      console.log(this.InvoiceInfo)
    }).catch((error) => {
      console.log(error)
      this.Toast.error(`Factura con el numero ${this.factura} no encontrada`, "Factura no encontrada")
      this.InvoiceInfo = {  }
    }).finally(() => {
        this.spinner.hide()
    });
 
  }

  searchByCodeBar() {

    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();

    headers = headers.set('Authorization', `Bearer ${token}`);
    this.http.get(`${environment.apiSAP}/Invoice/Code/${this.factura}`, { headers }).toPromise().then((data: InvoiceInfo) => {
      this.InvoiceInfo = data;
      console.log(this.InvoiceInfo)
    }).catch((error) => {
      console.log(error)
      this.Toast.error(`Factura con el codigo de barra ${this.factura} no encontrada`, "Factura no encontrada")
      this.InvoiceInfo = {  }
    }).finally(() => {
        this.spinner.hide()
    });
  }

  burnInvoice() { 

    if(this.InvoiceInfo.DocNum == "" || this.InvoiceInfo.DocNum == undefined) {
      this.Toast.warning("Debes buscar una factura");
      return;
    }

    this.user = JSON.parse(localStorage.getItem('AppInfo'));

    if(this.user.Active_Burn == "1" && this.InvoiceInfo.Series != this.user.Serie) {
      this.Toast.warning(`No tienes permismo para quemar facturas de la serie ${this.InvoiceInfo.Series}`);
      return;
    } 

    this.spinner.show(undefined, { fullScreen: true });

    const output = {
      DocEntry: this.InvoiceInfo.DocEntry,
      UserName: this.user.User,
      DocNum: this.InvoiceInfo.DocNum,
      Series: this.InvoiceInfo.Series,
      IdUser: this.user.id,
      DocCur: this.InvoiceInfo.DocCur,
      DocRate: this.InvoiceInfo.DocRate,
      DocTotalIFC: this.InvoiceInfo.DocTotalSy,
      CodBar: this.InvoiceInfo.CodBar,
      DocDate: this.InvoiceInfo.DocDate
    }

    this.http.post(`${environment.apiCCFN}/Invoice`, output).toPromise().then((resp) => {
      this.Toast.success(`Factura quemada por el usuario ${this.user.User}`);
      this.factura = '';
      this.InvoiceInfo = {};
      document.getElementById('input-codigo').focus();
    }).catch(err => { this.Toast.error("Error al quemar facutra")}).finally(() => {this.spinner.hide() });
    
  }

  CancelClick() {
    this.factura = undefined;
    this.InvoiceInfo = {};
  }
}
