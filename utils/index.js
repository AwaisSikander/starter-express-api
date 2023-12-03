function getSubObject(obj = {}, arr = []) {
  const newObj = {};
  arr.forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj;
}

function removeEmptyProperties(obj) {
  for (const property in obj) {
    if (
      obj[property] === null ||
      obj[property] === undefined ||
      obj[property] === ""
    ) {
      delete obj[property];
    } else if (typeof obj[property] === "object") {
      removeEmptyProperties(obj[property]);
    }
  }
  return obj;
}

module.exports = { getSubObject, removeEmptyProperties };
