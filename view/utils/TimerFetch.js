// TimerFetch.js
const delay = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'))
    }, ms)
  })
} 
const TimerFetch={
  fetchWithTimeout (timeout, ...args) {
    return Promise.race([fetch(...args), delay(timeout)])
  }
}
module.exports=TimerFetch