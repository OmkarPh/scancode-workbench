import React, { useMemo } from 'react'

interface UrlRendererProps {
  value: string,
  data: any,
  customTextField?: string,
  customHrefField?: string,
}

const UrlRenderer = (props: UrlRendererProps) => {
  const { value, data, customTextField, customHrefField } = props;
  
  if(!value)
    return <></>;

  return (
    <>
      <a href={ customHrefField ? data[customHrefField] || value : value }>
        { customTextField ? data[customTextField] || value : value }
      </a>
    </>
  )
}

export default UrlRenderer