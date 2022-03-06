import {
  VOString
} from '@lucaspaganini/value-objects';

export class Name extends VOString({trim:true, maxLength:200}) {}
export class Handle extends VOString({trim:true, maxLength:50}) {}