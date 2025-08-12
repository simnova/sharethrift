import { InMemoryCache } from '@apollo/client';
import _ from 'lodash';

// provide custom merge functions for nested objects
export const ApolloManualMergeCacheFix = new InMemoryCache({
  typePolicies: {
    ApplicantUser: {
      fields: {
        personalInformation: {
          merge(existing = {}, incoming) {
            const merged = _.merge({}, existing, incoming);
            // force replacement of arrays otherwise deleted items will not be removed
            if (incoming.applyingTo) {
              merged.applyingTo = incoming.applyingTo;
            }
            if (incoming.professional?.primaryEducationalInformation) {
              merged.professional.primaryEducationalInformation = incoming.professional.primaryEducationalInformation;
            }     
            if (incoming.contactInformation?.phone) {
              merged.contactInformation.phone = incoming.contactInformation.phone;
            }       
            if (incoming.citizenship?.currentCitizenOf) {
              merged.citizenship.currentCitizenOf = incoming.citizenship.currentCitizenOf;
            }
            return merged;
          }
        },
        termsAndConditions: {
          merge(_, incoming) {
            return incoming
          }
        },
      }
    },
    IdentityVerificationCaseV1: {
      fields: {
        caseDetails: {
          merge(existing = {}, incoming) {
            return _.merge({}, existing, incoming);
          }
        },
        revisionRequest: {
          merge(existing = {}, incoming) {
            return _.merge({}, existing, incoming);
          }
        },
        financeDetails: {
          merge(existing = {}, incoming) {
            return _.merge({}, existing, incoming);
          }
        }
      }
    },
    CredentialVerificationCaseV1: {
      fields: {
        caseDetails: {
          merge(existing = {}, incoming) {
            return _.merge({}, existing, incoming);
          }
        },
        revisionRequest: {
          merge(existing = {}, incoming) {
            return _.merge({}, existing, incoming);
          }
        },
        financeDetails: {
          merge(existing = {}, incoming) {
            return _.merge({}, existing, incoming);
          }
        }
      }
    },
    SendReportCaseV1: {
      fields: {
        caseDetails: {
          merge(existing = {}, incoming) {
            return _.merge({}, existing, incoming);
          }
        },
        revisionRequest: {
          merge(existing = {}, incoming) {
            return _.merge({}, existing, incoming);
          }
        },
        financeDetails: {
          merge(existing = {}, incoming) {
            return _.merge({}, existing, incoming);
          }
        }
      }
    },
    StaffRole: {
      fields: {
        permissions: {
          // Custom merge function for permissions because it does not have an id
          merge(existing = {}, incoming) {
            // Merge all nested the existing and incoming permissions objects
            return _.merge({}, existing, incoming);
          }
        }
      }
    }
  }
});
