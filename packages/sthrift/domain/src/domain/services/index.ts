import type { BlobStorage } from './blob-storage.ts';
import type { TransactionalEmailService } from './transactional-email.ts';

export interface Services {
    BlobStorage: BlobStorage;
    TransactionalEmailService: TransactionalEmailService;
}