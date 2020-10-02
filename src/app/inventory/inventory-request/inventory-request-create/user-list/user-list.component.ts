import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ModalService } from 'src/app/common/modal/modal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: true }) datatableElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject<UserListComponent> = new Subject();

  @Output() userSelected = new EventEmitter();

  constructor(private http: HttpClient, public modalService: ModalService) { }

  ngOnInit(): void {
    this.initUserDatatable();
  }

  initUserDatatable() {
    this.dtOptions = {
      autoWidth: false,
      ajax: (dataTablesParameters: any, callback) => {
        this.http.get(`${environment.apiCRM}/users/18`)
          .toPromise()
          .then(data => callback({data}));
      },
      columns: [{ data: 'name' }, ],
      language: {
        zeroRecords: 'No se Encontraron Usuarios',
        processing: 'Procesando...'
      },
      createdRow: (row: Node, data: any | object, index: number) => {
        $('td', row).addClass('pointer');
      },
      rowCallback: (row: Node, data: any | object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.userSelected.emit(data);
        });
        return row;
      },
      order: [[0, 'asc']],
      dom: 'ltipr',
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
