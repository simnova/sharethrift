
import type { DataSources } from '@sthrift/persistence';
export const generatePublicKey = (dataSources: DataSources) => {
  return async (): Promise<string> => {
    const publicKey = await dataSources.paymentDataSource?.PersonalUser.PersonalUser.PaymentPersonalUserRepo.generatePublicKey();
    if (!publicKey) {
      throw new Error('Payment data source is not available');
    }
    return publicKey;
  };
};