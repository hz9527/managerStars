<template lang="html">
  <div class="item">
    <div class="item-first"></div>
    <div class="item-left">
      <div class="item-name">
        <span class="hz-ellipsis">{{data.name}}</span>
        <div class="hz-btn-s">查看</div>
        <div class="hz-btn-s">复制git地址</div>
      </div>
      <div class="item-base">
        作者: <span>{{data.owner}}</span>
        默认分支: <span>{{data.default_branch}}</span>
        主要语言: <span>{{data.language}}</span>
      </div>
      <div class="item-info">
        forks: <span>{{data.forks}}</span>
        stars: <span>{{data.watchers}}</span>
        open_issues: <span>{{data.open_issues}}</span>
      </div>
      <div class="item-time">
        created_at: <span>{{data.created_at | time}}</span>
        updated_at: <span>{{data.updated_at | time}}</span>
      </div>
      <div class="item-desc">{{data.description}}</div>
    </div>
    <div class="item-right">
      <div class="tips">

      </div>
      <div class="desc">
        <textarea name="name" rows="8" cols="80"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    },
    type: {
      type: String,
      default: 'prod'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/rule.scss';
.item {
  display: flex;
  margin: 5px;
  border-bottom: 1px solid $border;
  padding: 5px 0;
}
.item-left, .item-right {
  width: 50%;
  flex-shrink: 10;
}
.item-first, .item-right{
  flex-shrink: 0;
}
.item-first {
  width: 5%;
}
.item-left {
  .item-name {
    padding: 5px;
    display: flex;
    color: $titColor;
    border-bottom: 1px solid $border;
    .hz-btn-s {
      flex-shrink: 0;
      margin: 3px;
    }
    span {
      font-size: $titSize;
    }
  }
  .item-desc {
    color: $infoColor;
  }
}
.item-right {
}
</style>
