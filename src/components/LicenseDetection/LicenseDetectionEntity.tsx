import React, { useEffect } from 'react'
import ReactJson from '@microlink/react-json-view';
import { AgGridReact } from 'ag-grid-react';

import { DEFAULT_MATCHES_COL_DEF, DetectionMatchesCols } from './MatchesTableCols';
import { LicenseDetectionDetails } from '../../pages/LicenseDetections/licenseDefinitions';

import './licenseDetection.css'
import '../../styles/entityCommonStyles.css'

interface LicenseDetectionEntityProps {
  licenseDetection: LicenseDetectionDetails | null,
}
const LicenseDetectionEntity = (props: LicenseDetectionEntityProps) => {
  const { licenseDetection } = props;
  const matches = licenseDetection?.matches || [];
  console.log("Matches", matches);

  useEffect(() => {
    // if(matches)
    //   matches.push({
    //     ...matches[0]
    //   })
  }, [matches]);
  
  if(!licenseDetection){
    return (
      <div>
        <h5>
          No License Detection to show
        </h5>
      </div>
    )
  }
  return (
    <div className='license-detecion-entity'>
      <h5>
        { licenseDetection.license_expression }
        <br/>
      </h5>
      <div className='license-entity-properties'>
        {
          [
            // [ "License Expression:", licenseDetection.license_expression || "NA" ],
            [ "License Identifier:", licenseDetection.identifier || "NA" ],
            [ "Instances:", licenseDetection.count || "NA" ],
            [
              <>
                Detection log 
                {
                  licenseDetection.detection_log && Array.isArray(licenseDetection.detection_log) ?
                  <ul>
                     { 
                      licenseDetection.detection_log.map((log_item, idx) => (
                        <li key={String(log_item)+idx}>
                          { log_item }
                        </li>
                      ))
                     }
                  </ul>
                  :
                  "NA"
                }
              </>,
              ""
            ],
          ].map(entry => (
            <React.Fragment key={entry[0].toString()}>
              <span className='property'>
                { entry[0] || "" }
              </span>
              <span className='value'>
                { entry[1] || "" }
              </span>
              <br/>
            </React.Fragment>
          ))
        }
      </div>
      
      {/* <br/>
      <br/>
      <br/>
      <br/> */}
      <AgGridReact
        rowData={matches}
        columnDefs={DetectionMatchesCols}
        // onGridReady={onGridReady}
        className="ag-theme-alpine ag-grid-customClass matches-table"

        ensureDomOrder
        enableCellTextSelection

        pagination={false}
        defaultColDef={DEFAULT_MATCHES_COL_DEF}
      />
      <br/>
      Raw license detection:
      <ReactJson
        src={licenseDetection}
        enableClipboard={false}
        displayDataTypes={false}
        collapsed={0}
      />
    </div>
  )
}

export default LicenseDetectionEntity