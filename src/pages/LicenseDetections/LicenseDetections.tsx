import { Allotment } from 'allotment';
import React, { useEffect, useState } from 'react'
import { Badge, ListGroup, ListGroupItem } from 'react-bootstrap';
import { ThreeDots } from 'react-loader-spinner';
import { useSearchParams } from 'react-router-dom';
import LicenseDetectionEntity from '../../components/LicenseDetection/LicenseDetectionEntity';
import { useWorkbenchDB } from '../../contexts/workbenchContext';
import { LicenseDetectionDetails } from './licenseDefinitions';

import "./LicenseDetection.css";

export const LICENSE_DETECTION_QUERY_KEY = 'identifier';

const LicenseDetections = () => {
  const [searchParams] = useSearchParams();
  const [activeLicenseDetection, setActiveLicenseDetection] = useState<LicenseDetectionDetails | null>(null);
  const [licenseDetections, setLicenseDetections] = useState<LicenseDetectionDetails[] | null>(null);
  const { db } = useWorkbenchDB();

  useEffect(() => {
    if(!licenseDetections || !licenseDetections.length)
      return;
    const queriedDetectionIdentifier = searchParams.get(LICENSE_DETECTION_QUERY_KEY);
    const foundDetection = licenseDetections.find(detection => detection.identifier == queriedDetectionIdentifier);
    if(foundDetection)
      setActiveLicenseDetection(foundDetection);
  }, [searchParams]);

  useEffect(() => {
    db.sync
      .then(async () => {
        const newLicenseDetections = (await db.getAllLicenseDetections()).map(detection => ({
          count: Number(detection.getDataValue('count')),
          identifier: detection.getDataValue('identifier').toString({}),
          license_expression: detection.getDataValue('license_expression').toString({}),
          detection_log: JSON.parse(detection.getDataValue('detection_log').toString({})),
          matches: JSON.parse(detection.getDataValue('matches')?.toString({}) || "[]"),
        }));
        setLicenseDetections(newLicenseDetections);
        
        const queriedDetectionIdentifier = searchParams.get(LICENSE_DETECTION_QUERY_KEY);
        const foundDetection = newLicenseDetections.find(detection => detection.identifier == queriedDetectionIdentifier);
        if(foundDetection)
          setActiveLicenseDetection(foundDetection);
      });
  }, []);

  if(!licenseDetections){
    return (
      <ThreeDots 
        height={150}
        width={150}
        radius={30}
        color="#3D7BFF" 
        ariaLabel="three-dots-loading"
        wrapperClass="license-detections-loader"
        visible={true}
      />
    );
  }

  if(!licenseDetections.length)
    return <h5>No license detections :/</h5>;
    
  return (
    <div className='license-detections-main-container'>
      <h4 className='license-detections-title'>
        License Detections
      </h4>

      <Allotment className='license-container'>
        <Allotment.Pane
          snap
          minSize={200}
          preferredSize="30%"
          className='license-detections-panes p-2'
        >
          <ListGroup>
          {
            licenseDetections.map(licenseDetection => {
              const isLicenseDetectionActive = licenseDetection === activeLicenseDetection;
              return (
                <ListGroupItem
                  onClick={() => setActiveLicenseDetection(licenseDetection)}
                  key={licenseDetection.identifier}
                  className='license-detection-group-item'
                  >
                  <div className={'license-detection-item ' + (isLicenseDetectionActive ? 'selected-license ' : '')}>
                    <div className='expression'>
                      { licenseDetection.license_expression }
                      {/* {
                        isPackageActive && 
                        <span>
                          <Badge pill>selected</Badge>
                        </span>
                      } */}
                    </div>
                    <div className='license-count'>
                      <Badge pill className='license-count'>
                        { licenseDetection.count }
                      </Badge>
                    </div>
                  </div>
                </ListGroupItem>
              )
            })
          }
          </ListGroup>
        </Allotment.Pane>
      <Allotment.Pane
          snap
          minSize={500}
          className='license-detection-entity-panes p-4 overflow-scroll'
        >
          {
            <LicenseDetectionEntity
              licenseDetection={activeLicenseDetection}
            />
          }
        </Allotment.Pane>
      </Allotment>
    </div>
  )
}

export default LicenseDetections