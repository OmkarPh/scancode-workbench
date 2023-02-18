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

import { Sequelize, DataTypes, Model, ModelAttributeColumnOptions } from 'sequelize';
import { jsonDataType } from './databaseUtils';

export type CustomHeaderJSONType = DataTypes.DataType | ModelAttributeColumnOptions<Model<HeaderAttributes, HeaderAttributes>>;

export interface HeaderAttributes {
  id: DataTypes.IntegerDataType,
  tool_name: DataTypes.StringDataType,
  tool_version: DataTypes.StringDataType,
  notice: DataTypes.StringDataType,
  duration: DataTypes.DoubleDataType,
  header_content: DataTypes.StringDataType,
  options: CustomHeaderJSONType,
  input: CustomHeaderJSONType,
  files_count: DataTypes.IntegerDataType,
  output_format_version: DataTypes.StringDataType,
  spdx_license_list_version: DataTypes.StringDataType,
  operating_system: DataTypes.StringDataType,
  cpu_architecture: DataTypes.StringDataType,
  platform: DataTypes.StringDataType,
  platform_version: DataTypes.StringDataType,
  python_version: DataTypes.StringDataType,
  workbench_version: DataTypes.StringDataType,
  workbench_notice: DataTypes.StringDataType,
}

export default function headerModel(sequelize: Sequelize) {
  return sequelize.define<Model<HeaderAttributes>>(
    'headers',
    {
      // @TODO: The notices and versions should be in their own table
      // See https://github.com/nexB/aboutcode/issues/7

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tool_name: DataTypes.STRING,
      tool_version: DataTypes.STRING,
      notice: DataTypes.STRING,
      duration: DataTypes.DOUBLE,
      options: jsonDataType('options'),
      input: jsonDataType('input'),
      header_content: DataTypes.STRING,
      files_count: DataTypes.INTEGER,
      output_format_version: {
        type: DataTypes.STRING,
        defaultValue: '0.1.0',
      },
      spdx_license_list_version: {
        type: DataTypes.STRING,
        defaultValue: '1.00',
      },
      operating_system: {
        type: DataTypes.STRING,
        defaultValue: 'Not included in the scan',
      },
      cpu_architecture: {
        type: DataTypes.STRING,
        defaultValue: 'Not included in the scan',
      },
      platform: {
        type: DataTypes.STRING,
        defaultValue: 'Not included in the scan',
      },
      platform_version: {
        type: DataTypes.STRING,
        defaultValue: 'Not included in the scan',
      },
      python_version: {
        type: DataTypes.STRING,
        defaultValue: 'Not included in the scan',
      },
      workbench_version: DataTypes.STRING,
      workbench_notice: {
        type: DataTypes.STRING,
        defaultValue: 'None',
      },
    });
}