import ReactJson from '@microlink/react-json-view';
import React from 'react'
import { PackageDetails } from '../../pages/Packages/packageDefinitions'

import './entityCommonStyles.css'

interface PackageEntityProps {
  package: PackageDetails,
}
const PackageEntity = (props: PackageEntityProps) => {
  const activePackage = props.package;

  if(!activePackage){
    return (
      <div>
        <h5>
          No package data found !!
        </h5>
      </div>
    )
  }
  return (
    <div className='package-entity'>
      <h5>
        Package - { activePackage.name }
      </h5>
      <h6>
        UID - { activePackage.package_uid }
      </h6>
      <br/>
      <ReactJson
        src={activePackage}
        enableClipboard={false}
        displayDataTypes={false}
        collapsed={1}
      />
    </div>
  )
}

export default PackageEntity