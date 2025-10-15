function isMatch(item, filter) {
  return Object.entries(filter).every(([key, value]) => item[key] === value);
}
function filterBy(arr, filter) {
  return arr.filter((item) => isMatch(item, filter));
}
function filterOutBy(arr, filter) {
  return arr.filter((item) => !isMatch(item, filter));
}
export { filterBy, filterOutBy };
