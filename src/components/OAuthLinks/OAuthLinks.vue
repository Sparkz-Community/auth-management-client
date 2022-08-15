<template>
  <div>
    <div class="q-mb-md centerCenter" v-if="socialLinks.length > 0 && top">
      <div :style="`width: ${lineSize};height: 1px;background: rgba(220, 220, 220, 1)`"></div>
      <span class="q-mx-md inputFont" style="font-size: 0.9em;font-weight: 500;white-space: nowrap;">Sign in with Social Networks</span>
      <div :style="`width: ${lineSize};height: 1px;background: rgba(220, 220, 220, 1)`"></div>
    </div>
    <div class="q-mt-xs linkBoxContainer" v-if="socialLinks.length > 0 && !off" :style="socialLinksStyle">
      <div v-for="link in socialLinks" :key="link.name" class="linkBox centerCenter cursor-pointer" :style="`width: ${socialBoxSize[0]};height: ${socialBoxSize[1]};`">
        <a :href="link.link" class="centerCenter">
          <q-img :src="link.img" :style="`width: ${socialLinkImageSize[0]};height: ${socialLinkImageSize[1]};`" v-if="link.img"
                 class="linkBoxIcon" :alt="link.name"/>
          <q-icon :name="link.icon" :style="{color: link.color, width: socialLinkImageSize[0], height: socialLinkImageSize[1]}"
                  class="linkBoxIcon" v-else></q-icon>
        </a>
      </div>
    </div>
    <div class="q-mt-md centerCenter" v-if="socialLinks.length > 0 && !top">
      <div :style="`width: ${lineSize};height: 1px;background: rgba(220, 220, 220, 1)`"></div>
      <span class="q-mx-md inputFont" style="font-size: 0.9em;font-weight: 500;white-space: nowrap;">Sign in with Social Networks</span>
      <div :style="`width: ${lineSize};height: 1px;background: rgba(220, 220, 220, 1)`"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OAuthLinks',
    props: {
      socialLinks: {Type: Array, default: []},
      off: {Type: Boolean, default: false},
      top: {Type: Boolean, default: false},
      lineSize: {Type: String, default: '35%'},
      socialLinkImageSize: {
        Type: Array,
        default: () => {
          return ['40px', '40px'];
        },
        validator: (value) => {
          return value.length === 2;
        }
      },
      socialBoxSize: {
        Type: Array,
        default: () => {
          return ['60px', '60px'];
        },
        validator: (value) => {
          return value.length === 2;
        }
      },
    },
    computed: {
      socialLinksStyle() {
        let theStyle = 'grid-template-columns: ';
        for (let i = 0; i < this.socialLinks.length; i++) {
          theStyle += ' 1fr';
        }
        return theStyle;
      }
    }
  };
</script>

<style scoped lang="scss" src="./_OAuthLinks.scss">

</style>
