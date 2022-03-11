import {AbstractControl} from '@angular/forms';

export function avoidSimbols(control: AbstractControl): { symbols: boolean } | null {
  if (!/^[^`~!@#$%\^& *()_+={}|[\]\\:';"<>?,./]*$/.test(control.value)) {
    return {symbols: true};
  }
  return null;
}
