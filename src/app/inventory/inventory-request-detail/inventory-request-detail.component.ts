import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inventory-request-detail',
  templateUrl: './inventory-request-detail.component.html',
  styleUrls: ['./inventory-request-detail.component.scss']
})
export class InventoryRequestDetailComponent implements OnInit {

  canClose = false;
  order;
  uoms = [];
  products = [];

  // properties = [
  //   'Todos',
  //   'ABARROTES',
  //   'LACTEOS',
  //   'CARNES',
  //   'FRUTAS Y VERDURAS',
  //   'CONSUMO INTERNO',
  // ];

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              // private location: Location,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show(undefined, { fullScreen: true });
    const id = this.route.snapshot.paramMap.get('id');

    Promise.all([
      this.http.get(`${environment.apiWMS}/getInventoryRequestSAPDetail/${id}`).toPromise(),
      this.http.get(`${environment.apiSAP}/products/Uoms/`).toPromise(),
    ]).then(([data, uoms]: any[]) => {
      this.uoms = uoms;
      const details = data.details;
      details.forEach(detail => {
        detail.codes =  data.codes.filter(code => code.InventorySAPDetail == detail.id);
      });
      const rows = data.rows;
      rows.forEach(row => {
        row.details = details.filter(detail => detail.InventorySAPRow == row.id);
        if (row.Quantity == null) {
          row.Quantity = row.details.map(detail => Number(detail.Quantity)).reduce((a, b) => (a + b), 0);
        }
      });
      const output = rows.map(row => row.ItemCode);
      this.order = data.order;
      this.order.rows = rows;
      this.canClose = data.rows.length != 0 && /* data.rows.every(row => row.Status == 1) && */ data.order.InventoryStatus == 1;
      return this.http.post(`${environment.apiSAP}/products/UomDetailWithLastSellPrice`, output).toPromise();
    }).then((items: any[]) => {
      this.order.rows.forEach(row => {
        row.warehouseCode = this.order.WarehouseCode;
        const item = items.find(item => item.ItemCode == row.ItemCode);
        row = Object.assign(row, item);
        row.UomCode1 = this.uoms.find(uom => uom.UomEntry == row.IUoMEntry).UomCode;
        row.UomCode2 = this.uoms.find(uom => uom.UomEntry == row.SUoMEntry).UomCode;
      });
      this.products = this.order.rows;
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      console.log(this.order);
      this.spinner.hide();
    });
  }

}
