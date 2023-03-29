import { Op } from 'sequelize';
import { Row, Col, Card } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'

import { formatChartData } from '../../utils/pie';
import { useWorkbenchDB } from '../../contexts/workbenchContext';
import PieChart from '../../components/PieChart/PieChart';
import EllipticLoader from '../../components/EllipticLoader';

interface ScanData {
  totalLicenses: number | null,
  totalLicenseFiles: number | null,
  totalSPDXLicenses: number | null,
}

import "./licenseInfoDash.css";

const LicenseInfoDash = () => {
  const workbenchDB = useWorkbenchDB();

  const [licenseExpressionData, setLicenseExpressionData] = useState(null);
  const [licenseKeyData, setLicenseKeyData] = useState(null);
  const [licensePolicyData, setLicensePolicyData] = useState(null);
  const [scanData, setScanData] = useState<ScanData>({
    totalLicenses: null,
    totalLicenseFiles: null,
    totalSPDXLicenses: null,
  });
  
  useEffect(() => {
    const { db, initialized, currentPath } = workbenchDB;
    
    if(!initialized || !db || !currentPath)
      return;

    db.sync.then(db => db.File.findAll({
      where: {
        path: {
          [Op.or]: [
            { [Op.like]: `${currentPath}`},      // Matches a file / directory.
            { [Op.like]: `${currentPath}/%`}  // Matches all its children (if any).
          ]
        }
      },
      // attributes: ['id'],
    }))
      .then((files) =>{
        const fileIDs = files.map(file => file.getDataValue('id'));
        db.sync.then(db => {
          console.log(db.LicenseExpression, db);
          
        })
        
        // Query and prepare chart for license expression
        db.sync
          .then(db => db.LicenseExpression.findAll({where: { fileId: fileIDs }}))
          .then((expressions) => expressions.map(
            expression => expression.getDataValue('license_expression') || 'No Value Detected'
          ))
          .then((expressions) => {
            // Prepare chart for license expressions
            const { chartData } = formatChartData(expressions, 'expressions');
            // console.log("Result expressions:", chartData);
            setLicenseExpressionData(chartData);
          });

        // Query and prepare chart for license keys
        db.sync
          .then((db) => db.LicenseDetections.findAll({where: { fileId: fileIDs }}))
          .then(licenses => {

            // Prepare aggregate data
            const licenseFileIDs = licenses.map((val) => val.getDataValue('fileId'));
            const spdxKeys = licenses.map((val) => val.getDataValue('spdx_license_key'));
            
            // console.log('All licenses', licenses);
            // console.log("LicensefileIds", licenseFileIDs);

            setScanData(oldScanData => ({
              ...oldScanData,
              totalLicenseFiles: (new Set(licenseFileIDs)).size,
              totalSPDXLicenses: (new Set(spdxKeys)).size,
            }));

            return licenses;
          })
          .then((licenses) => licenses.map(val => val.getDataValue('key') || 'No Value Detected'))
          .then(keys => {
            // Prepare chart for license keys
            const { chartData, untrimmedLength } = formatChartData(keys, 'keys');
            // console.log("License keys:", chartData);
            // console.log("licensekeys untrimmed length: ", untrimmedLength);

            // Prepare aggregate data
            setScanData(oldScanData => ({...oldScanData, totalLicenses: untrimmedLength}));
            setLicenseKeyData(chartData);
          })
          
        // Query and prepare chart for license policy
        db.sync
          .then((db) => db.LicensePolicy.findAll({where: { fileId: fileIDs }}))
          .then((licenses) => licenses.map(val => val.getDataValue('label') || 'No Value Detected'))
          .then(labels => {
            const { chartData } = formatChartData(labels, 'policy');
            // console.log("Result License policy formatted", chartData);
            setLicensePolicyData(chartData);
          })
      });
  }, [workbenchDB]);

  return (
    <div className='text-center pieInfoDash'>
      <br/>
      <h3>
        License info - { workbenchDB.currentPath || ""}
      </h3>
      <br/><br/>
      <Row className="dash-cards">
        <Col sm={4}>
          <Card className='info-card'>
            {
              scanData.totalLicenses === null ?
                <EllipticLoader wrapperClass='value' />
              :
              <h4 className='value'>
                { scanData.totalLicenses }
              </h4>
            }
            <h5 className='title'>
              Total licenses
            </h5>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className='info-card'>
            {
              scanData.totalLicenseFiles === null ?
                <EllipticLoader wrapperClass='value' />
              :
              <h4 className='value'>
                { scanData.totalLicenseFiles }
              </h4>
            }
            <h5 className='title'>
              Total files with licenses
            </h5>
          </Card>
        </Col>
        <Col sm={4} >
          <Card className='info-card'>
            {
              scanData.totalSPDXLicenses === null ?
                <EllipticLoader wrapperClass='value' />
              :
              <h4 className='value'>
                { scanData.totalSPDXLicenses }
              </h4>
            }
            <h5 className='title'>
              Total SPDX licenses
            </h5>
          </Card>
        </Col>
      </Row>
      <br/><br/>
      <Row className="dash-cards">
        <Col sm={6} md={4}>
          <Card className='chart-card'>
            <h5 className='title'>
              License expression
            </h5>
            <PieChart
              chartData={licenseExpressionData}
              noDataText='Use --license CLI option for License expressions'
              noDataLink='https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#license-option'
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className='chart-card'>
            <h5 className='title'>
              License keys
            </h5>
            <PieChart
              chartData={licenseKeyData}
              noDataText='Use --license CLI option for License keys'
              noDataLink='https://scancode-toolkit.readthedocs.io/en/latest/cli-reference/basic-options.html#license-option'
            />
          </Card>
        </Col>
        <Col sm={6} md={4}>
          <Card className='chart-card'>
            <h5 className='title'>
              License policy
            </h5>
            <PieChart
              chartData={licensePolicyData}
              noDataText='Use --license-policy CLI option for policy data'
              noDataLink='https://scancode-toolkit.readthedocs.io/plugins/licence_policy_plugin.html#using-the-plugin'
            />
          </Card>
        </Col>
      </Row>
      <br/><br/>
    </div>
  )
}

export default LicenseInfoDash