import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'search/:ticker' , component: HomeComponent },
  { path: 'portfolio' , component: PortfolioComponent },
  { path: 'watchlist' , component: WatchlistComponent },
  { path: '' , redirectTo: '/search/home' , pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
