import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateManagementService {

  companyProfile: any;
  stockPrice: any;
  companyPeers: any;
  companyNews: any = [];
  insightsEPSChart: any;
  insightsSentiments: any;
  insightsRecommendationsChart: any;
  dailyChartsData: any;
  historicalChartsData: any;
  ticker: string;

  constructor() { 
    this.ticker='home';
  }

  public getNew: EventEmitter<any> = new EventEmitter()
    

    saveCompanyProfile(companyProfile: any, companyStockData: any, peersArray:any, dailyChartsData: any) {
        this.companyProfile=companyProfile;
        this.stockPrice=companyStockData;
        this.companyPeers=peersArray;
        this.dailyChartsData = dailyChartsData;
        
    }
  
    setTicker(ticker: string) {
        this.ticker = ticker;
        this.getNew.emit('New Data');
    }


    checkCompanyProfile() {
        return this.companyProfile && this.stockPrice && this.companyPeers;
    }

    changeToNoData() {
        this.companyProfile=undefined;
        this.stockPrice=undefined;
        this.companyPeers=undefined;
        
        
    }

}
