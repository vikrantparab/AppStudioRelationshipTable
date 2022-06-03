import * as _ from "lodash";
const transform = _.transform;
const isEqual = _.isEqual;
const isArray = _.isArray;
const isObject = _.isObject;

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
export function getDiffObjects(
  origObj: any,
  newObj: any,
  ignoredKeys: string[]
) {
  function changes(newObj: any, origObj: any) {
    let arrayIndexCounter = 0;
    return transform(newObj, function (result: any, value: any, key: any) {
      if (ignoredKeys.includes(key) && value) {
        result[key] = value;
      } else if (!isEqual(value, origObj[key])) {
        let resultKey = isArray(origObj) ? arrayIndexCounter++ : key;

        result[resultKey] =
          isObject(value) && isObject(origObj[key])
            ? changes(value, origObj[key])
            : value;
      }
    });
  }
  return changes(newObj, origObj);
}

export function generateGuidId(): string {
  var id = "";
  for (var i = 0; i < 8; i++) {
    id += getHexaDigit();
  }
  // id += "-";
  for (var i = 0; i < 4; i++) {
    id += getHexaDigit();
  }
  // id += "-";
  for (var i = 0; i < 4; i++) {
    id += getHexaDigit();
  }
  // id += "-";
  for (var i = 0; i < 4; i++) {
    id += getHexaDigit();
  }
  // id += "-";
  for (var i = 0; i < 12; i++) {
    id += getHexaDigit();
  }
  return id;
}

function getHexaDigit() {
  return Math.floor(Math.random() * 16)
    .toString(16)
    .toLowerCase();
}

export function createStyledText(stylingProperties: any) {
  const { backgroundColor, foregroundColor, underline, italic, bold } =
    stylingProperties;
  return `background-color: ${backgroundColor}; color: ${foregroundColor}; font-weight: ${
    bold ? "bold" : ""
  }; font-style: ${italic ? "italic" : ""}; text-decoration: ${
    underline ? "underline" : ""
  };`;
}

export enum LogicalOperators {
  And = 1,
  Or = 2,
}

export enum Operators {
  Contains = 1,
  EqualTo = 2,
  NotEqualTo = 3,
  LessThan = 4,
  GreaterThan = 5,
  LessThanEqualTo = 6,
  GreaterThanEqualTo = 7,
  StartsWith = 8,
  EndsWith = 9,
  Between = 10,
}
