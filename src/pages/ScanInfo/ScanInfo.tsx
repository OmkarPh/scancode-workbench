import React, { useEffect, useState } from 'react'

// Maintained Fork of unmaintained but popular react-json-view
import ReactJson from '@microlink/react-json-view'

import { useWorkbenchDB } from '../../contexts/workbenchContext';

import './scanInfo.css';

interface ScanInfo {
  tool_name: string,
  tool_version: string,
  notice: string,
  duration: number,
  options: string,
  input: string,
  files_count: number,
  output_format_version: string,
  spdx_license_list_version: string,
  operating_system: string,
  cpu_architecture: string,
  platform: string,
  platform_version: string,
  python_version: string,
  workbench_version: string,
  workbench_notice: string,
  raw_header_content: string,
}

function parseIfValidJson(str: unknown){
  if(typeof str !== 'string')
    return null;
  try {
    const parsedObj = JSON.parse(str);
    // Return only if it is an object & not a primitive value
    if(Object(parsedObj) === parsedObj)
      return parsedObj;
    return null;
  } catch (e) {
    return null;
  }
}

const ScanInfo = () => {
  const workbenchDB = useWorkbenchDB();
  const [parsedScanInfo, setParsedScanInfo] = useState<ScanInfo | null>(null);
  
  useEffect(() => {
    const { db, initialized, currentPath } = workbenchDB;
    
    if(!initialized || !db || !currentPath)
      return;
    
    db.sync
      .then(() => {
        db.getScanInfo()
          .then(rawInfo => {
            console.log("Raw scan info:", rawInfo);
            setParsedScanInfo({
              tool_name: rawInfo.getDataValue('tool_name').toString({}) || "",
              tool_version: rawInfo.getDataValue('tool_version').toString({}) || "",
              notice: rawInfo.getDataValue('notice').toString({}) || "",
              duration: Number(rawInfo.getDataValue('duration')),
              options: rawInfo.getDataValue('options')?.toString({}) || "",
              input: rawInfo.getDataValue('input')?.toString({}) || "",
              files_count: Number(rawInfo.getDataValue('files_count')),
              output_format_version: rawInfo.getDataValue('output_format_version')?.toString({}) || "",
              spdx_license_list_version: rawInfo.getDataValue('spdx_license_list_version')?.toString({}) || "",
              operating_system: rawInfo.getDataValue('operating_system')?.toString({}) || "",
              cpu_architecture: rawInfo.getDataValue('cpu_architecture')?.toString({}) || "",
              platform: rawInfo.getDataValue('platform')?.toString({}) || "",
              platform_version: rawInfo.getDataValue('platform_version')?.toString({}) || "",
              python_version: rawInfo.getDataValue('python_version')?.toString({}) || "",
              workbench_version: rawInfo.getDataValue('workbench_version')?.toString({}) || "",
              workbench_notice: rawInfo.getDataValue('workbench_notice')?.toString({}) || "",
              raw_header_content: rawInfo.getDataValue('header_content')?.toString({}) || "",
            })
          })
      });
  }, [workbenchDB]);
  
  return (
    <div className='scan-info'>
      <h4>
        Scan Information
      </h4>
      <br/>
      {
        parsedScanInfo ?
        <table border={1} className='overview-table'>
          <tbody>
            <tr>
              <td>
                Tool
              </td>
              <td>
                { parsedScanInfo.tool_name } v{ parsedScanInfo.tool_version }
              </td>
            </tr>
            <tr>
              <td>
                Input
              </td>
              <td>
                <ul>
                  {
                    (parseIfValidJson(parsedScanInfo.input) || []).map((value: string, idx: number) => (
                      <li key={value+idx}>
                        { value }
                      </li>
                    ))
                  }
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                Options
              </td>
              <td>
                <table className='options-table'>
                  <tbody>
                    {
                      Object.entries(parseIfValidJson(parsedScanInfo.options) || []).map(([key, value]) => (
                        <tr key={key}>
                          <td>
                            { key }
                          </td>
                          <td>
                            { String(value) }
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                Files count
              </td>
              <td>
                { parsedScanInfo.files_count }
              </td>
            </tr>
            <tr>
              <td>
                Output format version
              </td>
              <td>
                { parsedScanInfo.output_format_version }
              </td>
            </tr>
            <tr>
              <td>
                SPDX license list version
              </td>
              <td>
                { parsedScanInfo.spdx_license_list_version }
              </td>
            </tr>
            <tr>
              <td>
                Operating system
              </td>
              <td>
                { parsedScanInfo.operating_system }
              </td>
            </tr>
            <tr>
              <td>
                CPU architecture
              </td>
              <td>
                { parsedScanInfo.cpu_architecture }
              </td>
            </tr>
            <tr>
              <td>
                Platform
              </td>
              <td>
                { parsedScanInfo.platform }
              </td>
            </tr>
            <tr>
              <td>
                Platform version
              </td>
              <td>
                { parsedScanInfo.platform_version }
              </td>
            </tr>
            <tr>
              <td>
                Python version
              </td>
              <td>
                { parsedScanInfo.python_version }
              </td>
            </tr>
            <tr>
              <td>
                Scan duration
              </td>
              <td>
                { parsedScanInfo.duration } seconds
              </td>
            </tr>
            <tr>
              <td>
                Tool notice
              </td>
              <td>
                { parsedScanInfo.notice }
              </td>
            </tr>
            <tr>
              <td>
                Raw header
              </td>
              <td>
                <ReactJson
                  src={parseIfValidJson(parsedScanInfo.raw_header_content || {})}
                  enableClipboard={false}
                  displayDataTypes={false}
                />
              </td>
            </tr>
            {/* {
              Object.entries(parsedScanInfo).map(([key, value]) => {
                const parsedValue = parseIfValidJson(value);
                // console.log("parsed value", parsedValue, ", og:", value);
                
                return (
                  <tr key={key}>
                    <td> { key } </td>
                    <td>
                      {
                        // Array.isArray()
                      }
                      {
                        parsedValue ?
                        Array.isArray(parsedValue) ?
                        <ul>
                          {
                            parsedValue.map(value => (
                              <li>
                                { value }
                              </li>
                            ))
                          }
                        </ul>
                        :
                        <ReactJson
                          src={parsedValue}
                          enableClipboard={false}
                          displayDataTypes={false}
                        />
                        : value
                      }
                    </td>
                  </tr>
                )
              })
            } */}
          </tbody>
        </table>
        : <h5>Import JSON / string first</h5>
      }
    </div>
  )
}

export default ScanInfo