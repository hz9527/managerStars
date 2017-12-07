<template lang="html">
  <div class="hz-modal-bg">
    <div class="hz-modal-con">
      <div class="hz-img">
        <img :src="getImg" />
      </div>
      <div class="item">
        <div class="item-con">
          <label for="name">github用户名</label>
          <input type="text" @input='changeName' id='name' ref='name'>
        </div>
        <span v-show='nameTipShow'>用户不存在</span>
      </div>
      <div class="item">
        <div class="item-con">
          <label for="repo">仓库名</label>
          <input type="text" @input='changeRepo' id='repo' ref='repo'>
        </div>
        <span v-show='repoTipShow'>仓库已存在</span>
      </div>
      <div class="hz-btn-full" @click='submit'>提交</div>
    </div>
  </div>
</template>

<script>
import {checkUser, checkRepo, setUserInfo} from '../API/serve'
import {mapGetters, mapMutations} from 'vuex'
import {throttle} from '../utils/utils'
let nameTimer = throttle(300)
let repoTimer = throttle(300)
const DefaultImg = './lib/app/src/assets/user.png'
export default {
  data () {
    return {
      nameTipShow: false,
      repoTipShow: false,
      _loadingName: false,
      _loadingRepo: false
    }
  },
  created () {
    if (!this.getImg) {
      this.setImg(DefaultImg)
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getRepo', 'getImg'])
  },
  methods: {
    ...mapMutations(['setUser', 'setRepo', 'setImg']),
    submit () {
      setUserInfo({userName: 'hz9527', repository: 'awesome', img: this.img})
        .then(res => {
          console.log(res)
        })
    },
    changeName () {
      if (this._loadingName || !this.$refs.name.value) return
      var checkNameFn = () => {
        this._loadingName = true
        this.setUser(this.$refs.name.value)
        checkUser()
          .then(res => {
            this._loadingName = false
            if (this.getUser !== this.$refs.name.value) {
              checkNameFn()
            } else {
              if (res.data.id) {
                this.setImg(res.data.img)
                this.nameTipShow = false
              } else {
                this.setImg(DefaultImg)
                this.nameTipShow = true
              }
            }
          })
      }
      nameTimer(checkNameFn)
    },
    changeRepo () {
      if (this._loadingRepo || !this.$refs.repo.value) return
      var checkRepoFn = () => {
        this._loadingName = true
        this.setRepo(this.$refs.repo.value)
        checkRepo()
          .then(res => {
            this._loadingRepo = false
            if (this.getRepo !== this.$refs.repo.value) {
              checkRepoFn()
            } else {
              if (res.data.id) {
                this.repoTipShow = true
              } else {
                this.repoTipShow = false
              }
            }
          })
      }
      repoTimer(checkRepoFn)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/rule.scss';
.hz-modal-con {
  width: 50%;
}
.item {
  text-align: center;
  padding: 10px 30px;
}
</style>
