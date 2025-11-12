import { Task, Interaction } from '@serenity-js/core';
import { GraphQLClient, gql } from 'graphql-request';

export class Authenticate {

    static asRegisteredUser = () =>
        Task.where(`#actor authenticates as a registered user`,
            Interaction.where(`#actor sends POST to login`,
                async (actor) => {
                    const endpoint = 'http://localhost:7071/api/graphql'; // update the endpoint
                    const client = new GraphQLClient(endpoint);
                    const mutation = gql`
                        mutation Login($email: String!, $password: String!) {
                            login(email: $email, password: $password) {
                                token
                                user {
                                    id
                                    email
                                }
                            }
                        }
                    `;
                    await client.request(mutation, {
                        email: 'test@example.com',
                        password: 'password123'
                    });
                }
            )
        );
}
