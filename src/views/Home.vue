<template>
	<el-container>
		<el-header>
			<Header></Header>
		</el-header>
		<el-main class="full-height">
			<router-view></router-view>
		</el-main>
		<el-footer>
			All Rights Reserved @Jack 何子杰
		</el-footer>
	</el-container>
</template>

<script>
import Header from '../components/Header'
import starOn from '../assets/icon/star-on.svg'
import starOff from '../assets/icon/star-off.svg'

export default {
    name: 'Home',
    components: {Header},
    data() {
        return {
            starOn: starOn,
            starOff: starOff
        }
    }
    // mounted: function () {
    //
    // },
    // methods: {
    //
    // }
}
</script>

<style scoped>
	.el-container {
		width: 100%;
		height: 100%;
	}

	.full-height {
		height: 100vh;
	}
</style>
