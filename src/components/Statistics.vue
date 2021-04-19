<template>
	<div>
		<div class="chart-container">
			<el-row :gutter="32" justify="center" type="flex">
				<el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
					<v-chart :option="bar" class="chart"/>
				</el-col>
				<el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
					<v-chart :option="pie" class="chart"/>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
export default {
    name: 'Statistics',
    data() {
        return {
            bar: {},
            pie: {},
            dateList: [],
            countList: [],
            seriesList: [],
            masterList: []
        }
    },
    mounted() {
        this.setData()
    },
    methods: {
        setData() {
            const _this = this
            this.$axios.get('/listRecordData').then(res => {
                _this.dateList = res.data.data.dateList
                _this.countList = res.data.data.countList
                _this.seriesList = res.data.data.seriesList
                _this.masterList = res.data.data.masterList
                this.setBar()
                this.setPie()
            })
        },
        setBar() {
            const _this = this
            this.bar = {
                dataZoom: [{
                    type: 'inside',//slider表示有滑动块的，inside表示内置的
                    start: 50,//数据窗口范围的起始百分比,表示0%
                    end: 100,
                    // startValue: 0,//数据窗口范围的起始数值
                    // endValue: 9,//数据窗口范围的结束数值。
                    handleSize: 10
                }],
                title: {
                    text: '新单词学习与掌握统计',
                    subtext: '第一次学习就已掌握的单词，不计数'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['新学习', '已掌握']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: _this.dateList
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '新学习',
                        type: 'bar',
                        data: _this.countList
                    },
                    {
                        name: '已掌握',
                        type: 'bar',
                        data: _this.masterList
                    }
                ]
            }
        },
        setPie() {
            const _this = this
            this.pie = {
                title: {
                    text: '总学习进度',
                    // subtext: '纯属虚构',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: '学习进度',
                        type: 'pie',
                        radius: '50%',
                        data: _this.seriesList,
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
        }
    }
}
</script>

<style scoped>
	.chart-container {
		margin: 2% auto 0;
		width: 80%;
		height: 100%;
	}

	.chart {
		width: 100%;
		height: 360px;
	}

</style>
