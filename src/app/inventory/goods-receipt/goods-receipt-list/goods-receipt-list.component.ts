import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-goods-receipt-list',
  templateUrl: './goods-receipt-list.component.html',
  styleUrls: ['./goods-receipt-list.component.scss']
})
export class GoodsReceiptListComponent implements OnInit, AfterViewInit, OnDestroy  {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<GoodsReceiptListComponent> = new Subject();

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.InitTable();
  }

  InitTable() {
    this.dtOptions = {
      processing: true,
      serverSide: true,
      searchDelay: 500,
      autoWidth: false,
      ajax: {
        url: `${environment.apiSAP}/GoodsReceipt/Search`,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data(d) {
          return JSON.stringify(d);
        }
      },
      columns: [
        { title: 'Numero de Documento', data: 'DocNum' },
        { title: 'Sucursal', data: 'WhsName' },
        { title: 'Status', data: 'DocStatus' },
        { title: 'Fecha', data: 'DocDate' },
      ],
      language: {
        zeroRecords: 'No se Encontraron Documentos',
        processing: 'Procesando...'
      },
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.router.navigate(['/Inventory/GoodsReceipt/' + data.DocEntry]);
        });
        return row;
      },
      dom: 'ltipr',
      order: [[0, 'desc']],
      deferRender: true,
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function() {
        const that = this;
        $('input', this.footer()).on('keyup change', function() {
          if (that.search() !== this['value']) {
            that.search(this['value']).draw();
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
