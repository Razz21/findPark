import Vue from "vue";

Vue.filter("currency", value => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
});

Vue.filter("pluralize", (word, amount) =>
  amount > 1 || amount == 0 ? `${word}s` : word
);
