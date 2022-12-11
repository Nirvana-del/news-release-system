import React, {createRef, useEffect, useRef} from 'react'
import * as echarts from 'echarts';
import {useResize} from "@/views/Home/hooks/useResize";
interface Props{
    renderData:object
}
const BarChart: React.FC<Props> = (props) => {
    const { renderData } = props
    const chartDiv = createRef<HTMLDivElement>()
    const barChart = useRef<echarts.ECharts>()
    useResize(barChart)

    useEffect(() => {
        // console.log('进入bar')
        // console.log(barChart.current)
        !barChart.current && (barChart.current = echarts.init(chartDiv.current!));
        let option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(renderData),
                axisLabel: {
                    // rotate: '45',
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(renderData).map((item:[]) => item.length)
                }
            ]
        }
        option && barChart.current?.setOption(option);
    }, [chartDiv])
    return (
        <div id="bar-chart" style={{ height: '350px' }} ref={chartDiv}></div>
    )
}
export default BarChart