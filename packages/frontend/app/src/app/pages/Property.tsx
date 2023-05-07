import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'


const Property = () => {

  const {id} = useParams()

  return (
    <div className="">{id}</div>
  )
}

export default Property
