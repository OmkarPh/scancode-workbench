import ReactJson from '@microlink/react-json-view';
import React from 'react'
import { DependencyDetails } from '../../pages/Packages/packageDefinitions'

import './entityCommonStyles.css'
import './dependencyEntity.css'

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
    <div className='dependency-entity'>
      <h5>
        Dependency: { activeDependency.purl }
      </h5>
      <h6>
        Data file: { activeDependency.datafile_path }
      </h6>
      <br/>
      Raw package:
      <ReactJson
        src={activeDependency || {}}
        enableClipboard={false}
        displayDataTypes={false}
      />
    </div>
  )
}

export default DependencyEntity