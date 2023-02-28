import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WatchlistServiceService {

  tempArray: any = [];

  getStockFromWatchlist(){
    try{
      this.tempArray = localStorage.getItem('watchlist');
      if(this.tempArray){
        this.tempArray = JSON.parse(this.tempArray);
      }else{
        this.tempArray = [];
      }
    }catch(e){
      
    }
    return this.tempArray;
  }

  isStockinWatchlist(ticker: string){
    this.tempArray=this.getStockFromWatchlist();
    if(this.tempArray){
      for(let arr of this.tempArray){
        if(arr['ticker'] == ticker)
          return true;
      }
    }else
      return false;
    return false;
  }

  setWatchlist(ticker: string, name: string){
    this.tempArray = this.getStockFromWatchlist();
    try{
      if(this.tempArray){
        this.tempArray.push({ticker, name});
      }else{
        this.tempArray = [{ticker, name}];
      }
      localStorage.setItem('watchlist',JSON.stringify(this.tempArray));
    }catch(e){
     
    }
  }

  removeFromWatchlist(ticker: string){
    this.tempArray = this.getStockFromWatchlist();
    
      const idx = this.tempArray.findIndex((data:any)=>{
        return data['ticker']==ticker;
      });
      if(idx!=-1){
        this.tempArray.splice(idx,1);
        if(this.tempArray.length == 0){
          localStorage.removeItem('watchlist');
        }else{
          localStorage.setItem('watchlist',JSON.stringify(this.tempArray));
        }
      }
    
  }

  

  constructor() { }
}
