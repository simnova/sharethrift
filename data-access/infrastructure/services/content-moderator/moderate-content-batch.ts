import { ContentModerator, ModeratedContentType } from './index';

export interface ModerationResult {
  batchApproved: boolean;
  failedKey: string;
}

export async function moderateContentBatch(contentWithKeys: Map<string, string>): Promise<ModerationResult> {
  let contentModerator = new ContentModerator();
  for (let key in contentWithKeys) {
    let textToModerate = contentWithKeys[key];
    if (textToModerate.trim().length == 0) {
      continue; // skip empty content
    }
    let result = await contentModerator.moderateText(textToModerate, ModeratedContentType.PlainText);
    if (!result.IsApproved) {
      return {batchApproved:false, failedKey:key} as ModerationResult;
    }
  }
  return {batchApproved:true, failedKey:''} as ModerationResult;
} 