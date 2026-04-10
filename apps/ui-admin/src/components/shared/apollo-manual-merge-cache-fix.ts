import { InMemoryCache } from '@apollo/client';
import merge from 'lodash/merge';

export const ApolloManualMergeCacheFix = new InMemoryCache({
	typePolicies: {
		AdminUser: {
			fields: {
				account: {
					merge(existing, incoming) {
						return merge({}, existing, incoming);
					},
				},
			},
		},
	},
});
