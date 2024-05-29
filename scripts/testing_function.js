function function_test() {
    console.log("-----------------> Starting tests...");
    
    function check(a_function, value) {
        console.log(typeof(a_function));

        if (a_function() != value) {
            console.log(`${a_function.name} does not return ${value}`)
        }
        
        console.log(`${a_function.name} returns ${value} sucessfully!`);
    }
    let test_star = {spectral_type:"B"};

    check(basic_info(test_star), "10000");

    console.log("-----------------> Tests completed!");
};