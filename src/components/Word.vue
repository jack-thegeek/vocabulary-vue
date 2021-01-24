<template>
    <div>
        查单词
    </div>
</template>

<script>
    export default {
        name: "Word",
        data() {

        },
        mounted: function () {
            this.$axios.get('/getMyBooks').then(res => {

                alert("succeed");
            });
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>