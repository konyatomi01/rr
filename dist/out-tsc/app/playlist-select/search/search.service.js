"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
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
exports.SearchService = SearchService;
exports.SearchService = SearchService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root'
    })
], SearchService);
//# sourceMappingURL=search.service.js.map