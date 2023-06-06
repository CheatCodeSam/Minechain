import { store } from '../store'
import { property } from '../types'

const initialize = (initialData: property[], view: HTMLDivElement) => {

  const mapData: Record<number, property> = {}

  const draw = () => {
    const propertyNumber = 1024
    for (let i = 0; i < propertyNumber; i++) {
      mapData[i] = store.getState().property.properties[i] || initialData[i]
    }
  }

  store.subscribe(() => {
    draw()
    console.log(mapData)
  })
}

export default initialize
