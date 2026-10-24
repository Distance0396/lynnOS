<script setup lang="ts">
import XpChrome from '../../components/common/XpChrome.vue';

const TECH_TAGS = ['Vue.js', 'OpenLayers', 'Cesium', 'WebGIS', 'Node.js', 'TypeScript', 'PostGIS', 'Python'];
const HOBBY_TAGS = ['旧互联网', '梦核美学', '摄影', '散步', '音乐', '阅读', '游戏', '天文'];
</script>

<template>
  <XpChrome address="关于我">
    <div class="am-root">
      <div class="am-header">
        <div class="am-avatar">
          <img src="/assets/icons/xp/48/user-key.png" alt="" width="48" height="48">
        </div>
        <div>
          <h2 class="am-name">某个人</h2>
          <div class="am-line">前端开发者 · WebGIS 爱好者 · 梦核美学收藏家</div>
          <div class="am-line am-line-gap">某个安静的角落</div>
        </div>
      </div>

      <div class="am-body">
        <section class="am-section">
          <h3>简介</h3>
          <p>一个喜欢安静空间的人。热爱前端开发，尤其关注 WebGIS 和地图可视化。喜欢在闲暇时光散步、拍照，收集那些被遗忘的网站和旧互联网的记忆。</p>
          <p class="am-p-gap">这个博客就像一台旧电脑，保存着一些记忆、文字和没有完成的想法。</p>
        </section>

        <section class="am-section">
          <h3>技术栈</h3>
          <div class="am-tags">
            <span v-for="tag in TECH_TAGS" :key="tag" class="am-tag">{{ tag }}</span>
          </div>
        </section>

        <section class="am-section">
          <h3>兴趣爱好</h3>
          <div class="am-tags">
            <span v-for="tag in HOBBY_TAGS" :key="tag" class="am-tag">{{ tag }}</span>
          </div>
        </section>

        <section class="am-section">
          <h3>喜欢的音乐</h3>
          <p class="am-muted">Dreamcore Ambient · Liminal Sounds · Nostalgic Internet · Retro Wave</p>
        </section>

        <section class="am-section">
          <h3>喜欢的空间</h3>
          <p class="am-muted">空旷的走廊 · 日落时的街道 · 雨后的花园 · 旧房间的窗口</p>
        </section>

        <section class="am-section">
          <h3>链接</h3>
          <div class="am-links">
            <div>Email：somewhere@example.com</div>
            <div>GitHub：github.com/somewhere</div>
            <div>Twitter：@somewhere_exe</div>
          </div>
        </section>
      </div>

      <div class="am-footer">
        <div class="am-quote">"Somewhere, between memory and reality."</div>
      </div>
    </div>
  </XpChrome>
</template>

<style scoped>
.am-root {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.am-header {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #e8ecf4, #f5f4ef);
  border-bottom: 1px solid #d5d2c5;
}

.am-avatar {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, var(--dream-blue), var(--dream-teal));
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #d5d2c5;
  flex-shrink: 0;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
}

.am-name {
  font-size: 20px;
  color: var(--xp-blue);
  margin: 0 0 4px;
}

.am-line {
  font-size: 12px;
  color: var(--text-secondary);
}

.am-line-gap {
  margin-top: 4px;
}

.am-body {
  flex: 1;
  overflow: auto;
  padding: 20px;
  font-size: 13px;
  line-height: 1.8;
}

.am-section {
  margin-bottom: 16px;
}

.am-section:last-child {
  margin-bottom: 0;
}

.am-section h3 {
  font-size: 14px;
  color: var(--xp-blue);
  border-bottom: 1px solid #d5d2c5;
  padding-bottom: 4px;
  margin: 0 0 8px;
}

.am-section p {
  margin: 0;
}

.am-p-gap {
  margin-top: 6px !important;
}

.am-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.am-tag {
  padding: 2px 10px;
  background: #e8ecf4;
  border: 1px solid #c8c8b8;
  border-radius: 2px;
  font-size: 11px;
}

.am-muted {
  font-size: 12px;
  color: var(--text-secondary);
}

.am-links {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 2;
}

.am-footer {
  padding: 10px 20px;
  border-top: 1px solid #d5d2c5;
  background: var(--win-bg);
  text-align: center;
}

.am-quote {
  font-size: 12px;
  font-style: italic;
  color: var(--dream-gray-blue);
}
</style>
