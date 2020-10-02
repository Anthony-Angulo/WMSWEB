import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/common/modal/modal.service';
import { Location } from '@angular/common';
import { throwError, Subject } from 'rxjs';

@Component({
  selector: 'app-inventory-request-create',
  templateUrl: './inventory-request-create.component.html',
  styleUrls: ['./inventory-request-create.component.scss']
})
export class InventoryRequestCreateComponent implements OnInit {

  modeSelected = 0;
  optionsMode = [
    { id: 0, display: 'Parcial' },
    { id: 1, display: 'Completa' },
  ];

  propertyList = [];
  propertySelected;

  warehouseList = [];
  warehouseSelected;

  userSelected;
  userLineSelected;

  products = [];
  productSelected = [];
  productTempSelected = [];
  updateSubject: Subject<any[]> = new Subject<any[]>();

  constructor(private http: HttpClient,
              public modalService: ModalService,
              private spinner: NgxSpinnerService,
              private location: Location,
              private router: Router) { }

  ngOnInit(): void {
    this.spinner.show(undefined, { fullScreen: true });
    Promise.all([
      this.http.get(environment.apiSAP + '/warehouse/ToInventory').toPromise(),
      this.http.get(environment.apiSAP + '/products/properties').toPromise()
    ]).then(([warehouseList, propertyList]: any[]) => {

      this.warehouseList = warehouseList;
      this.warehouseSelected = this.warehouseList[0];
      this.propertyList = propertyList.filter(property => property.ItmsTypCod <= 8);
      this.propertySelected = this.propertyList[0];
      this.getProducts();

    }).catch(error => {
      console.error(error);
    }).finally(() => {
      this.spinner.hide();
    });
  }

  getProducts() {
    this.spinner.show(undefined, { fullScreen: true });
    const WhsCode = this.warehouseSelected.WhsCode;
    this.http
      .get(`${environment.apiSAP}/products/${WhsCode}/${this.propertySelected.ItmsTypCod}`)
      .toPromise()
      .then((products: any) => { this.products = products; this.updateSubject.next(this.products); })
      .catch(error => { console.error(error); })
      .finally(() => { this.spinner.hide();   });
  }

  getUser() {
    this.modalService.open('user-modal');
    this.selectUser = (user) => {
      this.userSelected = user;
      this.modalService.close('user-modal');
    };
  }

  getLineUser() {
    this.modalService.open('user-modal');
    this.selectUser = (user) => {
      this.userLineSelected = user;
      this.modalService.close('user-modal');
    };
  }

  selectUser(user) {
    throwError('NoHandle');
  }

  selectProducts(indexes) {
    const productfiltered = this.products.filter((product, index) => indexes.includes(index));
    this.productTempSelected = productfiltered;
    this.modalService.close('products-modal');
  }

  addProducts() {
    const resultProducts = this.productTempSelected.map(product => {
      return Object.assign(product, this.userLineSelected);
    });
    this.productSelected.push(...resultProducts);
    this.reiniciarTemp();
  }

  reiniciarTemp() {
    this.productTempSelected = [];
    this.userLineSelected = undefined;
  }

  deleteProduct(index, list) {
    this[list].splice(index, 1);
  }

  backClicked() {
    this.location.back();
  }

  createReport() {

    const output = {
      employee: this.userSelected,
      warehouse: this.warehouseSelected
    };

    this.spinner.show(undefined, { fullScreen: true });
    let postPromise;
    if (this.modeSelected == 1) {
      postPromise = this.addCompleteInventoryRequest(output);
    } else {
      postPromise = this.addPartialInventoryRequest(output);
    }

    postPromise.then(val => {
      this.router.navigate(['/Inventory']);
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      this.spinner.hide();
    });

  }

  addPartialInventoryRequest(output) {
    output.rows = this.productSelected;
    return this.http.post(environment.apiWMS + '/InventoryRequestSAP/Partial', output).toPromise();
  }

  async addCompleteInventoryRequest(output) {
    output.rows = [];
    const WhsCode = this.warehouseSelected.WhsCode;
    const products = await this.http.get(`${environment.apiSAP}/products/InventoryCompleteProducts/${WhsCode}`).toPromise();
    output.rows = products;
    return this.http.post(environment.apiWMS + '/InventoryRequestSAP/Complete', output).toPromise();
  }

}
