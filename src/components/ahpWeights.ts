export const ahpWeights = (matrix: number[][]) => {
    //test the function
    console.log("AHP Weight Calculation");
    //console.log(matrix);

    //get the sums of the columns
    var colSum = (r, a) => r.map((b, i) => a[i] +  b);
    var colSumFirst = matrix.reduce(colSum);
    console.log("Sum of column values: ", colSumFirst);

    //normalize the pairwise comparison matrix
    var matrixNorm = Array(6).fill(1).map(()=>Array(6).fill(1));
    matrix.map((rw, rwIdx) => 
        rw.map((cl, clIdx) => {
            var n = cl / colSumFirst[clIdx];
            matrixNorm[rwIdx][clIdx] = n;
        }));
    console.log("Normalized matrix: ", matrixNorm);

    //find the initial weights
    //var rowSum = (mat) => mat.map((y) => y.reduce((a, b) => a + b));
    var rowSum = matrixNorm.map((y) => y.reduce((a, b) => a + b));

    var initWeights = Array(6).fill(1);
    rowSum.map((val, idx) => {
        var n = val / 6;
        initWeights[idx] = n;
    })
    console.log("Initial weights: ", initWeights);

    console.log("Consistency Test");
    //1. multiply the weight value with the field value then find
    var matrixNormWeighted = Array(6).fill(1).map(()=>Array(6).fill(1));
    matrix.map((rw, rwIdx) => 
        rw.map((cl, clIdx) => {
            var n = cl * initWeights[clIdx];
            matrixNormWeighted[rwIdx][clIdx] = n;
        }));
    console.log("Normalized weighted matrix: ", matrixNormWeighted);
    var Ax = matrixNormWeighted.map((y) => y.reduce((a, b) => a + b));
    console.log("Ax: ", Ax);

    //Divide the Ax values with the corresponding weight in the same index
    //Then find the lambda by averaging the values
    var lambdMat = Array(6).fill(1);
    Ax.map((val, idx) => {
        var n = val / initWeights[idx];
        lambdMat[idx] = n;
    });
    var lambda = lambdMat.reduce((a, b) => a + b) / lambdMat.length;
    console.log("Lambda: ", lambda);

    //Find the consistency index and ratio
    var ci = (lambda - 6) / (6 - 1);
    console.log("Consistency Index: ", ci);

    //there are 6 criteria so the random index is 1.24
    var cr = ci / 1.24;
    console.log("Consistency Ratio: ", cr);

    //check if cr < 0.1
    var isConsistent = cr < 0.1;
    if(isConsistent) {
        console.log("The matrix is consistent, returning weights");
        return initWeights;
    } else {
        console.log("The matrix is inconsistent, please try again");
        return;
    }
};