// apps/api/screenplay/questions/listing-in-db.ts
import { Question } from '@serenity-js/core';
import { GraphQLClient, gql } from 'graphql-request';

export const Listings = Question.about('the list of current listings', async actor => {
  const endpoint = 'http://localhost:7071/api/graphql'; // Update if your GraphQL endpoint differs
  const client = new GraphQLClient(endpoint);
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
  const data = await client.request<{ listings: any[] }>(query);
  return data.listings;
});
