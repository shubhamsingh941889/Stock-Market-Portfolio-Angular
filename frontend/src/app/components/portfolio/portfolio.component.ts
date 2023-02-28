import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioServiceService } from 'src/app/services/portfolio-service.service';
import { StateManagementService } from 'src/app/services/state-management.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  inPortfolio: Boolean = false;
  isChanged: Boolean = false;
  bought: Boolean = false;
  sold: Boolean = false;
  showError: Boolean = true;
  isSell: Boolean = false;
  isDisabled: Boolean = true;

  currentLocalBalance: any;
  itemsList: any = [];
  dataList: any =[];
  closeResult='';
  errorText = '';
  quantity: number = 0;
  dataItem: any;
  

  constructor(private http: HttpClient, private portfolioService: PortfolioServiceService, private modalService: NgbModal, private stateManager: StateManagementService, private router: Router) { }

  ngOnInit(): void {
    this.currentLocalBalance = this.portfolioService.getBalanceofWallet();
    
    this.getDataList();

  }

  getDataList(){
    this.dataList=[];
    this.itemsList = this.portfolioService.getStocklist();
    
    if(this.itemsList.length == 0){

      this.showError = true;
    }else{
      for(let item of this.itemsList){
        console.log('item'+item['ticker'])
        this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getStockPrice?ticker='+item['ticker'])
        .subscribe((res: any)=>{
          let stockData = res['data'];
          let price = stockData['c'];
          let ticker = item['ticker'];
          let name = item['name'];
          let quantity = item['quantity'];
          
          let totalCost = item['totalCost'];
          let averageCost = 0;
          averageCost = (item['averageCost']);
          averageCost = parseFloat(averageCost.toFixed(2))
          console.log('price'+price+' '+typeof(averageCost))
          let change = price - averageCost;
          let marketValue = price * quantity;
          this.quantity = quantity;
          
          this.dataList.push({ticker, name, quantity, totalCost, averageCost, price, change, marketValue});
        });
      }
      
      this.showError = false;
    }
  }

  ngOnChanges(){
    this.currentLocalBalance = this.portfolioService.getBalanceofWallet();
    

  }

  changeRoute(ticker: string){
    this.stateManager.changeToNoData();
    this.stateManager.setTicker('');
    this.router.navigate(["/search/",ticker]);
  }

  watchListTimer:any;
  timerAutoClose() {
    if(this.watchListTimer) clearTimeout(this.watchListTimer);
    this.watchListTimer=setTimeout(()=>{
      this.isChanged=false;
    }, 5000)
  }

  openModal(content: any, isSell: any, item: any) {
    this.currentLocalBalance=this.portfolioService.getBalanceofWallet();
    this.isSell = isSell;
    
    this.dataItem = item;
    this.inPortfolio = this.portfolioService.isStockinPortfolio(this.dataItem['ticker']);
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.isDisabled = true;
      this.errorText = '';
      this.isSell = false;
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  quantityHandler(event: any){

    console.log('this.sell'+this.isSell)
    this.quantity = event.target.value;
    
    if(this.isSell){

      if(this.quantity < 0){
        this.errorText = 'Enter valid input';
        this.isDisabled = true;
      }
      else if(this.quantity%1!==0){
        this.errorText = 'You cannot sell fractional stocks';
        this.isDisabled = true;
      }
      else if(this.quantity > this.portfolioService.getStockQty(this.dataItem['ticker'])){
        this.errorText = 'You cannot sell the stocks that you don\'t have!';
        this.isDisabled = true;
      }else{
        this.errorText = '';
        this.isDisabled = false;
      }

      
    }
    else{
    if(this.quantity < 0){
      this.errorText = 'Enter valid input';
      this.isDisabled = true;
    }
    else if(this.quantity%1!==0){
      this.errorText = 'You cannot buy fractional stocks';
      this.isDisabled = true;
    }
    else if(this.quantity * this.dataItem['price'] > this.currentLocalBalance){
      this.errorText = 'Not enough balance in wallet!';
      this.isDisabled = true;
    }else{
      this.errorText = '';
      this.isDisabled = false;
    }
  }
  }


  portfolioBuyStock(){
    
    this.sold = false;
    this.isChanged = true;
    this.bought = true;
    let totalCost = this.quantity * this.dataItem['price'];
    this.portfolioService.buyStock(this.quantity, this.dataItem['ticker'], this.dataItem['name'], totalCost);
    this.portfolioService.updateMoneyInWallet(-totalCost);
    this.inPortfolio = this.portfolioService.isStockinPortfolio(this.dataItem['ticker']);
    this.getDataList();
    this.currentLocalBalance = this.portfolioService.getBalanceofWallet();
    this.timerAutoClose();
  }

  portfolioSellStock(){
    this.bought = false;
    this.isChanged = true;
    this.sold = true;
    let totalCost = this.quantity * this.dataItem['price'];
    this.portfolioService.sellStock(this.quantity, this.dataItem['ticker'], this.dataItem['name'], totalCost);
    this.portfolioService.updateMoneyInWallet(+totalCost);
    this.inPortfolio = this.portfolioService.isStockinPortfolio(this.dataItem['ticker']);
    this.getDataList();
    this.currentLocalBalance = this.portfolioService.getBalanceofWallet();
    this.timerAutoClose();
  }

  


}
