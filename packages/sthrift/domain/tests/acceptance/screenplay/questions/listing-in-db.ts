// apps/api/screenplay/questions/listing-in-db.ts
import { Question } from '@serenity-js/core';
import { CallAnApi } from '@serenity-js/rest';

export const Listings = Question.about('the list of current listings', async actor => {
  const response = await CallAnApi.as(actor).request({ method: 'get', url: '/listings' });
  return response.data;
});
