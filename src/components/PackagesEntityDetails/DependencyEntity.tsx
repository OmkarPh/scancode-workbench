import ReactJson from '@microlink/react-json-view';
import React from 'react'
import { DependencyDetails } from '../../pages/Packages/packageDefinitions'

import './entityCommonStyles.css'

interface DependencyEntityProps {
  dependency: DependencyDetails
}
const DependencyEntity = (props: DependencyEntityProps) => {
  const activeDependency = props.dependency;

  if(!activeDependency){
    return (
      <div>
        <h5>
          No dependency data found !!
        </h5>
      </div>
    )
  }
  return (
    <div className='dependency-info'>
      <h5>
        Dependency - { activeDependency.purl }
      </h5>
      <h6>
        Data file - { activeDependency.datafile_path }
      </h6>
      <br/>
      <ReactJson
        src={activeDependency || {}}
        enableClipboard={false}
        displayDataTypes={false}
      />
    </div>
  )
}

export default DependencyEntity