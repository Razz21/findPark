<template>
  <transition
    name="auto-height"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot />
  </transition>
</template>

<script>
export default {
  data() {
    return {
      h: undefined
    };
  },
  methods: {
    enter(element) {
      const width = getComputedStyle(element).width;

      element.style.width = width;
      element.style.position = "absolute";
      element.style.visibility = "hidden";
      element.style.height = "auto";

      const height = getComputedStyle(element).height;

      element.style.width = null;
      element.style.position = null;
      element.style.visibility = null;
      element.style.height = 0;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = height;
        });
      });
    },
    afterEnter(element) {
      element.style.removeProperty("width");
      element.style.removeProperty("position");
      element.style.removeProperty("visibility");
      element.style.removeProperty("height");
      this.$emit("transitionend", element);
    },
    leave(element) {
      const height = getComputedStyle(element).height;

      element.style.height = height;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = 0;
        });
      });
    },
    afterLeave(element) {
      element.style.removeProperty("height");
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.auto-height {
  &-enter,
  &-leave-to {
    height: 0;
    opacity: 0;
    visibility: hidden;
  }

  &-leave,
  &-enter-to {
    visibility: visible;
    opacity: 1;
  }

  &-enter-active,
  &-leave-active {
    transition-property: height, opacity;
    transition-duration: 350ms;
    transition-timing-function: ease;
    overflow: hidden;
  }

  &-enter-active {
    transition-delay: 0ms, 350ms;
  }
}
</style>
