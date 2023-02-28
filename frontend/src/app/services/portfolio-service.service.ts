import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PortfolioServiceService {

  currentLocalBalance: any;
  currStocks: any;

  getBalanceofWallet(){
    try{
      this.currentLocalBalance = localStorage.getItem('currentLocalBalance');
      if(this.currentLocalBalance)
        this.currentLocalBalance = JSON.parse(this.currentLocalBalance);
      else
        this.currentLocalBalance = 0;
    }catch(e){
      
    }
    return this.currentLocalBalance;
  }

  initializeMoneyInWallet(){
    try{
      this.currentLocalBalance = localStorage.getItem('currentLocalBalance');
      if(this.currentLocalBalance)
        this.currentLocalBalance = JSON.parse(this.currentLocalBalance);
      else{
        this.currentLocalBalance = 25000;
        localStorage.setItem('currentLocalBalance',JSON.stringify(this.currentLocalBalance));
      }
        
    }catch(e){
      
    }
  }

  updateMoneyInWallet(amt: number){
    this.currentLocalBalance = this.getBalanceofWallet();
    try{
      this.currentLocalBalance += amt;
      if(this.currentLocalBalance < 0)
        console.log("Insufficient balance "+this.currentLocalBalance);
      else{
        localStorage.setItem('currentLocalBalance',JSON.stringify(this.currentLocalBalance));
      }
    }catch(e){
      
    }
    
  }

  buyStock(quantity: number, ticker: string, name:string, totalCost: number){
    try{
      let averageCost = 0;
      this.currStocks = localStorage.getItem('stockList');
      this.currStocks = JSON.parse(this.currStocks);
      
      if(this.currStocks){
        let stock: any = this.currStocks[ticker];
        if(stock){
          totalCost += Number(stock['totalCost']);
          quantity = +quantity + +(stock['quantity']);
          averageCost = totalCost / quantity;
          stock = {ticker, name, quantity, totalCost, averageCost};
          this.currStocks[ticker] = stock;
        }else{
          averageCost = totalCost / quantity;
          stock = {ticker, name, quantity, totalCost, averageCost};
          this.currStocks[ticker] = stock;
        }
      }else{
        averageCost = totalCost / quantity;
        this.currStocks = {[ticker]: {ticker, name, quantity, totalCost, averageCost}};
      }
      localStorage.setItem('stockList',JSON.stringify(this.currStocks));
    }catch(e){
      
    }
  }


  sellStock(quantity: number, ticker: string, name:string, totalCost: number){
    try{
      let averageCost = 0;
      this.currStocks = localStorage.getItem('stockList');
      this.currStocks = JSON.parse(this.currStocks);
      
        let stock: any = this.currStocks[ticker];
          quantity = +(stock['quantity']) - +quantity;
          
          totalCost = Number(stock['totalCost'])-totalCost;
          if(quantity <= 0){
            delete this.currStocks[ticker];
          }else{
            averageCost = totalCost / quantity;
            stock = {ticker, name, quantity, totalCost, averageCost};
            this.currStocks[ticker] = stock;
          }
      localStorage.setItem('stockList',JSON.stringify(this.currStocks));
    }catch(e){
      
    }
  }


  isStockinPortfolio(ticker: string){
    try{
      this.currStocks = localStorage.getItem('stockList');
      this.currStocks = JSON.parse(this.currStocks);
      if(ticker in this.currStocks){
        
        return true;
      }
      else
        return false;
    }catch(e){
      
    }
    return false;
  }

  getStocklist(){
    let array = [];
    try{
      this.currStocks = localStorage.getItem('stockList');
      this.currStocks = JSON.parse(this.currStocks);
      
      for(let item of Object.keys(this.currStocks)){
        array.push(this.currStocks[item]);
      }
    }catch(e){
      
    }
    
    return array;
  }

  getStockQty(ticker: string){
    this.currStocks = localStorage.getItem('stockList');
    this.currStocks = JSON.parse(this.currStocks);
    return parseInt(this.currStocks[ticker]['quantity']);
  }

  

  

  constructor() { }
}
