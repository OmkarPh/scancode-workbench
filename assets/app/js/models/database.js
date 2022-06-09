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

const headerModel = require('./header');
const fileModel = require('./file');
const licenseModel = require('./license');
const licenseExpressionModel = require('./licenseExpression');
const licensePolicyModel = require('./licensePolicy');
const copyrightModel = require('./copyright');
const packageModel = require('./package');
const emailModel = require('./email');
const urlModel = require('./url');
const flatFileModel = require('./flatFile');
const scanErrorModel = require('./scanError');

module.exports = function(sequelize, DataTypes) {
  // Define the models
  this.Header = headerModel(sequelize, DataTypes);
  this.File = fileModel(sequelize, DataTypes);
  this.License = licenseModel(sequelize, DataTypes);
  this.LicenseExpression = licenseExpressionModel(sequelize, DataTypes);
  this.LicensePolicy = licensePolicyModel(sequelize, DataTypes);
  this.Copyright = copyrightModel(sequelize, DataTypes);
  this.Package = packageModel(sequelize, DataTypes);
  this.Email = emailModel(sequelize, DataTypes);
  this.Url = urlModel(sequelize, DataTypes);
  this.ScanError = scanErrorModel(sequelize, DataTypes);

  this.FlatFile = flatFileModel(sequelize, DataTypes);

  // Define the relations
  this.Header.hasMany(this.File);
  this.File.hasMany(this.License);
  this.File.hasMany(this.LicenseExpression);
  this.File.hasMany(this.LicensePolicy);
  this.File.hasMany(this.Copyright);
  this.File.hasMany(this.Package);
  this.File.hasMany(this.Email);
  this.File.hasMany(this.Url);
  this.File.hasMany(this.ScanError);

  // Include Array for queries
  this.fileIncludes = [
    { model: this.License, separate: true },
    { model: this.LicenseExpression, separate: true },
    { model: this.LicensePolicy, separate: true },
    { model: this.Copyright, separate: true },
    { model: this.Package, separate: true },
    { model: this.Email, separate: true },
    { model: this.Url, separate: true },
    { model: this.ScanError, separate: true }
  ];

  return this;
};

