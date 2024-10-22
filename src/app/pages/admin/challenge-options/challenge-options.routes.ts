import { Routes } from "@angular/router";
import { ChallengeOptionsListComponent } from "./challenge-options-list/challenge-options-list.component";
import { ChallengeOptionComponent } from "./challenge-option/challenge-option.component";

export const CHALLENGE_OPTIONS_ROUTES: Routes = [
    {path:'', component: ChallengeOptionsListComponent},
    {path:'new', component: ChallengeOptionComponent},
    {path:':id', component: ChallengeOptionComponent},
]