/*
 #
 # Copyright (c) 2018 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/scancode-workbench/
 # The ScanCode Workbench software is licensed under the Apache License version 2.0.
 # ScanCode is a trademark of nexB Inc.
 #
 # You may not use this software except in compliance with the License.
 # You may obtain a copy of the License at: http://apache.org/licenses/LICENSE-2.0
 # Unless required by applicable law or agreed to in writing, software distributed
 # under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 # CONDITIONS OF ANY KIND, either express or implied. See the License for the
 # specific language governing permissions and limitations under the License.
 #
 */

 import Sequelize, { AbstractDataType } from 'sequelize';
import { parse } from 'license-expressions';

// Stores an object as a json string internally, but as an object externally
export type JSON_Type = AbstractDataType;
export function jsonDataType(attributeName: string) {
  return {
    type: Sequelize.STRING,
    get: function() {
      return JSON.parse(this.getDataValue(attributeName));
    },
    set: function(val: any) {
      return this.setDataValue(attributeName, JSON.stringify(val));
    }
  };
}

export function parentPath(path: string) {
  const splits = path.split('/');
  return splits.length === 1 ? '#' : splits.slice(0, -1).join('/');
}


export function parseTokensFromExpression(expression: string){
  // const tokens = `(${expression})`.split(/( |\(|\))/);
  const tokens = expression.split(/( |\(|\))/);
  return tokens;
}
export function parseKeysFromExpression(expression: string){
  const AVOID_KEYWORDS = new Set(['WITH', 'OR', 'AND']);

  const tokens = parseTokensFromExpression(expression);
  // console.log("Tokens", tokens);
  
  return tokens.filter(token => token.length && !AVOID_KEYWORDS.has(token));
}

const testCases = [
  "GPL-3.0+", "MIT OR (Apache-2.0 AND 0BSD)", "gpl-2.0-plus WITH ada-linking-exception",
  "zlib", "lgpl-2.1", "apache-1.1"   // not compatible for our use case
]
testCases.forEach(expression => {
  console.log(expression, { tokens: parseTokensFromExpression(expression), keys: parseKeysFromExpression(expression)});
})