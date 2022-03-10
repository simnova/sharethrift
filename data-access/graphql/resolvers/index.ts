import { Resolvers } from '../generated';
import path  from 'path';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

const resolversArray = loadFilesSync(path.join(__dirname, "./**/*.resolvers.*"));
const permissionsArray = loadFilesSync(path.join(__dirname, "./**/*.permissions.*"));

export const resolvers: Resolvers = mergeResolvers(resolversArray);
const getPermissionsArray = (permissionsArr) => {
  //TODO: understand why just calling merge resolvers alone didn't seem to work? Maybe console log is helping?
  console.log('permissionsArr',permissionsArr);
  var result = mergeResolvers(permissionsArr);
  console.log('mergedPermissions-result',result);
  return result;
}
export const permissions = getPermissionsArray(permissionsArray);