import { type AnswersQuestions, Question } from '@serenity-js/core';
import { GraphQLClient, gql } from 'graphql-request';

export const inCatalog = () =>
    Question.about<string[]>('the current listings in the catalog', async (_actor: AnswersQuestions) => {
        const endpoint = 'http://localhost:7071/api/graphql'; // Update if your GraphQL endpoint differs
        const client = new GraphQLClient(endpoint);
        const query = gql`
            query {
                listings {
                    title
                }
            }
        `;
        const data = await client.request<{ listings: { title: string }[] }>(query);
        // Adjust path if your schema differs
        return data.listings.map((item) => item.title);
    });
