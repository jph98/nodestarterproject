const _ = require('lodash');

function onlyResult(array) {
  if (_.isEmpty(array[0])) {
    throw new Error('Could not find only result in collection');
  }
  return array[0];
}

function booleanResult(res) {
  if (res[0] != null) {
    return true;
  }
  return false;
}

function attributeOfOnlyResult(res, attr) {
  if (_.isEmpty(res[0])) {
    throw new Error('Could not find result for attr in collection');
  } else {
    return res[attr];
  }
}

module.exports = {
  onlyResult,
  booleanResult,
  attributeOfOnlyResult,
};
