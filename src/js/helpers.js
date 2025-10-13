function findByFilter(arr, filter) {
  return arr.filter((item) => {
    return Object.entries(filter).every(([key, value]) => item[key] === value);
  });
}

export { findByFilter };
