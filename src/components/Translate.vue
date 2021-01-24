<template>
    <div class="transPageBox">
        <div>多接口翻译</div>
        <el-row :gutter="30" type="flex" justify="center">
            <el-col :span="8">
                <el-radio-group v-model="radio">
                    <el-radio label="en">中译英</el-radio>
                    <el-radio label="zh">英译中</el-radio>
                </el-radio-group>

                <p></p>
                <el-form ref="searchForm" :model="searchForm" :rules="rules">
                    <el-form-item label="" prop="textarea">
                        <el-input
                                type="textarea"
                                :rows="4"
                                placeholder="请输入内容"
                                v-model="searchForm.textarea">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search('searchForm')" style="float: right">翻译</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="10">
                <el-collapse v-model="activeNames" v-if="show">
                    <el-collapse-item title="百度翻译" name="1">
                        <div>{{baiduResult}}</div>
                    </el-collapse-item>
                    <el-collapse-item title="有道翻译" name="2">
                        <div>
                            <p><span>网络释义</span></p>
                            <p><span>{{youdaoweb}}</span></p>
                            <!--                            <a href="#" @click="onPlay">播放音频<audio ref="youdaoAudio" :src="audioUrl" @play="onPlay" controls="controls"></audio></a>-->
                            <p></p>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="彩云翻译" name="3">
                        <div>{{caiyunResult}}</div>
                    </el-collapse-item>
                    <el-collapse-item title="腾讯翻译" name="4">
                        <div>{{tencentResult}}</div>
                    </el-collapse-item>

                </el-collapse>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Translate",
        data() {
            return {
                show: false,
                radio: 'en',
                activeNames: ['1', '2', '3', '4'],
                baiduResult: '',
                youdaoResult: '',
                caiyunResult: '',
                tencentResult: '',
                youdaoweb: '',
                audioUrl: '',
                searchForm: {
                    textarea: '欢天喜地',
                },
                rules: {
                    textarea: [
                        {required: true, message: '请输入文本', trigger: 'blur'}
                    ],
                }

            };
        },
        mounted: function () {

        },
        methods: {
            search(formName) {
                const _this = this;
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {

                        const {data: res} = await this.$axios.get("/translate?query=" + _this.searchForm.textarea + "&to=" + _this.radio);
                        var result = JSON.parse(res.data);

                        _this.caiyunResult = result.caiyun.target;
                        _this.tencentResult = result.tencent.TargetText;
                        _this.baiduResult = result.baidu.trans_result[0].dst;

                        let youdao = result.youdao;
                        let webValue = youdao.web[0].value;
                        var youdaoweb = '';
                        for (var i = 0; i < webValue.length; i++) {
                            youdaoweb += webValue[i] + ' ,';
                        }
                        _this.youdaoweb = youdaoweb;
                        // _this.audioUrl = youdao.tSpeakUrl;
                        // this.$refs.youdaoAudion.play()


                        if (_this.show == false) {
                            _this.show = true;
                        }
                    } else {
                        _this.$message.warning('请输入文本');
                        return false;
                    }
                });
            },
            // onPlay(){
            //     this.audio.playing = true;
            // }


        }

    }
</script>

<style scoped>
    .search-content {
        padding: 0;
    }

    .transPageBox {

    }

    .el-row {
        margin-bottom: 20px;
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
</style>