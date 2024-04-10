function sumArray(arr) {
    let sum = 0;
    for(let i = 0; i < arr.length; i++)
        if (Array.isArray(arr[i]))
            sum += sumArray(arr[i]);
        else if(typeof arr[i] === 'number')
            sum += arr[i];

    
    return sum;
}

function useCoef(coef_arr , output_arr){
    const r = Math.floor(Math.random() * sumArray(coef_arr));

    let sum = 0;
    for(const coef in coef_arr){
        sum += coef_arr[coef];
        if(r < sum)
            return output_arr[coef];
    }
}