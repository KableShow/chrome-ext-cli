// document_start的时候还没有解析dom节点，所以此时是获取不到body，head等标签的
// 但是这个时刻是在所有js执行之前，可以保证js的环境还没被网站的js修改；
// 一般用于一些函数/对象的保存；接口的拦截等；
console.log('run at "document_start"', Date.now(), 'document.body is: ', document.body)
