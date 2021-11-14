import {
  VOSet,
  VOString
} from '@lucaspaganini/value-objects';
import { DraftStatusCodes } from './draft-status';


export class DraftStatusCode extends VOSet(Object.values(DraftStatusCodes)) {}
export class StatusDetail extends VOString({trim:true, maxLength:2000}) {}