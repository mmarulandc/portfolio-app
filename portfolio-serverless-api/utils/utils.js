module.exports.sendResponse = (statusCode, body) => {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  }
  return response
}


module.exports.generateUpdateQuery = (fields) => {
  let exp = {
      UpdateExpression: 'set',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {}
  }
  Object.entries(fields).forEach(([key, item]) => {
      exp.UpdateExpression += ` #${key} = :${key},`;
      exp.ExpressionAttributeNames[`#${key}`] = key;
      exp.ExpressionAttributeValues[`:${key}`] = item
  })
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
  return exp
}

//usage
// let data = {
//   'field' : { 'subfield': 123 },
//   'other': '456'
// }

// let expression = generateUpdateQuery(data)

// let params = {
//   // Key, Table, etc..
//   ...expression
// }

// console.log(params)