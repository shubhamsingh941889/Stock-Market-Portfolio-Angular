



import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { StateManagementService } from 'src/app/services/state-management.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dataFound: Boolean = false;
  retrievedcompanyProfile: Boolean = false;
  displayNotFound: Boolean = false;
  dataLoading: Boolean = false;
  apiLImit: Boolean = false;
  dataLoaded: Boolean = false;

  timer:any;
  ticker: any = '';
  currTime: any;
  

  companyProfile: any;
  stockPrice: any;
  dailyChartsData: any;
  historicalChartsData: any;
  companyPeers: any;
  companyNews: any = [];
  insightsSentiments: any;
  insightsEPSChart: any;
  insightsRecommendationsChart: any;
  
  
  constructor(private route: ActivatedRoute, private maintainState: StateManagementService, private http: HttpClient) { }
  
  ngOnInit(): void {

    if(this.maintainState.checkCompanyProfile() || (this.maintainState.ticker!=='home' && this.maintainState.ticker)) {
     
      this.dataLoaded=true;
      
      if(this.timer) clearTimeout(this.timer);
      this.companyProfile = this.maintainState.companyProfile;
      this.stockPrice = this.maintainState.stockPrice
      this.companyPeers = this.maintainState.companyPeers
      this.dailyChartsData=this.maintainState.dailyChartsData
      this.historicalChartsData=this.maintainState.historicalChartsData
      this.companyNews=this.maintainState.companyNews
      this.insightsSentiments=this.maintainState.insightsSentiments
      this.insightsRecommendationsChart=this.maintainState.insightsRecommendationsChart
      this.insightsEPSChart=this.maintainState.insightsEPSChart
      
      
      if(this.companyProfile!==undefined) {
        this.dataLoading=false;
        
        const ticker=this.companyProfile['ticker'];
        this.ticker=this.companyProfile['name'];
        this.displayNotFound=false;
        this.retrievedcompanyProfile=true;
        this.dataFound=true;
        
      } 
      else {
        this.dataFound=false;
        this.displayNotFound=true;
        this.dataLoading=false;
        this.retrievedcompanyProfile=false;
        
      }
      
    }
    
    this.route.params.subscribe((input: Params)=>{
      
      if(this.timer) clearTimeout(this.timer);
      if(input['ticker'] === 'home'){
        this.displayNotFound=false;
        this.dataFound=false;
        this.retrievedcompanyProfile = false;
        this.apiLImit=false;
        this.maintainState.setTicker('home');
      }else if(!this.dataLoaded){
        this.displayNotFound=false;
        
        this.dataLoading=true;
        this.apiLImit=false;
        this.dataFound = false;
        
        this.maintainState.setTicker(input['ticker']);
        this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getcompanyProfile?ticker='+input['ticker'])
        .subscribe((res: any)=>{
          
          this.companyProfile = res['data'];
          

          if(Object.keys(this.companyProfile).length == 0){
            this.maintainState.changeToNoData();
            this.displayNotFound = true;
            this.retrievedcompanyProfile = false;
            this.apiLImit=false;
            this.dataFound = false;
            this.dataLoading=false;
          }
          else{

            this.displayNotFound = false;
            this.apiLImit=false;

            this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getStockPrice?ticker='+input['ticker'])
            .subscribe((res: any)=>{

              
              this.stockPrice = res['data'];
              
              
              let toTime: any
              if(this.checkMarketStatus(this.stockPrice['t'])){
                toTime =  new Date().getTime();
              }else{
                toTime =  this.stockPrice['t']*1000;
              }

              
              toTime = Math.floor(toTime/1000);
              

              
                
              this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getDailyChartsData?ticker='+input['ticker']+'&timeInterval=5&toTime='+toTime)
                .subscribe((res: any)=>{
                
                
                this.dailyChartsData = res['data'];

                this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getCompanyPeers?ticker='+input['ticker'])
            .subscribe((res: any)=>{
              
              this.companyPeers = res['data'];
              this.dataFound = true;
              this.retrievedcompanyProfile=true;
              this.dataLoading = false;
              this.maintainState.saveCompanyProfile(this.companyProfile, this.stockPrice, this.companyPeers, this.dailyChartsData);
            });
                
              });

              if(this.checkMarketStatus(this.stockPrice['t'])){
              this.timer= setInterval(() => {
                  
                  
                  this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getStockPrice?ticker='+input['ticker'])
                .subscribe((res: any)=>{
                  
              
              this.stockPrice = res['data'];
              this.dataFound = true;
              this.retrievedcompanyProfile = true;
              
              

              let toTime= new Date().getTime();
              
              
              
              
              

              
              toTime = Math.floor(toTime/1000);
              
              
                this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getDailyChartsData?ticker='+input['ticker']+'&timeInterval=5&toTime='+toTime)
                .subscribe((res: any)=>{
                
                
                this.dailyChartsData = res['data'];
                
              });
            });

              }, 15 * 1000);
              }

            });

            

            

            this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getCompanyNews?ticker='+input['ticker'])
            .subscribe((res: any)=>{
              
              this.companyNews = res['data'];
              
              
              
              
              
              
              
              
              
              
              
              this.maintainState.companyNews = this.companyNews;
            });

            this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getCompanyEPSChart?ticker='+input['ticker'])
            .subscribe((res: any)=>{
              
              this.insightsEPSChart = res['data'];
              this.maintainState.insightsEPSChart = this.insightsEPSChart;
            });

            this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getInsightsSentiment?ticker='+input['ticker'])
            .subscribe((res: any)=>{
              
              this.insightsSentiments = res['data'];
              console.log('this.insightsSentiments '+this.insightsSentiments )
              this.maintainState.insightsSentiments = this.insightsSentiments;
            });

            this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getInsightsRecommendation?ticker='+input['ticker'])
            .subscribe((res: any)=>{
              
              this.insightsRecommendationsChart = res['data'];
              this.maintainState.insightsRecommendationsChart = this.insightsRecommendationsChart;
            });  
            
            this.http.get('https://backend-hw8-ss.uw.r.appspot.com/getHistoricalCharts?ticker='+input['ticker'])
            .subscribe((res: any)=>{
              
              this.historicalChartsData = res['data'];
              this.maintainState.historicalChartsData = this.historicalChartsData;
            });

            


          }


        }, (_)=>{

          this.displayNotFound=true;
          this.dataLoading=false;
          this.apiLImit=true;
          this.dataFound=false;
        });

          
      
      

        

        
      }
    })
    this.dataLoaded = false;
  }

  checkMarketStatus(params:any){
    let currTime = new Date().getTime();
    
    if((currTime - params*1000) > 60000)
      return false;
    else 
      return true;
  }

  

}
