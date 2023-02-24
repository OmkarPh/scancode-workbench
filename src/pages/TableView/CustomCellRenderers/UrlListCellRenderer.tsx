import React, { FunctionComponent, useMemo } from 'react'
import { Link } from 'react-router-dom';

interface UrlListCellRendererProps {
  value: string,
  routerLink?: boolean,
  urlPrefix?: string,
}
const UrlListCellRenderer: FunctionComponent<UrlListCellRendererProps> = (props) => {  
  const parsedValue: string[][] | string[] | string = useMemo(() => {
    if(Array.isArray(props.value))
      return props.value;
      
    try {
      const parsed = JSON.parse(props.value)
      return parsed
    } catch(err) {
      console.log("Err parsing url list cell, showing value as it is:", props.value);
      return props.value
    }
  }, [props.value]);


  if(!parsedValue)
    return <></>;
  
  if(!Array.isArray(parsedValue))
    return <>{ props.value }</>;

  return (
    <>
      {
        parsedValue.map ?
        parsedValue.map((subValues, i) => (
          <span key={i}>
            {
              Array.isArray(subValues) ?
              subValues.map((value, j) => (
                <span key={j}>
                  <LinkComponent
                    routerLink={props.routerLink}
                    urlPrefix={props.urlPrefix}
                    value={value}
                  />
                  <br/>
                </span>
              ))
              :
              <LinkComponent
                routerLink={props.routerLink}
                urlPrefix={props.urlPrefix}
                value={subValues}
              />
            }
            <br/>
          </span>
        ))
        : 
        <LinkComponent
          routerLink={props.routerLink}
          urlPrefix={props.urlPrefix}
          value={props.value}
        />
      }
      <br/>
    </>
  )
}
export default UrlListCellRenderer;





interface ListComponentProps {
  value: string,
  routerLink?: boolean,
  urlPrefix?: string,
}
const LinkComponent: FunctionComponent<ListComponentProps> = (props) => {
  const { value, routerLink, urlPrefix } = props;
  const URL = (urlPrefix || "") + value;

  return (
    <>
      {
        routerLink ?
        <Link to={URL}>
          { value }
        </Link>
        :
        <a href={URL}>
          { value }
        </a>
      }
    </>
  )
}