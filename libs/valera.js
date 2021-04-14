function proceed(ans, err, res) {
  if (err != undefined) {
    console.log(err);
    ans.status.error = err;
    ans.status.success = false;
  } else {
    ans.status.success = true;
  }

  if (res != undefined) {
    ans.data = res;
  }
}

module.exports.proceed = proceed;
