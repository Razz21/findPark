<template>
  <v-text-field
    ref="field"
    v-model="model"
    @focus="onFocus"
    @keyup="onKeyUp"
    :error-messages="errorMessages"
    v-bind="$attrs"
    @change="onChange"
    @blur="onBlur"
    @keypress="onKeyDown"
    @click:clear="onClear"
  />
</template>

<script>
function tryParseFloat(str, defaultValue) {
  var retValue = defaultValue;

  if (str !== null) {
    if (str.length > 0) {
      if (!isNaN(str)) {
        retValue = parseFloat(str);
      }
    }
  }
  return retValue;
}

export default {
  props: {
    value: null,
    "error-messages": null,
    allowNegative: {
      type: Boolean,
      default: false
    },
    thousandsSeparator: {
      type: String,
      default: ","
    },
    decimalSeparator: {
      type: String,
      default: "."
    },
    languageCode: {
      type: String,
      default: "en-US"
    },
    decimalPoints: {
      type: Number,
      default: 0,
      validator: v => {
        return /^\d+$/.test(v);
      }
    },
    permanentDecimal: {
      /* always show decimal points */
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      numberValue: this.value,
      model: this.value,
      isMasked: true,

      thousandsSeparatorRegex: new RegExp(`\\${this.thousandsSeparator}`, "g"),
      decimalSeparatorRegex: new RegExp(`\\${this.decimalSeparator}`, "g")
    };
  },
  computed: {
    init() {
      return (
        "0" +
        (this.decimalPoints ? "." + "".padEnd(this.decimalPoints, "0") : "")
      );
    }
  },

  methods: {
    onClear() {
      this.model = this.numberValue = this.init;
    },
    onKeyDown($event) {
      const char = String.fromCharCode($event.keyCode),
        sep = this.decimalPoints ? this.decimalSeparator : "";
      const regex = new RegExp("/[^0-9" + sep + "]/", "g");
      this.model = $event.target.value.replace(regex, "");
      if (
        ($event.which != sep.charCodeAt(0) ||
          $event.target.value.indexOf(sep) != -1) &&
        ($event.which < 48 || $event.which > 57)
      ) {
        $event.preventDefault();
      }
    },
    onFocus() {
      this.isMasked = false;
      this.updateModel();
    },

    onBlur() {
      if (this.$listeners.blur) this.$listeners.blur();

      this.isMasked = true;
      this.format();
    },

    onKeyUp() {
      this.updateNumberValue();
    },

    onChange(e) {
      if (this.$listeners.change) this.$listeners.change();
    },

    updateNumberValue() {
      let v = this.model;
      let parsed;

      v = v.replace(this.thousandsSeparatorRegex, "");
      if (this.decimalSeparator !== ".")
        v = v.replace(this.decimalSeparatorRegex, this.thousandsSeparator);

      const result = tryParseFloat(v);

      if (!result) parsed = this.init;
      else parsed = result;

      if (!this.allowNegative && result < 0) parsed = this.init;
      const exp = 10 ** this.decimalPoints;
      this.numberValue = Math.round(Number(parsed) * exp) / exp;
    },

    updateModel() {
      if (this.numberValue === null) return;

      let v = this.numberValue.toString();

      v = v.replace(this.thousandsSeparatorRegex, this.decimalSeparator);

      this.model = v;
    },

    format() {
      if (this.numberValue === null) return;

      let v = this.numberValue;

      v = v.toLocaleString(this.languageCode);
      if (this.permanentDecimal && this.decimalPoints) {
        if (v.indexOf(this.decimalSeparator) === -1) {
          v += this.decimalSeparator + "".padEnd(this.decimalPoints, "0");
        } else {
          v = String(v).padEnd(
            v.indexOf(this.decimalSeparator) + 1 + this.decimalPoints,
            "0"
          );
        }
      } else if (
        v.length !== 1 &&
        v.slice(v.indexOf(this.decimalSeparator) + 1).length > 0
      ) {
        v = String(v).padEnd(
          v.indexOf(this.decimalSeparator) + 1 + this.decimalPoints,
          "0"
        );
      }
      console.log("format", this.model, this.numberValue);

      this.model = v;
    }
  },

  watch: {
    numberValue(v) {
      this.$emit("input", v);
    },

    value(v) {
      this.numberValue = v;

      if (!this.$refs.field.isFocused) {
        this.format();
      }
    }
  },

  created() {
    this.format();
  }
};
</script>

<style lang="scss" scoped></style>
