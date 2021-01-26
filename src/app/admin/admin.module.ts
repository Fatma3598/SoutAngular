import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TalentsComponent } from './components/talents/talents.component';
import { MonitoringComponent } from './components/monitoring/monitoring.component';
import { BlockComponent } from './components/block/block.component';


@NgModule({
  declarations: [AdminComponent, HeaderComponent, FooterComponent, SidebarComponent, DashboardComponent, ReportsComponent, TalentsComponent, MonitoringComponent, BlockComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
