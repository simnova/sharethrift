// apps/api/screenplay/questions/listing-in-db.ts
import { Question } from '@serenity-js/core';
import { gql } from 'graphql-request';
import { createGraphQLClient, type ListingData } from './graphql-helper.ts';

export const Listings = Question.about('the list of current listings', async _actor => {
  const client = createGraphQLClient();
  const query = gql`
    query {
      listings {
        id
        title
        description
        category
        location
        sharingPeriodStart
        sharingPeriodEnd
      }
    }
  `;
  const data = await client.request<{ listings: ListingData[] }>(query);
  return data.listings;
});

