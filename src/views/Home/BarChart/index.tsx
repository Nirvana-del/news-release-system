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
                text: '新闻分类图示',
                subtext: '展示不同新闻分类下的新闻分布',
            },
            tooltip: {},
            legend: {
                data: ['新闻数量']
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
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            series: [
                {
                    name: '新闻数量',
                    type: 'bar',
                    showBackground: true,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#83bff6' },
                            { offset: 0.5, color: '#188df0' },
                            { offset: 1, color: '#188df0' }
                        ])
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#2378f7' },
                                { offset: 0.7, color: '#2378f7' },
                                { offset: 1, color: '#83bff6' }
                            ])
                        }
                    },
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