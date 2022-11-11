import React from "react"

const TableView = () => {
  // TODO
  return (
    <div>
      <table>
        {[...Array(32)].map((y, i) => {
          return (
            <tr key={i}>
              {[...Array(32)].map((x, i) => {
                const retVal = (
                  <td key={i}>
                    {<th className="border-separate border border-white bg-green-500 w-5 h-5"></th>}
                  </td>
                )
                return retVal
              })}
            </tr>
          )
        })}
      </table>
    </div>
  )
}

export default TableView
