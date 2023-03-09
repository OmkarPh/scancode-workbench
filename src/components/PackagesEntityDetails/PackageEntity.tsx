import ReactJson from '@microlink/react-json-view';
import React from 'react'
import { DependencyDetails, PackageDetails } from '../../pages/Packages/packageDefinitions'

import '../../styles/entityCommonStyles.css';
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
        { activePackage.name }
        { activePackage.version ? '@' + activePackage.version : ''}
        &nbsp; ( { activePackage.type } )
        <br/>
      </h5>
      <div className='entity-properties'>
        {
          [
            [
              <>
                { activePackage.package_uid }
                <br/>
              </>,
              ""
            ],
            [ "Type:", activePackage.type || null ],
            [ "Namespace:", activePackage.namespace || null ],
            [ "Name:", activePackage.name || null ],
            [ "Version:", activePackage.version || null ],
            [ "Subpath:", activePackage.subpath || null ],
            [ "Primary Language:", activePackage.primary_language || null ],
            [ "Homepage URL:", activePackage.homepage_url || null ],
            [ "Extracted license statement: ", activePackage.extracted_license_statement || null ],
            [ "Declared license expression", activePackage.declared_license_expression || null ],
            [ "Declared license expression SPDX", activePackage.declared_license_expression_spdx || null ],
            [ "Other license expression", activePackage.other_license_expression || null ],
            [ "Other license expression SPDX", activePackage.other_license_expression_spdx || null ],
          ].map(entry => entry[1] && (
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
      <br/>
      <b>
        {
          activePackage.dependencies.length === 0 ? "No Dependencies !"
          : activePackage.dependencies.length === 1 ? "1 Dependency:"
          : `${activePackage.dependencies.length} Dependencies:`
        } 
      </b>
      <br/>
      <div className='deps-list'>
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
      
      Raw package:
      <ReactJson
        src={activePackage}
        enableClipboard={false}
        displayDataTypes={false}
        collapsed={0}
      />
    </div>
  )
}

export default PackageEntity