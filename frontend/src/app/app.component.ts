import { Component } from '@angular/core';
import { PortfolioServiceService } from './services/portfolio-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(private portfolioService: PortfolioServiceService) {}

  ngOnInit(){
    this.portfolioService.initializeMoneyInWallet();
  }

}
