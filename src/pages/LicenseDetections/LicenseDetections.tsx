import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { useWorkbenchDB } from '../../contexts/workbenchContext';
import { LicenseDetectionDetails } from './licenseDefinitions';

import "./LicenseDetection.css";

export const LICENSE_DETECTION_QUERY_KEY = 'identifier';

const LicenseDetections = () => {
  const [searchParams] = useSearchParams();
  const [selectedLicenseDetection, setSelectedLicenseDetection] = useState('');
  const [licenseDetections, setLicenseDetections] = useState<LicenseDetectionDetails[]>([]);
  const { db } = useWorkbenchDB();

  useEffect(() => {
    const queriedDetection = searchParams.get(LICENSE_DETECTION_QUERY_KEY);
    setSelectedLicenseDetection(queriedDetection);
  }, [searchParams]);

  useEffect(() => {
    db.sync
      .then(async () => {
        const newLicenseDetections = await db.getAllLicenseDetections();
        setLicenseDetections(newLicenseDetections.map(detection => ({
          count: Number(detection.getDataValue('count')),
          identifier: detection.getDataValue('identifier').toString({}),
          license_expression: detection.getDataValue('license_expression').toString({}),
          detection_log: detection.getDataValue('detection_log'),
          matches: detection.getDataValue('matches'),
        })));
      })
  }, []);

  return (
    <div>
      <br/>
      <h3 className='text-center'>
        LicenseDetections
      </h3>
      <br/>
      <h4>
        List of license detections
      </h4>
      <ul>
        {
          licenseDetections.map(detection => (
            <li key={detection.identifier}>
              { detection.identifier }
              {
                selectedLicenseDetection === detection.identifier &&
                <h4 className='ml-2'>
                  Selected !!
                </h4>
              }
              <br/>
            </li>
          ))
        }
      </ul>

      {
        selectedLicenseDetection !== '' &&
        <h4>
          Queried detection: { selectedLicenseDetection }
        </h4>
      }

    </div>
  )
}

export default LicenseDetections