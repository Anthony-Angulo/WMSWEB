import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Location } from '@angular/common';
import { throwError, Subject } from 'rxjs';


@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<VendorsComponent> = new Subject();

  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private location: Location,
    private router: Router) { }

  ngOnInit(): void {
    this.initTable();
  }

  initTable() {
    this.dtOptions = {
      // destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.http.get(`${environment.apiCCFN}/codeBar`).toPromise().then((data: any[]) => {
          this.afterView();
          callback({ data });
        });
      },
      columns: [{
        title: 'Producto',
        data: 'ItemCode'
      }, {
        title: 'Proveedor',
        data: 'OriginLocation'
      }, {
        title: 'Unidad de Medida',
        data: 'UoM'
      }, {
        title: 'Largo',
        data: 'BarcodeLength'
      }],
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          console.log(data)
          this.router.navigate(['/Inventory/Vendors', data.ID]);
        });
        return row;
      },
      dom: 'ltipr',
      order: [[1, 'asc']],
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.afterView(); 
  }

  afterView() {
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
