import React, { useMemo } from 'react'

interface UrlRendererProps {
  value: string,
}

const UrlRenderer = (props: UrlRendererProps) => {
  const { value } = props;
  
  if(!value)
    return <></>;

  return (
    <>
      <a href={value}>
        { value }
      </a>
    </>
  )
}

export default UrlRenderer