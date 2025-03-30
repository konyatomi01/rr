import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
    search = new FormControl<string>('', { validators: [Validators.required] });
}