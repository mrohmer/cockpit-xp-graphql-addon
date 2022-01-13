import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from './components/footer/footer.component';
import {RouterModule} from '@angular/router';
import {ErrorNotFoundComponent} from './pages/error-not-found/error-not-found.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {NavigationItemComponent} from './components/navigation-item/navigation-item.component';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';
import {State, Store} from '@ngrx/store';
import {ApplicationState} from '$core/models/state';
import {createApolloLink} from '$core/utils/apollo-link.util';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [FooterComponent, ErrorNotFoundComponent, NavigationComponent, NavigationItemComponent],
  imports: [CommonModule, RouterModule, HttpClientModule],
  exports: [FooterComponent, ErrorNotFoundComponent, NavigationComponent],
})
export class CoreModule {}
