/**
 * @description Web Woker demo
 * 不会阻塞主线程
 */
onmessage = function (message) {
    console.log(message.data);
    // while(true){
        postMessage(Math.random());
    // }
  }