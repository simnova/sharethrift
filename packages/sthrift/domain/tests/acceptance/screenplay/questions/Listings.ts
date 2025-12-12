import { type AnswersQuestions, Question } from '@serenity-js/core';
import { gql } from 'graphql-request';
import { createGraphQLClient } from './graphql-helper.ts';

export const inCatalog = () =>
    Question.about<string[]>('the current listings in the catalog', async (_actor: AnswersQuestions) => {
        const client = createGraphQLClient();
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

