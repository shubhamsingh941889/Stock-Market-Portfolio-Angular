import { Component, OnChanges, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NavigationStart, Router } from '@angular/router';
import { StateManagementService } from 'src/app/services/state-management.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnChanges {
  route: string;
  currentUrlPat='search';
  

  constructor(public maintainState: StateManagementService,public myrouter: Router, private breakpointObserver: BreakpointObserver) { 
    this.route='home';
  }

  isMenuCollapsed=true;
  inWidth:any;

  ngOnChanges(): void {
    this.route=this.maintainState.ticker;
    this.maintainState.getNew.subscribe((val)=>{
      
      this.route=this.maintainState.ticker;
      if(this.route==undefined) {
        this.route='home';
      }
      
      
    })
  }

  
  
  navHeight(){
  
   
    const body = document.querySelector<HTMLElement>('body');
      if(!this.isMenuCollapsed) {
        if(body)
        body.style.paddingTop='150px';
        
      } else {
        
        if(body)
        body.style.paddingTop='20px';
      }
  }

  anchorCollapse() {
    if(this.inWidth) {
      this.navHeight();
      this.isMenuCollapsed=!this.isMenuCollapsed
      
    }
  }

  
  
  ngOnInit(): void{
    
    this.breakpointObserver.observe([
      "(max-width: 768px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
          this.inWidth=true;  
          console.log('Mobile');     
      } else {
        this.inWidth=false;
        console.log('Desktop');   
      }
    });
    this.navHeight();
    this.route=this.maintainState.ticker;
    this.maintainState.getNew.subscribe((val)=>{
      
      
      this.route=this.maintainState.ticker;
      if(this.route==undefined) {
        this.route='home';
      }
      
      
    });
    
    this.myrouter.events
  .subscribe((event) => {
    if (event instanceof NavigationStart) {
      const urlDelimitators = new RegExp(/[?//,;&:#$+=]/);
      let currentUrlPath = event.url.slice(1).split(urlDelimitators)[0];
      this.currentUrlPat = currentUrlPath;
    }
  });
  }

}
