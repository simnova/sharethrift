import { Task, Interaction } from '@serenity-js/core';
import { GraphQLClient, gql } from 'graphql-request';

export class CreateListing {

    static withTitle = (title: string) =>
        Task.where(`#actor creates a new listing titled "${ title }"`,
            Interaction.where(`#actor sends GraphQL mutation to create listing titled "${ title }"`,
                async (_actor) => {
                    const endpoint = 'http://localhost:7071/api/graphql';
                    const client = new GraphQLClient(endpoint);
                    
                    const mutation = gql`
                        mutation CreateItemListing($input: CreateItemListingInput!) {
                            createItemListing(input: $input) {
                                id
                                title
                                description
                                category
                                location
                                state
                            }
                        }
                    `;
                    
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const nextMonth = new Date();
                    nextMonth.setDate(nextMonth.getDate() + 30);
                    
                    await client.request(mutation, {
                        input: {
                            title,
                            description: 'test auto generated listing',
                            category: 'general',
                            location: 'test location',
                            sharingPeriodStart: tomorrow.toISOString(),
                            sharingPeriodEnd: nextMonth.toISOString(),
                            images: [],
                            isDraft: false
                        }
                    });
                }
            )
        );
}
