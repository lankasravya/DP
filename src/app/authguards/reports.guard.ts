import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../core/app.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ReportsGuard implements CanActivate {
  permissions: any;
  constructor(private toasterService: ToastrService,private appService: AppService) {
  };
  canActivate() {
    return this.appService.getPermissions().map(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {

          if (this.permissions[27]['activeS'] === 'Y' ||
            this.permissions[28]['activeS'] === 'Y' ||
            this.permissions[29]['activeS'] === 'Y' ||
            this.permissions[30]['activeS'] === 'Y' ||
            this.permissions[31]['activeS'] === 'Y' ||
            this.permissions[32]['activeS'] === 'Y' ||
            this.permissions[33]['activeS'] === 'Y' ||
            this.permissions[34]['activeS'] === 'Y' ||
            this.permissions[35]['activeS'] === 'Y' ||
            this.permissions[36]['activeS'] === 'Y' ||
            this.permissions[37]['activeS'] === 'Y' ||
            this.permissions[38]['activeS'] === 'Y' ||
            this.permissions[39]['activeS'] === 'Y' ||
            this.permissions[40]['activeS'] === 'Y' ||
            this.permissions[41]['activeS'] === 'Y' ||
            this.permissions[42]['activeS'] === 'Y' ||
            this.permissions[43]['activeS'] === 'Y' ||
            this.permissions[44]['activeS'] === 'Y' ||
            this.permissions[45]['activeS'] === 'Y' ||
            this.permissions[46]['activeS'] === 'Y' ||
            this.permissions[47]['activeS'] === 'Y' ||
            this.permissions[48]['activeS'] === 'Y' ||
            this.permissions[49]['activeS'] === 'Y' ||
            this.permissions[50]['activeS'] === 'Y' ||
            this.permissions[51]['activeS'] === 'Y' ||
            this.permissions[52]['activeS'] === 'Y' ||
            this.permissions[53]['activeS'] === 'Y' ||
            this.permissions[54]['activeS'] === 'Y' ||
            this.permissions[55]['activeS'] === 'Y' ||
            this.permissions[56]['activeS'] === 'Y' ||
            this.permissions[57]['activeS'] === 'Y' ||
            this.permissions[58]['activeS'] === 'Y' ||
            this.permissions[59]['activeS'] === 'Y' ||
            this.permissions[60]['activeS'] === 'Y' ||
            this.permissions[61]['activeS'] === 'Y' ||
            this.permissions[62]['activeS'] === 'Y' ||
            this.permissions[63]['activeS'] === 'Y' ||
            this.permissions[64]['activeS'] === 'Y' ||
            this.permissions[65]['activeS'] === 'Y' ||
            this.permissions[66]['activeS'] === 'Y' ||
            this.permissions[67]['activeS'] === 'Y') {
            return true;
          }
          else {
            this.toasterService.warning('You dont have access', 'Please Contact Administrator', {
              timeOut: 3000
            });
            return false;
          }
        }
        else {
          return false;
        }

      }
    });

  }
}
