function findMinimumCol(matrix: number[][], hotels: number) {
    var mins = Array(6).fill(1);
    for(let i = 0; i < 6; i++) {
        //minimum is first
        let min = matrix[0][i];

        //inner loop for cols
        for(let j = 1; j < hotels; j++) {
            //if column element is smaller replace
            if(matrix[j][i] < min) {
                min = matrix[j][i];
            }
        }
        mins[i] = min;
    }
    return mins;
}

function findMaximumCol(matrix: number[][], hotels: number) {
    var maxes = Array(6).fill(1);
    for(let i = 0; i < 6; i++) {
        //minimum is first
        let max = matrix[0][i];

        //inner loop for cols
        for(let j = 1; j < hotels; j++) {
            //if column element is smaller replace
            if(matrix[j][i] > max) {
                max = matrix[j][i];
            }
        }
        maxes[i] = max;
    }
    return maxes;
}

export const wpmMethod = (weights: number[], hotelData: number[][], benOrCost: number[]) => {
    //debug
    console.log("Weights: ", weights);
    console.log("Hotel Data: ", hotelData);
    console.log("Benefit or Cost: ", benOrCost);

    console.log("WPM Calculation");

    //There are six columns, and rows as many as there are hotels in the db

    //Normalize matrix. Determine if column is benefit or cost
    //first find the minimum and maximum values of each column
    const mins = findMinimumCol(hotelData, hotelData.length);
    const maxes = findMaximumCol(hotelData, hotelData.length);
    
    //Now normalize the matrix
    var matrixNorm = Array(hotelData.length).fill(1).map(()=>Array(6).fill(1));
    hotelData.map((rw, rwIdx) =>
        rw.map((cl, clIdx) => {
            //cost
            if(benOrCost[clIdx] === 0) {
                matrixNorm[rwIdx][clIdx] = mins[clIdx] / cl;
            } else {
                //benefit
                matrixNorm[rwIdx][clIdx] = cl / maxes[clIdx];
            }
        }));
    console.log("Normalized matrix: ", matrixNorm);

    //Now power with the weights
    var matrixPow = Array(hotelData.length).fill(1).map(()=>Array(6).fill(1));
    matrixNorm.map((rw, rwIdx) =>
        rw.map((cl, clIdx) => {
            matrixPow[rwIdx][clIdx] = Math.pow(cl, weights[clIdx]);
        }));
    console.log("Powered to weight: ", matrixPow);

    //Finally multiply all the values in the same row
    var finalValues = matrixPow.map(r => r.reduce((a, b) => a * b));
    console.log("Final values: ", finalValues);

    //return the index of the hotel with the highest value
    var maxNum = Math.max.apply(Math, finalValues)
    console.log("Highest value: ", maxNum);
    var bestHotelId = finalValues.indexOf(maxNum);
    console.log("Best hotel index: ", bestHotelId);

    var finalValuesSorted = [...finalValues].sort((a, b) => a - b).reverse();
    var top5Values = finalValuesSorted.slice(0, 5);
    console.log("top 5 values: ", top5Values);

    var bestHotelIndexes = Array();
    top5Values.forEach(val => {
        const num = finalValues.indexOf(val)
        bestHotelIndexes.push(num);
    });
    console.log("bestHotelIndexes: ", bestHotelIndexes);

    return bestHotelIndexes;

};