<template>
  <div class="voideomain">
    <div class="videohead">{{name}}</div>
    <canvas class="audio leftaudio"></canvas>
    <div>
      <video class="video-js vjs-default-skin vjs-big-play-centered videostream" controls autoplay preload="auto" data-setup='{}'>
        <source :src="videoURL" type="video/mp4"> -->
      </video>

      <!-- <video class="videostream" controls autoplay></video> -->
    </div>
    <canvas class="audio rightaudio"></canvas>
    <!-- <div class="blank"></div> -->
  </div>
</template>


<script>
export default {
  props: ['name', 'videoURL', 'count'],
  data() {
    return {
      lGain: null,
      rGain: null,
      video: null,
      voiceLeft: 0,
      voiceRight: 0,
      leftAnalyserNode: null,
      rightAnalyserNode: null,
      rating: 0,
      leftCanvs: null,
      rightCanvs: null,
      leftCxt: null,
      rightCxt: null,
      grad: '',
      hwsy_pp_AudioContext_video: null,
      hwsy_pp_src: null,
      flvPlayer: null,
      speed: 0,
      url: '',
      port: 8000,
    }
  },
  methods: {
    showVol(url, videoDom, type, lineWidth) {
      let hwsy_pp_video = videoDom
      let videodom_width = hwsy_pp_video.offsetWidth
      let videodom_height = hwsy_pp_video.offsetHeight
      let voiceLeft = 0 //左声道音量
      let voiceRight = 0 //右声道音量
      let num = 1 //柱数量

      let hwsy_pp_AudioContext =
        window.AudioContext || window.webkitAudioContext || window.mozAudioContext //获取音频上下文

      this.hwsy_pp_AudioContext_video = new hwsy_pp_AudioContext()
      this.hwsy_pp_src = this.hwsy_pp_AudioContext_video.createMediaElementSource(hwsy_pp_video) //创建声音的源头处理器对象
      let splitterNode = this.hwsy_pp_AudioContext_video.createChannelSplitter(2) //创建分离声道处理器
      this.leftAnalyserNode = this.hwsy_pp_AudioContext_video.createAnalyser() //获取音频时间和频率数据
      this.rightAnalyserNode = this.hwsy_pp_AudioContext_video.createAnalyser() //获取音频时间和频率数据
      // leftAnalyserNode.fftSize = 256;
      // rightAnalyserNode.fftSize = 256;
      this.hwsy_pp_src.connect(splitterNode)
      splitterNode.connect(this.leftAnalyserNode, 0)
      splitterNode.connect(this.rightAnalyserNode, 1)

      let mergerNode = this.hwsy_pp_AudioContext_video.createChannelMerger(2) //创建合并声道处理器
      this.leftAnalyserNode.connect(mergerNode, 0, 0)
      this.rightAnalyserNode.connect(mergerNode, 0, 1)
      mergerNode.connect(this.hwsy_pp_AudioContext_video.destination)
      this.amoe()
    },
    playEvent(e) {
      console.log('开始播放')
      this.showVol('123', this.video, 30)
    },
    amoe() {
      // console.log(this.name)
      let hwsy_pp_LeftData = new Uint8Array(this.leftAnalyserNode.frequencyBinCount)
      this.leftAnalyserNode.getByteFrequencyData(hwsy_pp_LeftData)
      let hwsy_pp_RightData = new Uint8Array(this.rightAnalyserNode.frequencyBinCount)
      this.rightAnalyserNode.getByteFrequencyData(hwsy_pp_RightData)
      this.leftCxt.clearRect(0, 0, this.leftCanvs.width, this.leftCanvs.height)
      this.rightCxt.clearRect(0, 0, this.rightCanvs.width, this.rightCanvs.height)
      //取最大值
      this.voiceLeft = Math.max.apply(null, hwsy_pp_LeftData) / 270
      this.voiceRight = Math.max.apply(null, hwsy_pp_RightData) / 270
      //左声道
      this.leftCxt.beginPath()
      this.leftCxt.fillStyle = this.grad

      this.leftCxt.fillRect(
        0,
        (1 - this.voiceLeft) * this.leftCanvs.height,
        this.leftCanvs.width,
        this.voiceLeft * this.leftCanvs.height
      )
      //右声道
      this.rightCxt.beginPath()
      this.rightCxt.fillStyle = this.grad

      this.rightCxt.fillRect(
        0,
        (1 - this.voiceRight) * this.rightCanvs.height,
        this.rightCanvs.width,
        this.voiceRight * this.rightCanvs.height
      )
      requestAnimationFrame(this.amoe)
    },
    canvassx(obj) {
      obj.beginPath()
      obj.shadowBlur = 1
      obj.shadowColor = 'rgb(1, 1, 1)'
      obj.shadowWidth = 2
      obj.font = '50px'
      obj.textAlign = 'center'
      this.grad = obj.createLinearGradient(0, 50, 0, 0)
      this.grad.addColorStop(0, 'rgba(14, 244, 63, 1)')
      this.grad.addColorStop(0.2, 'rgba(72, 244, 11, 1)')
      this.grad.addColorStop(0.4, 'rgba(154, 244, 11, 1)')
      this.grad.addColorStop(0.5, 'rgba(244, 208, 11, 1)')
      this.grad.addColorStop(0.7, 'rgba(244, 143, 11, 1)')
      this.grad.addColorStop(0.8, 'rgba(242, 71, 11, 1)')
      this.grad.addColorStop(0.9, 'rgba(244, 28, 11, 1)')
      this.grad.addColorStop(1, 'rgba(244, 28, 11, 1)')
    },
    getMediaData(data) {},
    playerLoad() {
      if (flvjs.isSupported()) {
        if (this.flvPlayer != null) {
          this.playerDestroy()
        }
        this.flvPlayer = flvjs.createPlayer(
          {
            type: 'flv',
            isLive: true,
            hasVideo: true,
            hasAudio: true,
            withCredentials: false,
            url: this.url,
          },
          {
            type: 'flv',
            isLive: true,
            enableStashBuffer: true,
            url: this.url,
            autoCleanupMaxBackwardDuration: 60,
            autoCleanupMinBackwardDuration: 30,
            statisticsInfoReportInterval: 2000,
            stashInitialSize: 128 * 1024,

            // 如果是Android浏览器，建议enableDurationMonitor设置为false
            enableDurationMonitor: true, // true表示监测当前直播流延时，当发现延时过大时，主动追赶
            enableVideoFrozenMonitor: true, // 监测视频解码是否停滞（画面卡停），当因为某些原因导致无法解码时，将上报VIDEO_FROZEN事件，收到后建议重拉流
            // videoStateMonitorInterval: 1000, // 多长时间（毫秒）检查一次视频状态（延时、停滞）

            // 针对手机浏览器上对MSE以及网络连接更加容易不稳定，建议将maxDurationGap设置高一点，比如2.5、3、3.5，否则可能会频繁追赶延时导致画面卡顿
            // maxDurationGap: 1.5,         // 当前播放位置与缓冲区末尾的距离（秒）如果超过这个值，就触发一次追赶，不易过短
            // decreaseDurationStep: 0.4,   // 每次追赶至缓冲区末尾之前的多少秒
            // frozenTimesThreshold: 5,        // 解码停滞次数达到此阈值，上报VIDEO_FROZEN事件。注意如果设置过小的阈值，当推流端关闭摄像头后可能会频繁触发VIDEO_FROZEN事件

            // webrtc合流未能给cdn推送正确的视频分辨率信息，导致从MetaData/AVCDecoderConfigurationRecord中无法拿到正确的视频分辨率
            // 在内核低于Chromium 70的浏览器（如360浏览器、搜狗浏览器、PC微信内嵌浏览器等）中
            // 如果传递不对的视频分辨率，将会导致画面放大显示异常，因此，强行设置一个最大的视频宽高信息，来避免此问题
            // 如果是Safari浏览器，enableConstVideoViewSize建议设置为false
            enableConstVideoViewSize: true,
            // constVideoViewWidth: 1920,
            // constVideoViewHeight: 1080,
          }
        )

        this.flvPlayer.attachMediaElement(this.video)

        // player.enableVideoStateMonitor(true or false);   // 如果需要，可以动态开关{视频延时 + 解码停滞}监测

        // 当收到以下事件时：
        // MEDIA_SOURCE_ENDED [流结束]
        // MEDIA_SOURCE_CLOSE [流关闭]
        // VIDEO_FROZEN [视频解码停滞]
        // VIDEO_RESOLUTION_CHANGED [视频分辨率变化]
        // ERROR [网络或媒体流错误]
        // 建议结合业务信令来判断应该如何处理
        // 如果已知推流主动停止，则不必处理，否则建议重拉流

        //receive different video resolution from AVCSpecificConfig
        this.flvPlayer.on(flvjs.Events.VIDEO_RESOLUTION_CHANGED, () => {
          this.playerLoad()
        })

        this.flvPlayer.on(flvjs.Events.VIDEO_FROZEN, () => {
          this.playerLoad()
        })

        // show statistics information if need
        this.flvPlayer.on(flvjs.Events.STATISTICS_INFO, (e) => {
          if (e.speed == 0) {
            this.speed++
          }

          if (this.speed > 10) {
            this.speed = 0
            this.playerLoad()
          }
        })

        this.flvPlayer.load()
        this.flvPlayer.play()
      }
    },
    playerDestroy() {
      this.speed = 0
      this.flvPlayer.unload()
      this.flvPlayer.detachMediaElement()
      this.flvPlayer.destroy()
      this.flvPlayer = null
    },
  },
  mounted() {
    this.port = parseInt(this.count / 6) + this.port
    console.log('url：' + this.url)
    this.url = this.videoURL
    this.video = document.getElementsByTagName('video')[this.count]
    this.playerLoad()
    this.leftCanvs = document.getElementsByTagName('canvas')[this.count * 2]
    this.rightCanvs = document.getElementsByTagName('canvas')[this.count * 2 + 1]
    this.leftCxt = this.leftCanvs.getContext('2d')
    this.rightCxt = this.rightCanvs.getContext('2d')
    this.canvassx(this.leftCxt)
    this.canvassx(this.rightCxt)
    this.video.addEventListener('play', this.playEvent)

    this.video = document.getElementsByClassName('videostream')[this.count]
    setInterval(() => {
      console.log(JSON.stringify(this.video.audio))
    }, 500)

    this.leftCanvs = document.getElementsByTagName('canvas')[this.count * 2]
    this.rightCanvs = document.getElementsByTagName('canvas')[this.count * 2 + 1]
    this.leftCxt = this.leftCanvs.getContext('2d')
    this.rightCxt = this.rightCanvs.getContext('2d')
    this.canvassx(this.leftCxt)
    this.canvassx(this.rightCxt)
    this.video.addEventListener('play', this.playEvent)
  },
  created() {},
  beforeDestroy() {
    this.playerDestroy()
    this.hwsy_pp_src.disconnect()
    this.hwsy_pp_src = null
    this.hwsy_pp_AudioContext_video.close()
    this.hwsy_pp_AudioContext_video = null
    console.log('播放器停止拉流')
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.voideomain {
  height: 100%;
  width: 100%;
}

.videostream {
  height: 5rem;
  width: 85%;
  float: left;
  object-fit: fill;
}

.audio {
  height: 5rem;
  width: 7.5%;
}
.leftaudio {
  float: left;
  background-color: black;
}
.rightaudio {
  float: left;
  background-color: black;
}
.blank {
  height: 5rem;
  width: 10px;
  float: left;
  background-color: white;
}
.videohead {
  background-color: blue;
  color: black;
  width: 100%;
  height: 0.25rem;
}
</style>
