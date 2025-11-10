import { AnswersQuestions, Question } from '@serenity-js/core';
import axios from 'axios';

export class Listings {
    
    static inCatalog = () =>
        Question.about<string[]>('the current listings in the catalog', async (actor: AnswersQuestions) => {
            const response = await axios.get('http://localhost:3000/api/listings');   // ✅ update URL if needed
            return response.data.map((item: any) => item.title);
        });
}
