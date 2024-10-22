import { Routes } from "@angular/router";
import { UnitsListComponent } from "./units-list/units-list.component";
import { UnitComponent } from "./unit/unit.component";

export const UNITS_ROUTES: Routes = [
    {path: '', component: UnitsListComponent},
    {path: 'new', component: UnitComponent},
    {path: ':id', component: UnitComponent},
]