import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
    form: FormGroup = new FormGroup({
      search: new FormControl<string>('')
    });
}