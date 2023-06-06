'use client'

import { property } from '../types'
import initialize from './leaflet'
import { useEffect, useRef } from 'react'

interface PropTypes {
  data: {
    data: property[]
  }
}

export default function Grid(props: PropTypes) {
  const displayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (displayRef.current) initialize(props.data.data, displayRef.current)
  }, [props, displayRef])

  return <div ref={displayRef}>grid</div>
}
