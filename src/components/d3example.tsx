import {useEffect, useRef, useState} from "react";

type Props = {}

const generateDataset = () => (
  Array(10).fill(0).map(() => ([
    Math.random() * 100 + 10,
    Math.random() * 100 + 10,
  ]))
)

export const D3Example = ({}: Props) => {

  const [dataset, setDataset] = useState(generateDataset())

  // react ref of <svg />
  const refSVG = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgElement = d3.select(refSVG.current)
    svgElement.selectAll("rect")
      .data(dataset)
      .join("rect")
      // .attr("cx", d => d[0])
      // .attr("cy", d => d[1])
      // .attr("r",  3)
      .attr("x", d => d[0])
      .attr("y", d => d[1])
      .attr("width", 3)
      .attr("height", 3)

  }, [dataset])
  useInterval(() => {
    const newDataset = generateDataset()
    setDataset(newDataset)
  }, 1000)

  return (
    <div className="position-static h-100 w-100">
      <div
        style={{
          backgroundColor: "#bbbbbb",
          padding: 0,
          height: 800
        }}>
        <div>D3Example</div>


        <svg ref={refSVG} style={{
          border: "2px solid gold",
          width: "100%",
          height: "100%",

        }}/>


      </div>

    </div>
  )
}

export default D3Example
