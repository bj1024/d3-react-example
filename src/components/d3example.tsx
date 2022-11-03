import * as d3 from 'd3';

import {useEffect, useRef, useState} from "react";
import useInterval from "../lib/useinterval";

type Props = {}

const ITEM_NUM_MIN = 1
const ITEM_NUM_MAX = 10
const SVG_WIDTH = 300
const SVG_HEIGHT = 300

const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const generateDataset = () => (
  Array(randomInt(ITEM_NUM_MIN, ITEM_NUM_MAX)).fill(0).map(() => ([
    randomInt(0, SVG_WIDTH),
    randomInt(0, SVG_HEIGHT),
    randomInt(6, 50),
    randomInt(6, 50),
  ]))
)

export const D3Example = ({}: Props) => {

  const [dataset, setDataset] = useState(generateDataset())

  // react ref of <svg />
  const refSVG = useRef<SVGSVGElement>(null);
  const refCount = useRef<number>(0);

  let isloaded = useRef(false);
  // Reactの Strict Modeで２回Callされるのを防ぐ useEffectを使う。
  useEffect(() => {
    if (isloaded.current) {
      return
    } else {
      isloaded.current = true
    }

    if (!(dataset && refSVG.current)) {
      return
    }

    console.log(`useEffect ${dataset.length}`);
    const svgElement = d3.select(refSVG.current)

    let div_data = svgElement.selectAll("rect") // 全てのRectをセレクト。
      .data(dataset)  // データをバインド。

    // enter,exit,updateの要素が生成される。
    div_data.exit() // 削除される要素
      .attr("fill", "red")
      .call(exit => {
        // console.log(`exit call.`, exit);
        exit.transition().duration(800)
          .attr("width", 0)
          .attr("height", SVG_HEIGHT)
          .style("opacity", 0)
          .remove()
      })

    div_data  // update
      .text((datum, index) => `${index}-${datum[0]},${datum[1]}`) // datumは１要素、indexは配列添字
      .call(update => {
        // console.log(`update call.`, update);
        update.transition().duration(800)
          .attr("y", SVG_HEIGHT / 2)
          .attr("fill", "gray")
      })

    div_data.enter()  // 新規要素
      .append("rect")
      .text((datum, index) => `${index}-${datum[0]},${datum[1]}`) // datumは１要素、indexは配列添字
      .attr("x", d => d[0])
      .attr("y", 10)
      .attr("width", 0)
      .attr("height", 0)
      .style("opacity", 0)
      .attr("fill", "blue")
      .call(enter => {
        console.log(`enter call.`, enter);
        enter.transition().duration(800)
          .attr("width", 8)
          .attr("height", 8)
          .style("opacity", 1)
      })

    // const timer = setTimeout(() => {
    //   let new_dataset = generateDataset()
    //   console.log(`new_dataset.${new_dataset.length}`);
    //   // setDataset(new_dataset)
    // }, 3 * 1000);

    //   div_data.exit() // 削除される要素
    //     .remove()
    //   const timer = setTimeout(() => {
    //     const newDataset = generateDataset()
    //     setDataset(newDataset)
    //
    //   }, 2 * 1000);
    //
    // }, 1 * 1000);
    // console.log('TimerID ' + String(timer) + ' has started.');

    //クリーンアップ
    return () => {
      // console.log(
      //   'Restart button has clicked. TimerID ' + String(timer) + ' has canceled.'
      // );
      // clearTimeout(timer);
      // clearTimeout(timer2);
    };
  }, [dataset])


  useInterval(() => {
    refCount.current = dataset.length
    const newDataset = generateDataset()
    isloaded.current = false
    setDataset(newDataset)
  }, 3000)

  return (
    <div className="position-static h-100 w-100">
      <div
        style={{
          color: "#333",
          backgroundColor: "#f8f8f8",
          padding: 0,
          width: SVG_WIDTH,
          height: SVG_HEIGHT,

        }}>

        <svg ref={refSVG} style={{
          border: "2px solid #aaa",
          backgroundColor: "#101010",
          width: SVG_WIDTH - 2,
          height: SVG_HEIGHT - 2,
          marginLeft: "auto",
          marginRight: "auto",

        }}/>

        <div>{refCount.current} to {dataset.length} ({dataset.length - refCount.current})</div>
      </div>
    </div>
  )
}

export default D3Example
