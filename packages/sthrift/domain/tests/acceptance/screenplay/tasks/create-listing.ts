import { Task, Interaction } from '@serenity-js/core';
import axios from 'axios';

export class CreateListing {

    static withTitle = (title: string) =>
        Task.where(`#actor creates a new listing titled "${ title }"`,
            Interaction.where(`#actor sends POST to create listing titled "${ title }"`,
                async (actor) => {
                    await axios.post('http://localhost:3000/api/listings', {
                        title,
                        description: 'test auto generated listing',
                        category: 'general',
                        condition: 'good',
                    });
                }
            )
        );
}
