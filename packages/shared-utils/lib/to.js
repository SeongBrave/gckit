exports.to = async function (promise) {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
}
