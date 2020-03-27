import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<DeliveryListComponent> = new Subject();

  constructor(private router: Router) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    let orderUrl;
    // TODO: Warehouse List
    if (user && user.warehouseCode) {
      orderUrl = `${environment.apiSAP}/Delivery/search`;
    } else {
      orderUrl = `${environment.apiSAP}/Delivery/search`;
    }

    this.dtOptions = {
      processing: true,
      serverSide: true,
      searchDelay: 500,
      autoWidth: false,
      ajax: {
        url: orderUrl,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data(d) {
          return JSON.stringify(d);
        }
      },
      columns: [
        { title: 'Numero de Documento', data: 'DocNum' },
        { title: 'Nombre Fantasia', data: 'CardFName' },
        { title: 'Contacto', data: 'CardName' },
        { title: 'Sucursal', data: 'WhsName' },
        { title: 'Estado', data: 'DocStatus' },
        { title: 'Fecha', data: 'DocDate' },
      ],
      language: {
        zeroRecords: 'No se Encontraron Ordenes',
        processing: 'Procesando...'
      },
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.router.navigate(['/order/Delivery/' + data.DocEntry]);
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
