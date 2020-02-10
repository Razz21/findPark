import Vue from "vue";

Vue.directive("expand", {
  inserted: function(el, binding) {
    let value, height;
    height = el.clientHeight + "px";

    if (
      /* if value is Object literal */
      binding.value instanceof Object &&
      binding.value.constructor === Object
    ) {
      value = binding.value.value;
      // accept only number and convert it to px by default
      if (/^\d+$/.test(binding.value.height)) {
        height = binding.value.height + "px";
      }
      // accept all css units
      else if (
        /^(auto|0)$|^[+-]?[0-9]+.?([0-9]+)?(px|em|rem|ex|%|in|cm|mm|pt|pc|vh|vw)$/.test(
          binding.value.height
        )
      ) {
        height = binding.value.height;
      }
    } else {
      /* value is only trigger */
      value = binding.value;
    }

    if (value !== null) {
      function calcHeight() {
        const currentState = el.getAttribute("aria-expanded");

        // el.classList.add("u-no-transition");
        el.removeAttribute("aria-expanded");
        el.style.height = null;
        el.style.height = height;
        el.style.opacity = null;
        el.style.opacity = 1;
        el.setAttribute("aria-expanded", currentState);

        // setTimeout(function() {
        //   el.classList.remove("u-no-transition");
        // });
      }

      el.classList.add("expand");
      el.setAttribute("aria-expanded", value ? "true" : "false");
      calcHeight();
      window.addEventListener("resize", calcHeight);
    }
  },
  update: function(el, binding) {
    let value;
    if (
      binding.value instanceof Object &&
      binding.value.constructor === Object
    ) {
      value = binding.value.value;
    } else {
      value = binding.value;
    }
    if (el.style.height && value !== null) {
      el.setAttribute("aria-expanded", value ? "true" : "false");
    }
  }
});

Vue.directive("click-outside", {
  bind(el, binding, vnode) {
    var vm = vnode.context;
    var callback = binding.value;

    el.clickOutsideEvent = function(event) {
      if (!(el == event.target || el.contains(event.target))) {
        return callback.call(vm, event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  }
});

Vue.directive("scroll-end", {
  /* fire event on scroll-end with delay 150ms */
  bind(el, binding, vnode) {
    var vm = vnode.context;
    var callback = binding.value;
    var scrollTimer = -1;
    el.scrollEnd = function(event) {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => callback.call(vm, event), 150);
    };
    el.addEventListener("scroll", el.scrollEnd);
  },
  unbind(el) {
    el.removeEventListener("scroll", el.scrollEnd);
  }
});
