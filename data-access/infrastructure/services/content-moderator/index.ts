import { ContentModeratorClient } from '@azure/cognitiveservices-contentmoderator';
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js';

export enum ModeratedContentType {
  PlainText = "text/plain",
  HTML = "text/html",
  Markdown = "text/markdown",
  XML = "text/xml",
}

export interface ModerationResult {
  IsApproved: boolean;
}

export class ContentModerator {
  private readonly subscriptionKeyEnvVar = 'CONTENT_MODERATOR_SUBSCRIPTION_KEY';
  private readonly endpointEnvVar = 'CONTENT_MODERATOR_ENDPOINT';
  private client: ContentModeratorClient;

  tryGetEnvVar(envVar:string):string{
    const value = process.env[envVar];
    if(value === undefined){
      throw new Error(`Environment variable ${envVar} is not set`);
    }
    return value;
  }

  constructor(){
    const credentials = new CognitiveServicesCredentials(this.tryGetEnvVar(this.subscriptionKeyEnvVar));
    const endpoint = this.tryGetEnvVar(this.endpointEnvVar);
    this.client = new ContentModeratorClient(credentials, endpoint);
  }
  
  moderateText(textToModerate:string, contentType: ModeratedContentType):Promise<ModerationResult>{
    console.log(`Moderating text: ${textToModerate}`);
    return this.client
      .textModeration
      .screenText(contentType, textToModerate, {
        language: "eng",
        autocorrect: false,
        pII: false,
        classify: true

      })
      .then(result => {
        console.log(`Moderation result: ${JSON.stringify(result)}`);
        return {
          
          IsApproved: !result.classification.reviewRecommended
          }
      });
  }
  
}