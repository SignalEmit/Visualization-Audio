<template>
  <div class="hold">
    <videostream :name="123123" :videoURL="url" :count="0" style="float:left"></videostream>
  </div>
</template>

<script>
import videostream from '../components/VideoStream'
export default {
  data() {
    return {
      url: 'http://127.0.0.1:8000/live/go.flv',
    }
  },
  methods: {},
  components: {
    videostream,
  },
  mounted() {},
  created() {},
}
</script>

<style scoped>
.hold {
  height: 5rem;
  /* overflow: auto; */
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 0.3rem;
  font-weight: bold;
  /* font-size: 0.2rem; */
  /* text-align: center; */
  /* vertical-align: middle;
  display: table-cell;
  height: 0.28rem; */
}

.el-menu {
  height: 5rem;
  width: 1rem;
}
.bodymain {
  height: 4.5rem;
  width: 9.5rem;
}
.route {
  height: 0.3rem;
  text-align: left;
  border: black solid 1px;
  /* background-color: cyan; */
}
.elmain {
  display: block;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
  height: 5rem;
  width: 9.9rem;
  padding: 0px;
}

.el-tabs--border-card {
  width: 9.9rem;
}

.el-tabs--border-card >>> .el-tabs__content {
  padding: 0rem;
}
.headname {
  font-size: 0.3rem;
}

.headposition {
  float: right;
}
.headposition >>> .el-tabs--border-card {
  width: 3rem;
}
.elmain::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.elmain::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
.elmain::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
}
</style>
