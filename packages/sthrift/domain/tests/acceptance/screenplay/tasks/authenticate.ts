import { Task, Interaction } from '@serenity-js/core';
import axios from 'axios';

export class Authenticate {

    static asRegisteredUser = () =>
        Task.where(`#actor authenticates as a registered user`,
            Interaction.where(`#actor sends POST to login`,
                async (actor) => {
                    await axios.post('http://localhost:3000/api/auth/login', {
                        email: 'test@example.com',
                        password: 'password123'
                    });
                }
            )
        );
}
