import { GraphQLResolveInfo } from 'graphql';
import graphqlFields from 'graphql-fields'
import R, { map } from 'ramda';  

var getFields = (info: GraphQLResolveInfo) => {
  var x = graphqlFields(info);
  return graphqlFields(info);
}

const parseFields = (info: GraphQLResolveInfo) => {

  var fields = getFields(info);
  var mongoFields = getMongoFields(fields);
  return mongoFields;
  /*
  var fieldsArray = Object.keys(fields).map(key => fields[key]);
  var fieldsArray = R.flatten(fieldsArray);
  var fieldsArray = R.map(field => field.name, fieldsArray);
  var fieldsArray = R.filter(field => field !== '__typename', fieldsArray);
  return fieldsArray;
  */
}

export {parseFields};

var getMongoFields = (obj: any)  => {
  let response = ''
  
  const parse = (item: any):any => {
      if(R.isEmpty(item)) {
          return true
      }else { 
          return R.map(parse, item)
      }
  }

  const fieldsToString = (prefix, value, key) => {
      if(value === true && key !== '1') {
          response += `${prefix}${key}: 1 `
      }else {
          R.forEachObjIndexed((childValue, childKey) => fieldsToString(`${key}.`, childValue, childKey), value)
      }
  }
  R.forEachObjIndexed((value, key) => fieldsToString('', value, key), R.map(parse, obj))
  
  return response
}