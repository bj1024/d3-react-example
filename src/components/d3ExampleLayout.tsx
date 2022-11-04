import * as d3 from 'd3';
import * as d3Drag from 'd3-drag';
import {ArrayLike, select, Selection} from 'd3-selection';

import {useEffect, useRef, useState} from "react";
import useInterval from "../lib/useinterval";

type Props = {}

const ITEM_NUM_MIN = 1
const ITEM_NUM_MAX = 10
const SVG_WIDTH = 600
const SVG_HEIGHT = 600
const CIRCLE_RADIUS = 20

const RECT_WIDTH = 20
const RECT_HEIGHT = 20
const RECT_WIDTH_MAX = 10
const RECT_HEIGHT_MAX = 10
const RECT_WIDTH_MIN = 1
const RECT_HEIGHT_MIN = 1
const ENTER_Y = 0 + CIRCLE_RADIUS
const UPDATE_Y = SVG_HEIGHT / 2
const EXIT_Y = SVG_HEIGHT

const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const generateDataset = () => (
  Array(randomInt(ITEM_NUM_MIN, ITEM_NUM_MAX)).fill(0).map(() => ([
    randomInt(0, SVG_WIDTH),
    randomInt(0, SVG_HEIGHT),
    randomInt(RECT_WIDTH_MIN, RECT_WIDTH_MAX),
    randomInt(RECT_HEIGHT_MIN, RECT_HEIGHT_MAX),
  ]))
)

type CircleDatum = {
  id: number;
  label: string;
}
export const D3ExampleLayout = ({}: Props) => {

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


    var nodes: CircleDatum[] = [
      {id: 0, label: "A"},
      {id: 1, label: "B"},
      {id: 2, label: "C"},
      {id: 3, label: "D"},
      {id: 4, label: "E"},
      {id: 5, label: "F"},
      {id: 6, label: "G"}
    ]

    var links = [
      {source: 0, target: 1},
      {source: 0, target: 2},
      {source: 0, target: 3},
      {source: 3, target: 4},
      {source: 3, target: 5},
      {source: 3, target: 6},
      {source: 6, target: 6}
    ];
    console.debug("force")
    const svgElement = d3.select(refSVG.current)

    const dragging = (event: any, d: any) => {
      console.debug("dragging", event.x, event.y)
    }
    var dragR = d3.drag().on('drag', dragging);


    svgElement.selectAll("circle") // circle。
      .data(nodes)  // データをバインド。
      .join(
        enter => {
          return enter.append("circle")
            .attr("cx", SVG_WIDTH / 2)
            .attr("cy", SVG_HEIGHT - CIRCLE_RADIUS)
            .attr("r", 10)
            .style("opacity", 1)
            .attr("fill", "blue")

        }
      )

    // DefinitelyTyped/d3-drag-tests.ts at master · DefinitelyTyped/DefinitelyTyped https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/d3-drag/d3-drag-tests.ts

    let circleDrag: d3Drag.DragBehavior<SVGCircleElement, CircleDatum, CircleDatum | d3Drag.SubjectPosition>;
    circleDrag = d3Drag.drag<SVGCircleElement, CircleDatum>();
    const circles: Selection<SVGCircleElement, CircleDatum, SVGSVGElement, any> =
      svgElement.selectAll<SVGCircleElement, CircleDatum>('circle');

    circleDrag = circleDrag
      // .on('start', wrongDragHandler1) // fails, wrong datum type in handler
      // .on('start', wrongDragHandler2) // fails, wrong this-type for DOM Element context
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);


    circles.call(circleDrag);


    function dragstarted(this: SVGCircleElement, event: any, d: CircleDatum) {
      // cast d3 event to drag event. Otherwise, d3 event is currently defined as type 'any'
      const e = event as d3Drag.D3DragEvent<SVGCircleElement, CircleDatum, CircleDatum | d3Drag.SubjectPosition>;
      e.sourceEvent.stopPropagation();
      select(this).classed('dragging', true);
    }

    function dragged(this: SVGCircleElement, event: any, d: CircleDatum) {
      // cast d3 event to drag event. Otherwise, d3 event is currently defined as type 'any'
      const e = event as d3Drag.D3DragEvent<SVGCircleElement, CircleDatum, CircleDatum | d3Drag.SubjectPosition>;
      select(this).attr('cx', e.x).attr('cy', e.y);
    }

    function dragended(this: SVGCircleElement, event: any, d: CircleDatum) {
      select(this).classed('dragging', false);
    }


    // .on("start",dragstarted)
    // d3.drag().on("drag", dragging)

    // .call(selection => {
    //   selection.transition().duration(800)
    //     .attr("cx", (d, i) => {
    //       return (CIRCLE_RADIUS * 2 + 10) * i + CIRCLE_RADIUS
    //     })
    //     .attr("cy", ENTER_Y)
    //     .attr("r", CIRCLE_RADIUS)
    //     .style("opacity", 1)
    //
    //
    // })
    // .call(selection => {
    //     console.debug("call")
    //     d3.drag()
    //       .clickDistance(1)
    //       .on('start', (event: DragEvent) => {
    //         console.debug("drag start")
    //       })
    //       .on('drag', (event: any, d: any) => {
    //         console.debug("drag drag")
    //       })
    //       .on('end', () => {
    //         console.debug("drag end")
    //       })
    // }
    //   )
    // .call(selection => {
    //     console.debug("call")
    //     d3.drag()
    //       .clickDistance(1)
    //       .on('start', (event: DragEvent) => {
    //         console.debug("drag start")
    //       })
    //       .on('drag', (event: any, d: any) => {
    //         console.debug("drag drag")
    //       })
    //       .on('end', () => {
    //         console.debug("drag end")
    //       })
    // }
    //   )

    //           .call(d3.drag()
    //             .on("start", (event, d) => circle.filter(p => p === d).raise().attr("stroke", "black"))
    //             .on("drag", (event, d) => (d.x = event.x, d.y = event.y))
    //             .on("end", (event, d) => circle.filter(p => p === d).attr("stroke", null))
    //             .on("start.update drag.update end.update", update));
    //
    // )
    // )

    // var dragHandler = d3.drag()
    //   .on("drag", (event: any, d: any)=>{
    //     // d3.select(this)
    //     //   .attr("x", d3.event.x)
    //     //   .attr("y", d3.event.y);
    //     console.debug("drag drag",event.x,event.y)
    //   });
    // dragHandler(svgElement.selectAll("circle"))
    //
    // var simulation = d3.forceSimulation()
    //   .force("link", d3.forceLink())
    //   .force("charge", d3.forceManyBody())
    //   .force("center", d3.forceCenter(SVG_WIDTH / 2, SVG_HEIGHT / 2));


    //クリーンアップ
    return () => {

    };
  }, [dataset])

  //
  // useInterval(() => {
  //   refCount.current = dataset.length
  //   const newDataset = generateDataset()
  //   isloaded.current = false
  //   setDataset(newDataset)
  // }, 2000)

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

        <div>D3ExampleLayout<br/>{refCount.current} to {dataset.length} ({dataset.length - refCount.current})
        </div>
      </div>
    </div>
  )
}

export default D3ExampleLayout
