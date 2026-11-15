import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { catchError, concat, debounceTime, distinctUntilChanged, from, map, Observable, of, startWith, switchMap } from 'rxjs';

export type SearchState<T> =
  | { status: 'idle' }
  | { status: 'loading'; term: string }
  | { status: 'done'; term: string; items: T[] }
  | { status: 'error'; term: string };

const DEBOUNCE_MS = 300;

/**
 * Search-as-you-type: waits for a pause in typing, and only the latest term's results are shown
 * (an older, slower response can't overwrite a newer one). Call in an injection context.
 */
export function searchState<T>(
  control: FormControl<string>,
  search: (term: string) => Promise<T[]>,
  defaultTerm = '',
): Signal<SearchState<T>> {
  const states: Observable<SearchState<T>> = control.valueChanges.pipe(
    startWith(control.value),
    map(value => value.trim() || defaultTerm),
    debounceTime(DEBOUNCE_MS),
    distinctUntilChanged(),
    switchMap(term =>
      !term
        ? of<SearchState<T>>({ status: 'idle' })
        : concat(
            of<SearchState<T>>({ status: 'loading', term }),
            from(search(term)).pipe(
              map(items => ({ status: 'done', term, items }) as SearchState<T>),
              catchError(() => of<SearchState<T>>({ status: 'error', term })),
            ),
          ),
    ),
  );
  return toSignal(states, { initialValue: { status: 'idle' } });
}
