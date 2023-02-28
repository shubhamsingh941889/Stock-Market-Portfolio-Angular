import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateManagementService } from 'src/app/services/state-management.service';
import { WatchlistServiceService } from 'src/app/services/watchlist-service.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  itemsList: Array<any> = [];
  dataList: any =[];
  showError: Boolean = true;
  constructor(private watchlistService: WatchlistServiceService, private http: HttpClient, private router: Router, private stateManager: StateManagementService) { }

  ngOnInit(): void {
    this.itemsList = this.watchlistService.getStockFromWatchlist();
    if(this.itemsList.length == 0){

      this.showError = true;
    }else{
      for(let item of this.itemsList){
        this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getStockPrice?ticker='+item['ticker'])
        .subscribe((res: any)=>{
          let stockData = res['data'];
          let price = stockData['c'];
          let priceChange = stockData['d'];
          let percentageChange = stockData['dp'];
          let ticker = item['ticker'];
          let name = item['name'];
          this.dataList.push({ticker, name, price, priceChange, percentageChange});
        });
      }
      
      this.showError = false;
    }

  }

  
  removeItem(ticker: string){
    this.watchlistService.removeFromWatchlist(ticker);
    for(let [index, item] of this.dataList.entries()){
      if(item['ticker'] == ticker){
        this.dataList.splice(index,1);
        break;
      }
    }
    if(this.dataList.length==0)
      this.showError=true;

  }

  navigateRoute(ticker: string){
    this.stateManager.changeToNoData();
    this.stateManager.setTicker('');
    this.router.navigate(["/search/",ticker]);
  }

}
