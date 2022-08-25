import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Collapse, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { useWorkbenchDB } from '../../contexts/workbenchContext';

import './packages.css';

// @TODO - Complete these 
interface Dependency {
  purl: string,
  datafile_path: string,
}
interface PackageInfo {
  package_uid: string,
  name: string,
  type: string,
  dependencies: Dependency[]
}

const Packages = () => {
  const workbenchDB = useWorkbenchDB();
  const [expandedPackages, setExpandedPackages] = useState<string[]>([]);
  const [packagesWithDeps, setPackagesWithDeps] = useState<PackageInfo[] | null>(null);

  const [activePackage, setActivePackage] = useState<PackageInfo | null>(null);
  const [activeDependency, setActiveDependency] = useState<Dependency | null>(null);
  const [activeEntityType, setActiveEntityType] = useState<'package' | 'dependency' | null>(null);

  const activatePackage = (packageInfo: PackageInfo) => {
    setActiveDependency(null);
    setActivePackage(packageInfo);
    setActiveEntityType('package');
  }
  const activateDependency = (dependency: Dependency) => {
    setActivePackage(null);
    setActiveDependency(dependency);
    setActiveEntityType('dependency');
  }

  useEffect(() => {
    const { db, initialized, currentPath } = workbenchDB;
    
    if(!initialized || !db || !currentPath)
      return;
    
    db.sync
      .then(async () => {
        const packages = await db.getAllPackages();
        const deps = await db.getAllDependencies();
        console.log("Packages", packages);
        console.log("Deps", deps);

        const packageMapping = new Map<string, PackageInfo>(
          packages.map((packageInfo): [string, PackageInfo] => (
            [
              packageInfo.getDataValue('package_uid').toString({}),
              {
                package_uid: packageInfo.getDataValue('package_uid').toString({}),
                name: packageInfo.getDataValue('name').toString({}),
                type: packageInfo.getDataValue('type').toString({}),
                dependencies: [],
              }
            ]
          )
        ));
        const OTHERS = 'others';
        const OTHERS_PACKAGE: PackageInfo = {
          package_uid: 'misc',
          name: 'Other packages',
          type: "misc",
          dependencies: [],
        };
        packageMapping.set(OTHERS, OTHERS_PACKAGE);

        deps.forEach(dependencyInfo => {
          const targetPackageUid: string | null = dependencyInfo.getDataValue('for_package_uid')?.toString({});
          packageMapping.get(targetPackageUid || OTHERS).dependencies.push({
            purl: dependencyInfo.getDataValue('purl').toString({}),
            datafile_path: dependencyInfo.getDataValue('datafile_path').toString({}),
          })
        });

        const parsedPackageWithDeps = Array.from(packageMapping.values());
        setPackagesWithDeps(parsedPackageWithDeps);
        console.log("Packages with deps:", parsedPackageWithDeps);
        setExpandedPackages([]);
      });
  }, [workbenchDB]);
  
  function collapsePackage(target_package_uid: string){
    console.log("Collapse", target_package_uid);
    
    setExpandedPackages(prevPackages => (
      prevPackages.filter(package_uid => package_uid !== target_package_uid)
    ))
  }
  function expandPackage(target_package_uid: string){
    console.log("Expand", target_package_uid);

    setExpandedPackages(prevPackages => (
      [...prevPackages, target_package_uid]
    ))
  }


  if(!packagesWithDeps)
    return <h5>Loading</h5>;
  
  if(!packagesWithDeps.length)
    return <h5>No packages :/</h5>;

  return (
    <div className='packages-list-container'>
      <h4>
        Packages
      </h4>
      <Row>
        <Col md={6}>
          <ListGroup className='package-list'>
            {
              packagesWithDeps.map(packageWithDep => {
                const isExpanded = expandedPackages.includes(packageWithDep.package_uid);
                return (
                <ListGroupItem
                  key={packageWithDep.package_uid}
                  style={{ cursor: "pointer" }}
                  className={(activePackage?.package_uid === packageWithDep.package_uid ? 'selected-entity ' : '') + 'entity dependency-list'}
                >
                  <div
                    onClick={() => {
                      (isExpanded ? collapsePackage : expandPackage)(packageWithDep.package_uid);
                      activatePackage(packageWithDep);
                    }}
                    className='w-100'
                  >
                    <h6>
                      <FontAwesomeIcon icon={ isExpanded ? faCaretDown : faCaretRight} /> &nbsp;&nbsp;
                      { packageWithDep.name } - { packageWithDep.type }
                    </h6>

                  </div>
                  <Collapse in={isExpanded}>
                    <ListGroup>
                      {packageWithDep.dependencies.map(dependency => {
                        return (
                          <ListGroupItem
                            key={dependency.purl}
                            className={(activeDependency?.purl === dependency.purl ? 'selected-entity ' : '') + 'entity'}
                            onClick={() => activateDependency(dependency)}
                          >
                            { dependency.datafile_path }
                          </ListGroupItem>
                        );
                      })}
                    </ListGroup>
                  </Collapse>
                </ListGroupItem>
                )
              })
            }
          </ListGroup>
        </Col>
        <Col>
          {
            activeEntityType === 'package' ?
            activatePackage && <div>
              <h5>
                Package - { activePackage.name }
                UID - { activePackage.package_uid }
              </h5>
            </div>
            :
            activeDependency && <div>
            <h5>
              Dependency - { activeDependency.datafile_path }
              PURL - { activeDependency.purl }
            </h5>
            </div>
          }
        </Col>
      </Row>
    </div>
  )
}

export default Packages