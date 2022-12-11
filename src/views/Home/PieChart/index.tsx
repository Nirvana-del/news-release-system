import React, {createRef, useEffect, useRef} from 'react'
import * as echarts from 'echarts';
import {useResize} from "@/views/Home/hooks/useResize";
interface Props{
    renderData:object
}
const PieChart: React.FC<Props> = (props) => {
    const { renderData } = props
    const chartDiv = createRef<HTMLDivElement>()
    const pieChart = useRef<echarts.ECharts>()
    useResize(pieChart)

    useEffect(() => {
        // console.log('进入pie')
        // console.log(pieChart.current)
        // console.log(chartDiv)
        let list = []
        for (const key in renderData) {
            list.push({
                name: key,
                value: renderData[key].length
            })
        }
        !pieChart.current && (pieChart.current = echarts.init(chartDiv.current!));
        let option = {
            title: {
                text: '当前用户新闻分类图示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        option && pieChart.current?.setOption(option);
    }, [chartDiv])
    return (
        <div id="pie-chart" style={{ width: '100%', height: '300px' }} ref={chartDiv}></div>
    )
}
export default PieChart