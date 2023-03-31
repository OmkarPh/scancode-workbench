import React, { useMemo } from 'react'
import { parseTokensFromExpression } from '../../../services/models/databaseUtils';

// @TODO - Create SPDXLicenseExpressionParser too !!
interface LicenseExpressionRendererProps {
  value: string,
  spdxLicense?: boolean,
  data: {
    license_expression: string,
    keys: {
      key: string,
      licensedb_url: string,
      scancode_url: string,
      spdx_license_key: string,
      spdx_url: string,
    }[],
  },
}

interface ParsedTokens {
  value: string,
  href?: string,
}

const LicenseExpressionRenderer = (props: LicenseExpressionRendererProps) => {
  const { spdxLicense, data } = props;

  const { license_expression, keys } = data;

  const parsedComponents = useMemo<ParsedTokens[]>(() => {    
    if(!license_expression || !keys)
      return [];

    const keyMap = new Map(keys.map(key => [key.key, key]));

    const tokens = parseTokensFromExpression(license_expression);
    const newParsedComponents = tokens.map(token => {
      const tokenInfo = keyMap.get(token);
      if(tokenInfo){
        if(spdxLicense)
          return {
            value: tokenInfo.spdx_license_key,
            href: tokenInfo?.spdx_url || "",
          }
        return {
          value: tokenInfo.key,
          href: tokenInfo?.licensedb_url || tokenInfo?.scancode_url || "",
        }
      }
      return { value: token }
    });
    // console.log("Parsed components", newParsedComponents);
    return newParsedComponents;
  }, [license_expression, keys]);
  
  
  // if(!value)
  //   return <></>;

  return (
    <>
      {
        parsedComponents.map(({ value, href }, idx) => {
          if(href){
            return (
            <a href={href} key={href+value}>
                { value }
              </a>
            );
          }
          return (
            <React.Fragment key={value+idx}>
              { value }
            </React.Fragment>
          )
        })
      }
    </>
  )
}

export default LicenseExpressionRenderer