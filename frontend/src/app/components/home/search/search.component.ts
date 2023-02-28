





import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent  {
  filteredCompanies: any;
  userTicker:string='';
  showSpinner: Boolean = true;
  noData: boolean=false;
  showOptions: Boolean = false;

  
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe((param: Params)=>{
      if(param['ticker'] != 'home')
        this.userTicker = param['ticker'];
      else this.userTicker ='';
    });
  }

 
  
  findStockData() {
    
    if(this.userTicker!="") {
      this.noData=false;
      
      this.router.navigate(['/search', this.userTicker]);
    } else {
      this.showSpinner=false;
      this.noData=true;
      
    }
      
  }

  checkAutoComplete(event: any) {
    this.userTicker=event.target.value;
    
    if(this.userTicker!="")
     {
      this.showOptions=true;
      this.http.get('https://backend-hw8-ss.uw.r.appspot.com/performAutoComplete?queryName='+this.userTicker)
      .subscribe((res: any)=>{
            
            this.filteredCompanies = res.data;
            this.showSpinner=false;
      });
     }
     else {
      
      this.showOptions = false;
    }
     
    
  }
  handleSubmit(event: any) {
    event.preventDefault();
    this.showOptions=false;
  }

  clearData() {
    
    this.userTicker='';
    this.noData=false;
    this.router.navigate(['/search/home']);
    this.showOptions=false;

    
  }

  

}
