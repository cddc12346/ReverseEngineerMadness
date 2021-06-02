# Use-After-Free in Promise object??


# Identify patch 

We noticed that IsJSPromiseMap(thenableMap) is removed 
--> No checks on the map of the thenable object

# Questions/Challenges
1) How to add print messages and compile v8 so that you know where your things are hit?
	- Googling Setting breakpoint on builtins function led me to:
	https://v8.dev/docs/csa-builtins and looking at src/builtins/definition.h
	- We can set breakpoints on builtsin by doing so:
```
br Builtins_PromiseConstructor
br Builtins_PerformPromiseThen
br Builtins_PromiseResolveThenableJob



```
2) PromiseResolveThenableJob takes in 4 arguments
- promiseToResolve: JSPromise
- thenable: JSReceiver
- then: JSAny

2A) What is a thenable?
	- From comments, Thenable is a JSPromise
	- {then} corresponds to the initial Promise.prototype.then

2B) What is JSPromise? 


3) Trying to hit the branch 
if (TaggedEqual(then, promiseThen) &&
      !IsPromiseHookEnabledOrDebugIsActiveOrHasAsyncEventDelegate())
	  
Check if then and promiseThen are equal 

With this code below, I am able to break into Builtins_PromiseResolveThenableJob but unable to satisfy the TaggedEqual branch 
```
let thenable = {
    then(resolve) {
        setTimeout(()=>{
            resolve((()=>{
                console.log('test');
                %DebugPrint(thenable);
                return thenable;
            })());
        }, 3000);
    },
};

console.log("any changes");
let p1 = Promise.resolve(thenable);
let array = [1.1,1.2];
thenable = array;

%DebugPrint(thenable);
console.log(array);
console.log(p1);
```
	


4) What does PerformPromiseThen do?
	- In promise-abstract-operations.tq, we find a definition to PerformPromiseThen
	- PerformPromiseThen calls PerformPromiseThenImpl
```
Doesn't check thenable map --> PerformPromiseThen --> PerformPromiseThenImpl

From the patch:
PerformPromiseThen(
        UnsafeCast<JSPromise>(thenable), UndefinedConstant(),
        UndefinedConstant(), promiseToResolve)

//From my guess, PerformPromiseThen takes in a promise. 
//On fulfilled, it does a callback.
PerformPromiseThen(implicit context: Context)(
    promise: JSPromise, onFulfilled: Callable|Undefined,
    onRejected: Callable|Undefined, resultPromise: JSPromise|Undefined): JSAny {
  PerformPromiseThenImpl(promise, onFulfilled, onRejected, resultPromise);
  return resultPromise;
}

```



# Useful commands for Docker
```
docker run -t -d --name test v8_builder
docker cp promise-jobs.tq 30e6e2a0675b:/tmp
docker exec -it test bash 
docker cp 30e6e2a0675b:/home/builder/v8/v8/out/turboflan/d8 out/modifiedD8

Adding DebugBreak() to the tq file then recompiling it to see if it hits



```




