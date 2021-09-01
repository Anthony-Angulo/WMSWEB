import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vendors-create',
  templateUrl: './vendors-create.component.html',
  styleUrls: ['./vendors-create.component.scss']
})
export class VendorsCreateComponent implements OnInit {

  WeigthType = [
    { UoM: 3, label: 'KG' },
    { UoM: 4, label: 'LB' },
  ];

  contieneDecimal = [
    { id: 1, label: 'Si' },
    { id: 0, label: 'No' }
  ]

  ItemCode: any;
  Provider: any;
  UoM: any;
  UoMSelected: any;
  Length: any;
  PesoLength: any;
  PesoPos: any;
  HasDecimal: any;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private location: Location) { }

  ngOnInit(): void {

  }

  createVendor() {
    let newVendor = {
      ItemCode: this.ItemCode,
      OriginLocation: this.Provider,
      UoM: this.UoMSelected.UoM,
      BarcodeLength: this.Length,
      WeightLength: this.PesoLength,
      WeightPosition: this.PesoPos,
      HasDecimal: this.HasDecimal.id,
      GTinLength: '',
      GTinPosition: '',
      GTIN: ''
    }

    this.spinner.show(undefined, { fullScreen: true });
    
    this.http.post(`${environment.apiCCFN}/codeBar`, newVendor).toPromise().then((resp) => {
      this.toastr.success("Codigo de barra creado correctamente");
      this.location.back();
    }).catch(err => { 
      console.log(err)  
    }).finally(() => { this.spinner.hide() });
  }

  backClicked() {
    this.location.back();
  }

}
