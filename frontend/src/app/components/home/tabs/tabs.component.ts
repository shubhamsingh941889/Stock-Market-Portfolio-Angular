


import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from "highcharts/indicators/indicators";
import vbp from 'highcharts/indicators/volume-by-price';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  @Input() companyProfile: any;
  @Input() stockPrice:any;
  @Input() companyPeers:any;
  @Input() companyNews:any;
  @Input() insightsEPSChart:any;
  @Input() insightsRecommendationsChart:any;
  @Input() insightsSentiments:any;
  @Input() dailyChartsData:any;
  @Input() historicalChartsData={'h':[], 'c':[], 't':[], 'o':[], 'v':[], 'l':[]};
  

  Highcharts: typeof Highcharts = Highcharts; 
  HistoricalChartOptions: Highcharts.Options={};
  RecommendationOptions: Highcharts.Options={};
  EPSOptions: Highcharts.Options={};
  DailychartOptions: Highcharts.Options={};
  


  closeResult = '';
  item: any;
  
  
  displayEPSCharts: boolean = false;
  displayRecommendation: boolean = false;
  displayDailyChart: boolean = false;
  displayHistoricalChart: boolean = false;
  
    
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    
    IndicatorsCore(Highcharts);
    vbp(Highcharts);
  }

  ngOnChanges(){
    
   
    let dailyChartsData:any=[];
    if(this.dailyChartsData && this.dailyChartsData['c']) {
      this.dailyChartsData['c'].map((value:any, idx:any)=>{
        dailyChartsData.push([+this.dailyChartsData['t'][idx]*1000, value]);
      })
      


      let dip = this.stockPrice['d'] < 0;
    this.DailychartOptions = {
      
      time: {
        timezoneOffset: new Date().getTimezoneOffset()
      },
      title: {
        text: this.companyProfile['ticker']+" Hourly Price Variation"
      },
      plotOptions:{},
      xAxis: {
        type: 'datetime', 
        crosshair: true
      },
      yAxis: {
        opposite: true
       
      },
      legend:{
        enabled: false
      },
      navigator: {
        enabled: false
      },
      rangeSelector: {
        enabled: false
      },
      tooltip:{
        split:true
      },
      series: [{
        data: dailyChartsData,
        type: 'line',
        name: this.companyProfile['ticker'],
        marker: {
          enabled: false
        },
        color: !dip ? "var(--bs-success)" : "var(--bs-danger)",
        
      }],
      
    }

    this.displayDailyChart=true;


      
    }

    let historicalChartsData = {'xAxisName':[] as any, 'ohlc':[] as any, 'volume':[] as any};
    
    if(this.historicalChartsData && this.historicalChartsData['c']) {
      this.historicalChartsData['c'].map((value:any, idx:any)=>{
        historicalChartsData.ohlc.push([this.historicalChartsData['t'][idx]*1000, this.historicalChartsData['o'][idx], this.historicalChartsData['h'][idx], this.historicalChartsData['l'][idx], value])
        historicalChartsData.volume.push([this.historicalChartsData['t'][idx]*1000, this.historicalChartsData['v'][idx]])
      })
      console.log(historicalChartsData,'=====')

      this.HistoricalChartOptions = {
        chart:{
          reflow:true,
        },
        rangeSelector: {
          selected: 2,
        },
    
        title: {
          text: this.companyProfile['ticker'] + ' Historical',
        },
    
        subtitle: {
          text: 'With SMA and Volume by Price technical indicators',
        },
        yAxis: [
          {
            startOnTick: false,
            endOnTick: false,
            labels: {
              align: 'right',
              x: -3,
            },
            title: {
              text: 'OHLC',
            },
            height: '60%',
            lineWidth: 2,
            resize: {
              enabled: true,
            },
          },
          {
            labels: {
              align: 'right',
              x: -3,
            },
            title: {
              text: 'Volume',
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2,
          },
        ],
    
        tooltip: {
          split: true,
        },
    
        plotOptions: {
          series: {
            dataGrouping: {
              units: [
                ['day', [1]],
                ['week', [1]],
              ],
            },
          },
        },
    
        series: [
          {
            type: 'candlestick',
            name: this.companyProfile['ticker'],
            id: this.companyProfile['ticker'],
            zIndex: 2,
            data: historicalChartsData['ohlc'],
          },
          {
            type: 'column',
            name: 'Volume',
            id: 'volume',
            data: historicalChartsData['volume'],
            yAxis: 1,
          },
          {
            type: 'vbp',
            linkedTo:this.companyProfile['ticker'],
            params: {
              volumeSeriesID: 'volume',
            },
            dataLabels: {
              enabled: false,
            },
            zoneLines: {
              enabled: false,
            },
          },
          {
            type: 'sma',
            linkedTo:this.companyProfile['ticker'],
            zIndex: 1,
            marker: {
              enabled: false,
            },
          },
        ]
      }
      this.displayHistoricalChart=true;
 
    }




    let insightsRecommendation = {'xAxisName':[] as any, 'strongBuy':[] as any, 'buy':[] as any, 'hold':[] as any, 'sell':[] as any, 'strongSell':[]as any}

    if(this.insightsRecommendationsChart){
      
      for(let element of this.insightsRecommendationsChart) {
        insightsRecommendation.xAxisName.push(element['period'].substring(0, element['period'].lastIndexOf('-')));
        insightsRecommendation.strongBuy.push(element['strongBuy']);
        insightsRecommendation.buy.push(element['buy']);
        insightsRecommendation.hold.push(element['hold']);
        insightsRecommendation.sell.push(element['sell']);
        insightsRecommendation.strongSell.push(element['strongSell']);
        
      }

      this.RecommendationOptions = {
      
        chart: {
          type: 'column',
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [{data: insightsRecommendation.strongBuy, type: 'column', name: 'Strong Buy', color:'#186E37'},{data: insightsRecommendation.buy, type: 'column', name: 'Buy', color:'#1BB954'},{data: insightsRecommendation.hold, type: 'column', name: 'Hold', color:'#B98B1D'},{data: insightsRecommendation.sell, type: 'column', name: 'Sell', color:'#F45A5A'},{data: insightsRecommendation.strongSell, type: 'column', name: 'Strong Sell', color:'#803131'}],
        title: {
          text: 'Recommendation Trends'
        },
        xAxis: {
          categories: insightsRecommendation.xAxisName,
          labels: {
             format: '{value}'}
        },
        yAxis: {
          title: {
            text: '#Analysis',
            align:'high'
          },
          
        },responsive: {
          rules: [{
              condition: {
                  maxWidth: 600
              },
              chartOptions: {
                  legend: {
                      align: 'center',
                      verticalAlign: 'bottom',
                      layout: 'horizontal'
                  }
              }
          }]
      }
        
      };
      
      this.displayRecommendation=true;

    }

    if(this.insightsEPSChart){
  
      let EPSHistoricalData = {'xAxisName':[''] as any, 'estimate':[] as any, 'actual':[] as any, 'surprise':[] as any}
  
      for(let [index, element] of this.insightsEPSChart.entries()) {
        EPSHistoricalData.xAxisName.push(element['period'] +'<br/>Surprise: '+ String(element['surprise']));
        EPSHistoricalData.estimate.push([ index+1, element['estimate']]);
        EPSHistoricalData.actual.push([ index+1, element['actual']]);
        EPSHistoricalData.surprise.push(element['surprise']);
      }

      this.EPSOptions = {
        
        chart: {
          type: 'spline',
          
          
        },
        plotOptions: {
          spline: {
              marker: {
                  enabled: true
              }
          }
        },
        series: [{data:EPSHistoricalData['actual'], type: 'spline', name:'Actual'}, {data:EPSHistoricalData['estimate'], type: 'spline', name:'Estimate'}],
        title: {
          text: 'Historical EPS Surprises'
        },
        xAxis: 
          {categories: EPSHistoricalData.xAxisName, 
          
          },
        yAxis: {
          title: {
            text: 'Quantity EPS',
            align:'middle'
          },
         
          
        },
        tooltip: {
          shared:true
          
          
      },responsive: {
        rules: [{
            condition: {
                maxWidth: 600
            },
            chartOptions: {
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    layout: 'horizontal'
                }
            }
        }]
    }
        
      };
      this.displayEPSCharts = true;
      
    }


  }


  showNewsTab(newsContent: any, newsItem: any) {
    this.item = newsItem;
    
    
    this.modalService.open(newsContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
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

  
}



