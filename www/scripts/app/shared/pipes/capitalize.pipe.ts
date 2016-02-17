import { Pipe } from 'angular2/core';

@Pipe({ name: 'capitalize' })
export class CapitalizePipe {

  transform(value: any) {
	  if (value) {
      	return value.charAt(0).toUpperCase() + value.slice(1);
	  }
	  return value;
  }

}