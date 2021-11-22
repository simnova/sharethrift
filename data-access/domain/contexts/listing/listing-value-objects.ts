import {
  VOSet,
  VOString,
  VOArray
} from '@lucaspaganini/value-objects';
import { DraftStatusCodes } from './draft-status';


export class DraftStatusCode extends VOSet(Object.values(DraftStatusCodes)) {}
export class StatusDetail extends VOString({trim:true, maxLength:2000}) {}

export class Title extends VOString({trim:true, maxLength:100}) {}
export class Description extends VOString({trim:true, maxLength:2000}) {}

class Tag extends VOString({trim:true, maxLength:100}) {}
export class Tags extends VOArray(Tag, {maxLength:20}) {}