export default function generateTitle(title, route) {
  let titleStr = "";
  Object.keys(route).forEach(val => {
    if (val === title) {
      titleStr = route[val];
    }
  });
  return titleStr;
}
