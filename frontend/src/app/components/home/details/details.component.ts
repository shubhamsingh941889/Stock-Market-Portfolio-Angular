




import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioServiceService } from 'src/app/services/portfolio-service.service';
import { WatchlistServiceService } from 'src/app/services/watchlist-service.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnChanges {
  @Input() companyProfile: any;
  @Input() stockPrice:any;
  @Input() currTime:any;


  isMarketOpen: Boolean = true;
  isStarActive: Boolean = false;
  starPressed: Boolean = false;

  isDisabled: Boolean = true;
  stockinPortfolio: Boolean = false;
  isSell: Boolean = false;
  isChanged: Boolean = false;
  bought: Boolean = false;
  sold: Boolean = false;

  currentTimestamp: any;
  closeResult = '';
  quantity: number = 0;
  balance: any;
  errorText = '';
  localCurrentTime: any;
  watchListTimer:any;
  boughtTimer:any

 



  constructor(private watchlistService: WatchlistServiceService, private PortfolioServiceProvider: PortfolioServiceService, private modalService: NgbModal) {
    this.isStarActive=false;
   }

  ngOnInit(): void {
    
    
    
    
    
    this.balance = this.PortfolioServiceProvider.getBalanceofWallet();
    this.stockinPortfolio = this.PortfolioServiceProvider.isStockinPortfolio(this.companyProfile['ticker']);
    this.currentTimestamp = this.formatDate(new Date(this.stockPrice['t']*1000));
    this.isMarketOpen = this.checkMarketStatus(this.stockPrice['t']);
  }

  ngOnChanges() {
    this.isStarActive = this.watchlistService.isStockinWatchlist(this.companyProfile['ticker']);
    this.starPressed = false;
    this.stockinPortfolio = this.PortfolioServiceProvider.isStockinPortfolio(this.companyProfile['ticker']);
  }

  padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
  }
  
  formatDate(date: any) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  getMarketStatus(){
    if (this.isMarketOpen){
      return "Market is Open";
    }
    else{
      return "Market Closed on "+this.currentTimestamp;
    }
  }

  checkMarketStatus(params: any){
    let currTime = new Date().getTime();
    
    if((currTime - params*1000) > 60000){
      this.localCurrentTime =  new Date()
      return false;
    }
    else {
      this.localCurrentTime =  this.formatDate(new Date(this.stockPrice['t']*1000));
      return true;
    }
  }

  
  timerModalClose() {
    if(this.boughtTimer) clearTimeout(this.boughtTimer);
    this.boughtTimer=setTimeout(()=>{
      this.isChanged=false;
      
    }, 5000)
  }


  timerWatchlisrModalClose() {
    if(this.watchListTimer) clearTimeout(this.watchListTimer);
    this.watchListTimer=setTimeout(()=>{
      this.starPressed=false;
    }, 5000)
  }

  

  

  addToWatchlist(){
    if(this.isStarActive){
      this.watchlistService.removeFromWatchlist(this.companyProfile['ticker']);
    }else{
      this.watchlistService.setWatchlist(this.companyProfile['ticker'],this.companyProfile['name']);
    }
    this.isStarActive = !this.isStarActive;
    this.starPressed = true;
    this.timerWatchlisrModalClose();
  }

  openModal(content: any, isSell: any) {
    this.balance=this.PortfolioServiceProvider.getBalanceofWallet();
    this.isSell = isSell;
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

  buyFromDetails(){
    this.sold =false
    this.isChanged = true;
    this.bought = true;
    let totalCost = this.quantity * this.stockPrice['c'];
    this.PortfolioServiceProvider.buyStock(this.quantity, this.companyProfile['ticker'], this.companyProfile['name'], totalCost);
    this.PortfolioServiceProvider.updateMoneyInWallet(-totalCost);
    this.stockinPortfolio = this.PortfolioServiceProvider.isStockinPortfolio(this.companyProfile['ticker']);
    
    this.timerModalClose();
  }

  sellFromDetails(){
    this.bought = false;
    this.isChanged = true;
    this.sold = true;
    let totalCost = this.quantity * this.stockPrice['c'];
    this.PortfolioServiceProvider.sellStock(this.quantity, this.companyProfile['ticker'], this.companyProfile['name'], totalCost);
    this.PortfolioServiceProvider.updateMoneyInWallet(+totalCost);
    this.stockinPortfolio = this.PortfolioServiceProvider.isStockinPortfolio(this.companyProfile['ticker']);
    
    this.timerModalClose();
  }

  quantityHandler(event: any){

    
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
      else if(this.stockinPortfolio && this.quantity > this.PortfolioServiceProvider.getStockQty(this.companyProfile['ticker'])){
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
    else if(this.quantity * this.stockPrice['c'] > this.balance){
      this.errorText = 'Not enough balance in wallet!';
      this.isDisabled = true;
    }else{
      this.errorText = '';
      this.isDisabled = false;
    }
  }
  }

  

    

}
