// Angular modules
import { Component, OnInit } from '@angular/core';

// JWT helper service
import { JwtHelperService } from '@services/security/jwt-helper.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  /**
   * Component constructor
   * 
   * @param jwtHelper The jwt helper service
   * 
   * @author EL OUFIR Hatim <eloufirhatim@gmail.com>
   */
  constructor(
    public jwtHelper: JwtHelperService
  ) { }

  /**
   * Component OnInit phase
   *
   * @author EL OUFIR Hatim <eloufirhatim@gmail.com>
   */
  ngOnInit(): void { }

  /**
   * Check if logged user has an authority based on a String
   * 
   * @param role The authority's code
   *
   * @author EL OUFIR Hatim <eloufirhatim@gmail.com>
   */
  hasRole(role: string): Boolean {
    return this.jwtHelper.hasRole(role);
  }

}
