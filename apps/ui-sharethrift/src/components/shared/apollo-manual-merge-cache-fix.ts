import { InMemoryCache } from '@apollo/client';
import _ from 'lodash';

export const ApolloManualMergeCacheFix = new InMemoryCache({
	typePolicies: {
		PersonalUser: {
			fields: {
				account: {
					merge(existing, incoming) {
						return _.merge({}, existing, incoming);
					},
				},
			},
		},
	},
});
