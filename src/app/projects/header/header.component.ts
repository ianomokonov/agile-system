import { Component, Input } from '@angular/core';
import { MenuItem } from './menu-item';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent {
  @Input() public header = '';
  @Input() public menuItems: MenuItem[] = [];
}
