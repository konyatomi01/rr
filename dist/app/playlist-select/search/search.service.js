import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let SearchService = class SearchService {
    constructor(fb) {
        this.fb = fb;
        this.form = this.fb.group({
            search: ['']
        });
    }
    ngOnInit() {
    }
};
SearchService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], SearchService);
export { SearchService };
//# sourceMappingURL=search.service.js.map