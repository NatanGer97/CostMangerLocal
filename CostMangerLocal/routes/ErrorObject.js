// let errorObject = {
//   msg: 'err',
//   backLink:'',
//   backButtonText: 'Try again'
//
// }
class ErrorObject {

  constructor(msg = 'err', backLink, backButtonText = 'Try Again') {
    this.msg = msg;
    this.backLink = backLink;
    this.backButtonText = backButtonText;
  }
}
exports.ErrorObject = ErrorObject;
