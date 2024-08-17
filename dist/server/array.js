"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Array.prototype.remove = function (elementToRemove) {
    const indexToRemove = this.indexOf(elementToRemove);
    if (indexToRemove !== -1) {
        this.splice(indexToRemove, 1);
    }
    return this;
};
