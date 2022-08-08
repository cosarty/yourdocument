const BASIC_TYPES = {
  Null: 'Null',
  Undefined: 'Undefined',
  String: 'String',
  Number: 'Number',
  Boolean: 'Boolean',
  Array: 'Array',
  Date: 'Date',
  Function: 'Function',
  RegExp: 'RegExp',
  Object: 'Object',
};

const getUniversalType = (tar) => Object.prototype.toString.call(tar).slice(8, -1).toLowerCase();

// 校验工具
module.exports = getUniversalType;
