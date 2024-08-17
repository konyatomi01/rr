"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Array.prototype.remove = function (elementToRemove) {
    const indexToRemove = this.indexOf(elementToRemove);
    if (indexToRemove !== -1) {
        this.splice(indexToRemove, 1);
    }
    return this;
};
Array.prototype.countDistinctValues = function (property) {
    const distinctValues = new Set();
    this.forEach((item) => {
        if (item[property] !== undefined) {
            distinctValues.add(item[property]);
        }
    });
    return distinctValues.size;
};
//# sourceMappingURL=util.js.map