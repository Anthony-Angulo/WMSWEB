import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('barChart',{ static: true }) barChart;
  @ViewChild('doughnut',{ static: true }) doughnut;

  donut: any;
  dataUser: any;
  userlabels: any;

  bars: any;
  labels: any;
  dataScanned: any;

  inventorySelected: any;
  inventoryList: any;

  backgroundColorsTOP = [
    'rgb(255, 0, 0)', 'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(128, 0, 0)','rgb(255, 0, 0)', 'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(128, 0, 0)'
  ]

  backgroundColorsDonut = [
    'rgb(255, 0, 0)', 'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(128, 0, 0)','rgb(255, 0, 0)', 'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(128, 0, 0)'
  ]

  constructor(private http: HttpClient,private spinner: NgxSpinnerService,) { }

  async ngOnInit() {
    this.spinner.show(undefined, { fullScreen: true });
    

    await this.http.get(`${environment.apiCCFN}/inventory/fullInventory`).toPromise().then((resp) => {
      this.inventoryList = resp;
      this.inventorySelected = this.inventoryList[0]
    }).catch(err => {
      console.log(err)
    }).finally(() => { this.spinner.hide() })

    if(this.inventoryList.length > 0) {
      this.triggerCharts();
      this.createTopChart();
      this.createTOPUserChart();
    }
    
  }

  async triggerCharts() {
    this.spinner.show(undefined, { fullScreen: true });

    Promise.all([
      this.http.get(`${environment.apiCCFN}/inventoryProduct/top/${this.inventorySelected.ID}`).toPromise(),
      this.http.get(`${environment.apiCCFN}/inventoryDetail/topUser/${this.inventorySelected.ID}`).toPromise()
    ]).then(([topStock, topUser]: any) => {

      //top stock
      this.labels = topStock.map(x => x.ItemCode);
      this.dataScanned = topStock.map(x => x.Quantity);
      this.bars.data.labels = this.labels;
      this.bars.data.datasets[0].data = this.dataScanned;
      this.bars.update();

      //top user
      this.dataUser = topUser.map(x => x.Quantity);
      this.userlabels = topUser.map(x => x.UserName)
      this.donut.data.labels = this.userlabels;
      this.donut.data.datasets[0].data = this.dataUser;
      this.donut.update();
    })

  }

  async ChartTOPStock() {
    this.spinner.show(undefined, { fullScreen: true });

    this.labels= []
    this.dataScanned = []

    await this.http.get(`${environment.apiCCFN}/inventoryProduct/top/${this.inventorySelected.ID}`).toPromise().then((resp: any) => {
      console.log(resp)
      this.labels = resp.map(x => x.ItemCode);
      this.dataScanned = resp.map(x => x.Quantity);
      this.bars.data.labels = this.labels;
      this.bars.data.datasets[0].data = this.dataScanned;
      this.bars.update();
    }).catch(err => {
      console.log(err)
    }).finally(() => { this.spinner.hide() }) 

    
  }

  createTOPUserChart() {
    this.donut = new Chart(this.doughnut.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          labels: this.userlabels,
          data: this.dataUser,
          backgroundColor: this.backgroundColorsDonut
        }]
      }
    })
  }

  createTopChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Escaneado',
          data: this.dataScanned,
          backgroundColor: 'rgb(255, 0, 0)', // array should have same number of elements as number of dataset x  
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

  }

}
