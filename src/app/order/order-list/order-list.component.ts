import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, AfterViewInit, OnDestroy  {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: any = {};
  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<OrderListComponent> = new Subject();

  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    let orderUrl;

    if (user && user.warehouseCode) {
      orderUrl = `${environment.apiSAP}/order/search/${user.warehouseCode}`;
    } else {
      orderUrl = `${environment.apiSAP}/order/search`;
    }

    this.dtOptions = {
      processing: true,
      serverSide: true,
      searchDelay: 500,
      autoWidth: false,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.columns.splice(0, 1);
        if (dataTablesParameters.order[0].columns != 0) {
          dataTablesParameters.order[0].column = dataTablesParameters.order[0].column - 1;
        }
        this.http.post(orderUrl, dataTablesParameters)
          .toPromise()
          .then(data => callback(data));
      },
      // ajax: {
      //   url: orderUrl,
      //   type: 'POST',
      //   contentType: 'application/json',
      //   dataType: 'json',
      //   data(d) {
      //     console.log(d)
      //     return JSON.stringify(d);
      //   }
      // },
      columnDefs: [{
        orderable: false,
        className: 'select-checkbox',
        targets:   0,
        render: (data, type, row) => {
          return '';
        },
      }, ],
      columns: [
        { title: 'Selection', data: '_'},
        { title: 'Numero de Orden', data: 'DocNum'},
        { title: 'Creado Por', data: 'SlpName' },
        { title: 'Nombre Fantasia', data: 'CardFName' },
        { title: 'Contacto', data: 'CardName' },
        { title: 'Sucursal', data: 'WhsName' },
        { title: 'Total', data: 'DocTotal' },
        { title: 'Moneda', data: 'DocCur' },
        { title: 'Pago', data: 'PymntGroup' },
        { title: 'Estado', data: 'DocStatus' },
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
        $('td', row).on('click', (event) => {
          if (!event.target.classList.contains('select-checkbox')) {
            this.router.navigate(['/order/' + data.DocEntry]);
          }
        });
        return row;
      },
      dom: 'ltipr',
      order: [[0, 'desc']],
      deferRender: true,
      select: {
        style:    'multi',
        selector: 'td:first-child'
      },
    };
  }

  printOrders() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const RowsSelected = dtInstance.rows({ selected: true}).data().toArray();
      if (RowsSelected.length == 0) {
        this.toastr.warning('No tiene ningun Documento seleccionado');
        return;
      }
      const DocEntryList = RowsSelected.map(row => row.DocEntry);
      const DocEntryString = DocEntryList.join(',');
      window.open(`${environment.apiSAP}/impresion/order/${DocEntryString}`, '_blank');
    });
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
