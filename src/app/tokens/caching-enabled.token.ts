import { HttpContextToken } from "@angular/common/http";

export const CACHING_ENABLED = new HttpContextToken<boolean>(() => false);
export const PAGE_URL = new HttpContextToken<string>(() => '')
