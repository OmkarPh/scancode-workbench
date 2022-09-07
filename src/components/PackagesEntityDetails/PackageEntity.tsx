import ReactJson from '@microlink/react-json-view';
import React from 'react'
import { DependencyDetails, PackageDetails } from '../../pages/Packages/packageDefinitions'

import './entityCommonStyles.css'
import './packageEntity.css'

interface PackageEntityProps {
  package: PackageDetails,
  goToDependency: (dependency: DependencyDetails) => void,
}
const PackageEntity = (props: PackageEntityProps) => {
  const { goToDependency, package: activePackage} = props;

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
        Package: { activePackage.name }
        { activePackage.version ? '@' + activePackage.version : ''} <br/>
      </h5>
      <h6>
        UID: { activePackage.package_uid } <br/>
        Type: { activePackage.type }
      </h6>
      <div className='deps-list'>
        Dependencies:
        {
          activePackage.dependencies.map(dependency => (
            <a
              className='deps-link'
              key={dependency.dependency_uid}
              onClick={() => goToDependency(dependency)}
            >
              { dependency.purl }
            </a>
          ))
        }
      </div>
      <br/>
      
      {/* <br/>
      <br/>
      <br/>
      <br/> */}
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