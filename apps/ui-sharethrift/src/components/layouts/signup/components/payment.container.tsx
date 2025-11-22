import { type FC, useMemo } from 'react';
import {
	type PaymentContainerAccountPlansFieldsFragment,
	PaymentContainerPersonalUserCybersourcePublicKeyIdDocument,
	type ProcessPaymentInput,
	AppContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
	PaymentContainerAccountPlansDocument,
	PaymentContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
	SignUpPaymentContainerPersonalUserProcessPaymentDocument,
} from '../../../../generated.tsx';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { countriesMockData } from './countries-mock-data.ts';
import { message } from 'antd';
import { Payment } from './payment.tsx';
import { useNavigate } from 'react-router-dom';

export const PaymentContainer: FC = () => {
	const navigate = useNavigate();

	const {
		data: personalUserCybersourcePublicKeyIdData,
		loading: personalUserCybersourcePublicKeyIdLoading,
		error: personalUserCybersourcePublicKeyIdError,
	} = useQuery(PaymentContainerPersonalUserCybersourcePublicKeyIdDocument);

	const {
		data: currentPersonalUserData,
		loading: currentPersonalUserLoading,
		error: currentPersonalUserError,
	} = useQuery(PaymentContainerCurrentPersonalUserAndCreateIfNotExistsDocument);

	const {
		data: accountPlansData,
		loading: accountPlansLoading,
		error: accountPlansError,
	} = useQuery(PaymentContainerAccountPlansDocument);

	const [refetchCurrentUserData] = useLazyQuery(
		AppContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
    { fetchPolicy: 'network-only' },
	);

	const [processPayment] = useMutation(
		SignUpPaymentContainerPersonalUserProcessPaymentDocument,
		// {
		// 	refetchQueries: [
		// 		AppContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
		// 	],
		// },
	);

	const handleSubmitPayment = async (paymentData: ProcessPaymentInput) => {
		console.log('Payment data submitted:', paymentData);
		const result = await processPayment({ variables: { input: paymentData } });
		if (result.data?.processPayment.success) {
      await refetchCurrentUserData();
			message.success('Payment processed successfully');
			// navigate to home
			navigate('/home');
			message.success('Welcome to ShareThrift! Your account has been created.');
		} else {
			message.error(
				`Payment failed: ${result.data?.processPayment || 'Unknown error'}`,
			);
		}
	};

	const selectedAccountPlan = useMemo(() => {
		const selectedPlanName =
			currentPersonalUserData?.currentPersonalUserAndCreateIfNotExists.account
				?.accountType;
		return (
			accountPlansData?.accountPlans?.find(
				(plan) => plan?.name === selectedPlanName,
			) || null
		);
	}, [currentPersonalUserData, accountPlansData]);

	return (
		<ComponentQueryLoader
			loading={
				personalUserCybersourcePublicKeyIdLoading ||
				currentPersonalUserLoading ||
				accountPlansLoading
			}
			error={
				personalUserCybersourcePublicKeyIdError ||
				currentPersonalUserError ||
				accountPlansError
			}
			hasData={
				personalUserCybersourcePublicKeyIdData &&
				currentPersonalUserData &&
				accountPlansData
			}
			hasDataComponent={
				<Payment
					cyberSourcePublicKey={
						personalUserCybersourcePublicKeyIdData?.personalUserCybersourcePublicKeyId ??
						''
					}
					countries={countriesMockData}
					onSubmitPayment={handleSubmitPayment}
					selectedAccountPlan={
						selectedAccountPlan as PaymentContainerAccountPlansFieldsFragment
					}
				/>
			}
		/>
	);
};
