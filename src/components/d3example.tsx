import * as d3 from 'd3';

import {useEffect, useRef, useState} from "react";
import useInterval from "../lib/useinterval";

type Props = {}

const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const generateDataset = () => (
  Array(randomInt(5, 20)).fill(0).map(() => ([
    randomInt(0, 300),
    randomInt(0, 300),
    randomInt(6, 50),
    randomInt(6, 50),
  ]))
)


export const D3Example = ({}: Props) => {

  const [dataset, setDataset] = useState(generateDataset())

  // react ref of <svg />
  const refSVG = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgElement = d3.select(refSVG.current)
    // svgElement.selectAll("rect")
    //   .data(dataset)
    //   .join("rect")
    //   // .attr("cx", d => d[0])
    //   // .attr("cy", d => d[1])
    //   // .attr("r",  3)
    //   .attr("x", d => d[0])
    //   .attr("y", d => d[1])
    //   .attr("width", d => d[2])
    //   .attr("height", d => d[3])


    let div_data = svgElement.selectAll("rect") // 全てのRectをセレクト。
      .data(dataset)  // データをバインド。

    // enter,exit,updateの要素が生成される。
    div_data.exit() // 削除される要素
      .attr("fill", "red")

    div_data  // update
      .text((datum, index) => `${index}-${datum[0]},${datum[1]}`) // datumは１要素、indexは配列添字
      .attr("x", d => d[0])
      .attr("y", d => d[1])
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "yellow")

    div_data.enter()  // 新規要素
      .append("rect")
      .text((datum, index) => `${index}-${datum[0]},${datum[1]}`) // datumは１要素、indexは配列添字
      .attr("x", d => d[0])
      .attr("y", d => d[1])
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "blue")


    const timer2 = undefined
    const timer = setTimeout(() => {

      div_data.exit() // 削除される要素
        .remove()

      const timer = setTimeout(() => {


        const newDataset = generateDataset()
        setDataset(newDataset)

      }, 2 * 1000);

    }, 1 * 1000);
    console.log('TimerID ' + String(timer) + ' has started.');

    //クリーンアップ
    return () => {
      console.log(
        'Restart button has clicked. TimerID ' + String(timer) + ' has canceled.'
      );
      clearTimeout(timer);
      clearTimeout(timer2);
    };


  }, [dataset])


  // useInterval(() => {
  //   const newDataset = generateDataset()
  //   setDataset(newDataset)
  // }, 1000)

  return (
    <div className="position-static h-100 w-100">
      <div
        style={{
          backgroundColor: "#e5e5e5",
          padding: 0,
          width: 800,
          height: 800
        }}>


        <svg ref={refSVG} style={{
          border: "0px solid gold",
          width: "500px",
          height: "100%",


        }}/>

        <div>dataset num={dataset.length}</div>
      </div>

    </div>
  )
}

export default D3Example
