import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BasicMenuComponent } from './user-interface/basic-menu/basic-menu.component';
import { ClassComponent } from './user-interface/class/class.component';
import { UserInterfaceComponent } from './user-interface/user-interface.component';
import { SupplierComponent } from './user-interface/supplier/supplier.component';
import { AddNewSupplierComponent } from './user-interface/supplier/add-new-supplier/add-new-supplier.component';
import { MaterialComponent } from './user-interface/material/material.component';
import { AddNewMaterialComponent } from './user-interface/material/add-new-material/add-new-material.component';
import { PermissionsComponent } from './user-interface/permissions/permissions.component';
import { AuthGuard } from './@guard/auth.guard';
import { StaffComponent } from './user-interface/staff/staff.component';

export const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent},
  { path: 'Interface', component: UserInterfaceComponent,children: [
    { path: 'BasicMenu', component: BasicMenuComponent },
    { path: 'Class', component: ClassComponent },
    { path: 'Staff', component: StaffComponent},
    { path: 'Supplier', component: SupplierComponent},
    { path: 'addNewSupplier', component: AddNewSupplierComponent },
    { path: 'Material' , component: MaterialComponent},
    { path: 'addNewMaterial' , component: AddNewMaterialComponent},
    { path: 'permissions' , component: PermissionsComponent, canActivate: [AuthGuard] }
  ], canActivate: [AuthGuard] }
];

// , canActivate: [AuthGuard]
