import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/common/modal/modal.service';
import { Location } from '@angular/common';
import { throwError, Subject } from 'rxjs';
import { env } from 'process';

@Component({
  selector: 'app-inventory-request-create',
  templateUrl: './inventory-request-create.component.html',
  styleUrls: ['./inventory-request-create.component.scss']
})
export class InventoryRequestCreateComponent implements OnInit {

  modeSelected = 2;
  optionsMode = [
    // { id: 0, display: 'Parcial' },
    // { id: 1, display: 'Completa' },
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
      this.http.get(`${environment.apiCCFN}/warehouse`).toPromise(),
      this.http.get(`${environment.apiCCFN}/inventoryType`).toPromise(),
      this.http.get(environment.apiSAP + '/products/properties').toPromise()
    ]).then(([warehouseList, optionsMode ,propertyList]: any[]) => {

      this.warehouseList = warehouseList;
      this.optionsMode = optionsMode;
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

  async createReport() {


    const output = {
      type:  this.modeSelected,
      status: '1',
      warehouse: this.warehouseSelected.ID,
      userid: this.userSelected.Id
    }

    this.spinner.show(undefined, { fullScreen: true });

    let result = await this.http.post(`${environment.apiCCFN}/inventory`, output).toPromise();
    
    let postPromise;

    if (this.modeSelected == 2) {
      postPromise = this.addCompleteInventoryRequest(result);
    } else {
      postPromise = this.addPartialInventoryRequest(result);
    }

    postPromise.then(val => {
      console.log(val)
      this.router.navigate(['/Inventory']);
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      this.spinner.hide();
    });

  }

  addPartialInventoryRequest(result) {

    let output = this.productSelected.map(p => {
      return [
        p.ItemCode,
        p.ItemName,
        0,
        p.OnHand,
        p.ManBtchNum,
        p.U_IL_TipPes,
        p.Id,
        result.id
      ]
    })

    return this.http.post(`${environment.apiCCFN}/inventoryProduct`, output).toPromise();
  }

  async addCompleteInventoryRequest(result) {
    const WhsCode = this.warehouseSelected.WhsCode;
    result.rows = await this.http.get(`${environment.apiSAP}/products/InventoryCompleteProducts/${WhsCode}`).toPromise();
    
    let output = result.rows.map(p => {
      return [
        p.ItemCode,
        p.ItemName,
        0,
        p.OnHand,
        p.ManBtchNum,
        p.U_IL_TipPes,
        this.userSelected.Id,
        result.id
      ]
    })

    return this.http.post(`${environment.apiCCFN}/inventoryProduct`, output).toPromise();
  }

}
