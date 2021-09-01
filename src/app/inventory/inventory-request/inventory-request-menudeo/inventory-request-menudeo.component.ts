import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { utils, writeFile } from 'xlsx';
import { Sucursal } from '../../../interfaces/inventory-request';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-inventory-request-menudeo',
  templateUrl: './inventory-request-menudeo.component.html',
  styleUrls: ['./inventory-request-menudeo.component.scss']
})
export class InventoryRequestMenudeoComponent implements OnInit {

  sucursal: Sucursal;
  fechaInicial: string;
  fechaFinal: string;

  listSucursal: Sucursal;

  diaI: number;
  mesI: any;
  yearI: number;

  diaF: number;
  mesF: any;
  yearF: number;

  dias = [{ dia: 1 }, { dia: 2 }, { dia: 3 }, { dia: 4 }, { dia: 5 }, { dia: 6 }, { dia: 7 }, { dia: 8 }, { dia: 9 }, { dia: 10 }, { dia: 11 }, { dia: 12 },
  { dia: 13 }, { dia: 14 }, { dia: 15 }, { dia: 16 }, { dia: 17 }, { dia: 18 }, { dia: 19 }, { dia: 20 }, { dia: 21 }, { dia: 22 }, { dia: 23 }, { dia: 24 },
  { dia: 25 }, { dia: 26 }, { dia: 27 }, { dia: 28 }, { dia: 29 }, { dia: 30 }, { dia: 31 }
  ];

  meses = [{ mes: 1, n: "Enero" }, { mes: 2, n: "Febrero" }, { mes: 3, n: "Marzo" }, { mes: 4, n: "Abril" },
  { mes: 5, n: "Mayo" }, { mes: 6, n: "Junio" }, { mes: 7, n: "Julio" }, { mes: 8, n: "Agosto" }, { mes: 9, n: "Septiembre" },
  { mes: 10, n: "Octubre" }, { mes: 11, n: "Noviembre" }, { mes: 12, n: "Diciembre" }
  ];

  years = [{ year: 2018 }, { year: 2019 }, { year: 2020 }, { year: 2021 }, { year: 2022 }, { year: 2023 }, { year: 2024 }, { year: 2025 }
  ]


  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {


    this.spinner.show("Cargando..");

    this.http.get(`${environment.apiCCFN}/warehouse`)
      .toPromise().then((x: Sucursal) => {
        this.listSucursal = x;
      })
      .catch((err: Error) => {
        console.log(err);
      })
      .finally(() => this.spinner.hide());
  }

  generateExcel() {
    this.fechaInicial = this.yearI + '-' + this.mesI.mes + '-' + this.diaI;
    this.fechaFinal = this.yearF + '-' + this.mesF.mes + '-' + this.diaF;

    this.http.get(`${environment.apiSAP}/InventoryTransfer/ProteusInventory/${this.sucursal.WhsCode}/${this.fechaInicial}/${this.fechaFinal}`)
      .toPromise().then((x: any) => {
        const workbook = utils.book_new();
        const rows: any[] = x.map(Row => {
          return {
            D3_FILIAL: Row.Col1,
            D3_TM: Row.Col2,
            D3_COD: Row.Col3,
            D3_QUANT: Row.Col4,
            D3_LOCAL: Row.Col5,
            D3_DOC: Row.Col6,
            D3_EMISSAO: Row.Col7,
            D3_CUSTO1: Row.Col8,
            D3_OBSERVA: Row.Col9
          }
        });

        rows.unshift({
          D3_FILIAL: 'D3_FILIAL',
          D3_TM: 'D3_TM',
          D3_COD: 'D3_COD',
          D3_QUANT: 'D3_QUANT',
          D3_LOCAL: 'D3_LOCAL',
          D3_DOC: 'D3_DOC',
          D3_EMISSAO: 'D3_EMISSAO',
          D3_CUSTO1: 'D3_CUSTO1',
          D3_OBSERVA: 'D3_OBSERVA'
        });


        const worksheet = utils.json_to_sheet(rows, { skipHeader: true });
        utils.book_append_sheet(workbook, worksheet, 'tab1');
        writeFile(workbook, 'reporte_menudeo.csv');
      })
      .catch(err => {
        console.log(err)
      });

  }

}
