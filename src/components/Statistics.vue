<template>
    <el-container>
        <div>

        </div>
        <div class="chart-container">
            <el-row :gutter="32" type="flex" justify="center">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><v-chart class="chart" :option="bar"/></el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><v-chart class="chart" :option="pie"/></el-col>
            </el-row>
        </div>

    </el-container>
</template>

<script>
    export default {
        name: "Statistics",
        data() {
            return {
                bar: {},
                pie: {},
                dateList: [],
                countList: [],
                seriesList: [],
                masterList: [],
            }
        },
        mounted() {
            this.setData();
        },
        methods: {
            setData(){
                const _this = this;
                this.$axios.get("/listRecordData").then(res => {
                    _this.dateList = res.data.data.dateList;
                    _this.countList = res.data.data.countList;
                    _this.seriesList = res.data.data.seriesList;
                    _this.masterList = res.data.data.masterList;
                    this.setBar();
                    this.setPie();
                })
            },
            setBar(){
                const _this = this;
                this.bar = {
                    title: {
                        text: '新单词学习与掌握统计',
                        subtext: '第一次学习就已掌握的单词，不计数',
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['新学习', '掌握']
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
                            data: _this.dateList,
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
                            data: _this.countList,
                        },
                        {
                            name: '掌握',
                            type: 'bar',
                            data: _this.masterList,
                        }
                    ]
                }
            },
            setPie(){
                const _this = this;
                this.pie={
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
                        left: 'left',
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
    .chart-container{
        margin: 0 auto;
        width: 80%;
        height: 100%;
    }
    .chart {
        width: 100%;
        height: 360px;
    }

</style>