export const set = key => (state, val) => {
  state[key] = val;
};
export const get = key => state => {
  return state[key];
};

export const timeout = (duration = 1000) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};
