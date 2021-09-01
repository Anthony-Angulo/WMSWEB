import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vendors-edit',
  templateUrl: './vendors-edit.component.html',
  styleUrls: ['./vendors-edit.component.scss']
})
export class VendorsEditComponent implements OnInit {

  WeigthType = [
    { UoM: 3, label: 'KG' },
    { UoM: 4, label: 'LB' },
  ];

  contieneDecimal = [
    { id: 1, label: 'Si' },
    { id: 0, label: 'No' }
  ]

  ID: any;
  ItemCode: any;
  Provider: any;
  UoM: any;
  UoMSelected: any;
  Length: any;
  PesoLength: any;
  PesoPos: any;
  HasDecimal: any;

  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private location: Location,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    
    const id = this.route.snapshot.paramMap.get('id');
    

    this.spinner.show(undefined, { fullScreen: true });

    this.http.get(`${environment.apiCCFN}/codeBar/find/${id}`).toPromise().then((res: any) => {
      this.ID = res.ID;
      this.ItemCode = res.ItemCode;
      this.Provider = res.OriginLocation;
      this.Length = res.BarcodeLength;
      this.PesoLength = res.WeightLength;
      this.PesoPos = res.WeightPosition;
      
      const indexW = this.WeigthType.findIndex(x => x.UoM == res.UoM);

      this.UoMSelected = this.WeigthType[indexW];

      const indexD = this.contieneDecimal.findIndex(x => x.id == res.HasDecimal.data[0]);

      this.HasDecimal = this.contieneDecimal[indexD];

    }).catch(err => {
      console.log(err)
    }).finally(() => {
      this.spinner.hide();
    });

  }

  updateVendor() {

    let newVendor = {
      ID: this.ID,
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
    
    this.http.put(`${environment.apiCCFN}/codeBar`, newVendor).toPromise().then((resp) => {
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
