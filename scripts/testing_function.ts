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

        return value;
    }
}

//function multiply(x, y) {return x*y;}

//const decorated_multiply = caching_decorator(multiply);

// console.log(decorated_multiply(5, 6));
// console.log(decorated_multiply(5, 6));
// console.log(decorated_multiply(1241, 2137));
// console.log(decorated_multiply(5765, 125));
// console.log(decorated_multiply(5, 6));

function set_cookie(key, value, age=86400) {
    document.cookie = `${key}=${value}; max-age=${age}`;
}

function get_cookie (key : string, only_value=true) {
    const key_length = key.length;

    const cookie_jar = document.cookie;

    const base_index = cookie_jar.indexOf(' ' + key);
    const end_index = cookie_jar.indexOf('; ', base_index);

    const values = cookie_jar.slice(base_index+key_length+2, end_index);

    return only_value? values.split(' ')[0] : values;
}

set_cookie('john', '');
set_cookie('yen', '');
set_cookie('z', '');
set_cookie('aa', '');

console.log(document.cookie);

console.log(get_cookie('asdasfafgagegewasfasfd'));