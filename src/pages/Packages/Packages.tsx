// eslint-disable-next-line import/namespace
import { Allotment } from 'allotment';
import { ThreeDots } from 'react-loader-spinner';
import React, { useEffect, useState } from 'react';
import { Badge, Collapse, ListGroup, ListGroupItem } from 'react-bootstrap';

import { useWorkbenchDB } from '../../contexts/workbenchContext';

import RightArrowIcon from "../../assets/icons/rightArrow.svg";
import './packages.css';
import PackageEntity from '../../components/PackagesEntityDetails/PackageEntity';
import DependencyEntity from '../../components/PackagesEntityDetails/DependencyEntity';

import { PackageDetails, DependencyDetails } from './packageDefinitions';

const Packages = () => {
  const workbenchDB = useWorkbenchDB();
  const [expandedPackages, setExpandedPackages] = useState<string[]>([]);
  const [packagesWithDeps, setPackagesWithDeps] = useState<PackageDetails[] | null>(null);

  const [activePackage, setActivePackage] = useState<PackageDetails | null>(null);
  const [activeDependency, setActiveDependency] = useState<DependencyDetails | null>(null);
  const [activeEntityType, setActiveEntityType] = useState<'package' | 'dependency' | null>(null);

  const activatePackage = (packageInfo: PackageDetails) => {
    setActiveDependency(null);
    setActivePackage(packageInfo);
    setActiveEntityType('package');
  }
  const activateDependency = (dependency: DependencyDetails) => {
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

        const packageMapping = new Map<string, PackageDetails>(
          packages.map((packageInfo): [string, PackageDetails] => (
            [
              packageInfo.getDataValue('package_uid').toString({}),
              {
                package_uid: packageInfo.getDataValue('package_uid').toString({}),
                name: packageInfo.getDataValue('name').toString({}),
                type: packageInfo.getDataValue('type').toString({}),
                dependencies: [],
                namespace: packageInfo.getDataValue('namespace')?.toString({}) || null,
                version: packageInfo.getDataValue('version')?.toString({}) || null,
                qualifiers: JSON.parse(packageInfo.getDataValue('qualifiers').toString({})),
                subpath: packageInfo.getDataValue('subpath')?.toString({}) || null,
                primary_language: packageInfo.getDataValue('primary_language')?.toString({}) || null,
                description: packageInfo.getDataValue('description')?.toString({}) || null,
                release_date: packageInfo.getDataValue('release_date')?.toString({}) || null,
                parties: JSON.parse(packageInfo.getDataValue('parties').toString({})),
                keywords: JSON.parse(packageInfo.getDataValue('keywords').toString({})),
                homepage_url: packageInfo.getDataValue('homepage_url')?.toString({}) || null,
                download_url: packageInfo.getDataValue('download_url')?.toString({}) || null,
                size: packageInfo.getDataValue('size')?.toString({}) || null,
                sha1: packageInfo.getDataValue('sha1')?.toString({}) || null,
                md5: packageInfo.getDataValue('md5')?.toString({}) || null,
                sha256: packageInfo.getDataValue('sha256')?.toString({}) || null,
                sha512: packageInfo.getDataValue('sha512')?.toString({}) || null,
                bug_tracking_url: packageInfo.getDataValue('bug_tracking_url')?.toString({}) || null,
                code_view_url: packageInfo.getDataValue('code_view_url')?.toString({}) || null,
                vcs_url: packageInfo.getDataValue('vcs_url')?.toString({}) || null,
                copyright: packageInfo.getDataValue('copyright')?.toString({}) || null,
                license_expression: packageInfo.getDataValue('license_expression')?.toString({}) || null,
                declared_license: packageInfo.getDataValue('declared_license')?.toString({}) || null,
                notice_text: packageInfo.getDataValue('notice_text')?.toString({}) || null,
                source_packages: JSON.parse(packageInfo.getDataValue('source_packages').toString({})),
                extra_data: JSON.parse(packageInfo.getDataValue('extra_data').toString({})),
                repository_homepage_url: packageInfo.getDataValue('repository_homepage_url')?.toString({}) || null,
                repository_download_url: packageInfo.getDataValue('repository_download_url')?.toString({}) || null,
                api_data_url: packageInfo.getDataValue('api_data_url')?.toString({}) || null,
                datafile_paths: JSON.parse(packageInfo.getDataValue('datafile_paths').toString({})),
                datasource_ids: JSON.parse(packageInfo.getDataValue('datasource_ids').toString({})),
                purl: packageInfo.getDataValue('purl').toString({}),
              }
            ]
          )
        ));
        const OTHERS = 'others';
        const OTHERS_PACKAGE: PackageDetails = {
          package_uid: 'misc',
          name: 'Other packages',
          type: 'misc',
          dependencies: [],
          namespace: '',
          version: null,
          qualifiers: {},
          subpath: null,
          primary_language: null,
          description: null,
          release_date: null,
          parties: {},
          keywords: {},
          homepage_url: null,
          download_url: null,
          size: null,
          sha1: null,
          md5: null,
          sha256: null,
          sha512: null,
          bug_tracking_url: null,
          code_view_url: null,
          vcs_url: null,
          copyright: null,
          license_expression: null,
          declared_license: null,
          notice_text: null,
          source_packages: {},
          extra_data: {},
          repository_homepage_url: null,
          repository_download_url: null,
          api_data_url: null,
          datafile_paths: {},
          datasource_ids: {},
          purl: null,
        };
        packageMapping.set(OTHERS, OTHERS_PACKAGE);

        deps.forEach(dependencyInfo => {
          const targetPackageUid: string | null = dependencyInfo.getDataValue('for_package_uid')?.toString({});
          packageMapping.get(targetPackageUid || OTHERS).dependencies.push({
            purl: dependencyInfo.getDataValue('purl').toString({}),
            extracted_requirement: dependencyInfo.getDataValue('extracted_requirement').toString({}),
            scope: dependencyInfo.getDataValue('scope').toString({}),
            is_runtime: dependencyInfo.getDataValue('is_runtime'),
            is_optional: dependencyInfo.getDataValue('is_optional'),
            is_resolved: dependencyInfo.getDataValue('is_resolved'),
            resolved_package: JSON.parse(dependencyInfo.getDataValue('resolved_package').toString({})),
            dependency_uid: dependencyInfo.getDataValue('dependency_uid').toString({}),
            for_package_uid: dependencyInfo.getDataValue('for_package_uid')?.toString({}) || null,
            datafile_path: dependencyInfo.getDataValue('datafile_path').toString({}),
            datasource_id: dependencyInfo.getDataValue('datasource_id').toString({}),
          })
        });

        const parsedPackageWithDeps = Array.from(packageMapping.values());
        setPackagesWithDeps(parsedPackageWithDeps);
        console.log("Packages with deps:", parsedPackageWithDeps);
        setExpandedPackages([]);
      });
  }, [workbenchDB]);
  
  function collapsePackage(target_package_uid: string, e: React.MouseEvent){
    setExpandedPackages(prevPackages => (
      prevPackages.filter(package_uid => package_uid !== target_package_uid)
    ));
    e.stopPropagation();
    e.preventDefault();
  }
  function expandPackage(target_package_uid: string, e: React.MouseEvent){
    setExpandedPackages(prevPackages => (
      [...prevPackages, target_package_uid]
    ));
    e.stopPropagation();
    e.preventDefault();
  }


  if(!packagesWithDeps){
    return (
      <ThreeDots 
        height={150}
        width={150}
        radius={30}
        color="#3D7BFF" 
        ariaLabel="three-dots-loading"
        wrapperClass="packages-loader"
        visible={true}
      />
    );
  }

  if(!packagesWithDeps.length)
    return <h5>No packages :/</h5>;

  return (
    <div className='packages-main-container'>
      <h4 className='page-title'>
        Packages
      </h4>
      <Allotment className='packages-container'>
        <Allotment.Pane
          snap
          minSize={200}
          preferredSize="35%"
          className='packages-panes'
        >
          <ListGroup className='package-list'>
            {
              packagesWithDeps.map(packageWithDep => {
                const isPackageActive = activeEntityType === 'package' &&
                  activePackage?.package_uid === packageWithDep.package_uid;
                const isPackageExpanded = expandedPackages.includes(packageWithDep.package_uid);

                return (
                <ListGroupItem
                  key={packageWithDep.package_uid}
                  style={{ cursor: "pointer" }}
                  className={(isPackageActive ? 'selected-entity ' : '') + 'entity dependency-list'}
                >
                  <div
                    onClick={() => activatePackage(packageWithDep)}
                    className='entity-info'
                    >
                    <div>
                      <div
                        className='expand-package'
                        onClick={e => (isPackageExpanded ? collapsePackage : expandPackage)(packageWithDep.package_uid, e)}
                      >
                        <RightArrowIcon
                          className={isPackageExpanded && 'expanded-icon' || ""}
                        />
                      </div>
                      <div className='entity-name'>
                        { packageWithDep.name } - { packageWithDep.type }
                        {
                          isPackageActive && 
                          <span>
                            &nbsp;&nbsp;&nbsp;
                            <Badge pill>selected</Badge>
                          </span>
                        }
                      </div>
                    </div>
                    <div className='total-deps'>
                      <Badge pill>
                        { packageWithDep.dependencies.length }
                      </Badge>
                    </div>
                  </div>
                  <Collapse in={isPackageExpanded} className='collapsed-body'>
                    <ListGroup>
                      {
                        packageWithDep.dependencies.map(dependency => {
                          const isDependencyActive = activeEntityType === 'dependency' && activeDependency?.purl === dependency.purl;
                          return (
                            <ListGroupItem
                              key={dependency.purl}
                              className={(isDependencyActive ? 'selected-entity ' : '') + 'entity'}
                              onClick={() => activateDependency(dependency)}
                            >
                              <div className='entity-info'>
                                { dependency.purl }
                                {
                                  isDependencyActive && 
                                  <span>
                                    &nbsp;&nbsp;&nbsp;
                                    <Badge pill>selected</Badge>
                                  </span>
                                }
                              </div>
                            </ListGroupItem>
                          );
                        })
                      }
                    </ListGroup>
                  </Collapse>
                </ListGroupItem>
                )
              })
            }
          </ListGroup>
        </Allotment.Pane>
        <Allotment.Pane
          snap
          minSize={200}
          className='packages-panes details-pane'
        >
          {
            activeEntityType === 'package' ?
            activePackage && <PackageEntity package={activePackage} /> :
            activeDependency && <DependencyEntity dependency={activeDependency} />
          }
        </Allotment.Pane>
      </Allotment>
    </div>
  )
}

export default Packages