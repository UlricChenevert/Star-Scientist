function function_test() {
    console.log("-----------------> Starting tests...");
    
    function check(a_function, value) {
        console.log(typeof(a_function));

        if (a_function.value != value) {
            console.log(`${a_function.name} does not return ${value}`)
        }
        
        console.log(`${a_function.name} returns ${value} successfully!`);
    }

    console.log("-----------------> Tests completed!");
};


function caching_decorator (func) {
    let cache = new Map();

    return function (...args) {
        let key = '';
        for (let value of args) {key += value + ','}
        
        if (cache.get(key)) {
            return cache.get(key);
        }

        let value = func.call(this, ...args);

        cache.set(key, value);
    }
}

function multiply(x, y) {return x*y;}

const decorated_multiply = caching_decorator(multiply);

console.log(decorated_multiply(5, 6));
console.log(decorated_multiply(5, 6));
console.log(decorated_multiply(1241, 2137));
console.log(decorated_multiply(5765, 125));
console.log(decorated_multiply(5, 6));
