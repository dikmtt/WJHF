import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonRadio, IonRadioGroup, IonRow, IonText, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { cafe, cash, fish, helpCircle, map, star, wifi } from "ionicons/icons";
import "./CriteriaPriorities.css";
import {ahpWeights} from "../../../components/ahpWeights";
import { useHistory } from "react-router";

const CriteriaPriorities: React.FC = () => {
    //0: class, 1: price, 2: haswifi, 3: hasresto, 4: haspool, 5: distance to dest
    const colNames = ["Class", "Price", "Has Wi-Fi", "Has Restaurant", "Has Pool", "Distance to Destination"];
    const icons = [star, cash, wifi, cafe, fish, map];
    const [pairwise, setPairwise] = useState([
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
    ]);
    const [chosenCrits, setChosenCrits] = useState([9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]);
    const [pairwiseVal, setPairwiseVal] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

    const [critPairs, setCritPairs] = useState([]);

    const [isLargeSize, setIsLargeSize] = useState(window.innerWidth > 1000);
    const updateSize = () => {
        setIsLargeSize(window.innerWidth > 1000);
    }
    useEffect(() => {
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMess, setToastMess] = useState("");
    const history = useHistory();

    useEffect(() => {
        const cols = [];
        colNames.forEach((firstColName, i) => {
            colNames.forEach((secondColName, j) => {
                if(j > i) {
                    cols.push([i, j]);
                }
            });
        });
        setCritPairs(cols);
    }, []);

    const chooseCriteria = (critName: number, idx: number, otherCrit: number) => {
        //when the button is clicked, update the chosenCrits array
        if(chosenCrits[idx] !== critName) {
            setChosenCrits((prev) => {
                return prev.map((crit, cIdx) => {
                    if(idx === cIdx) { return critName; }
                    return crit;
                });
            });
            //if the previous value is the opposite change the value
            if(pairwise[otherCrit][critName] > 1) {
                changeValue(critName, otherCrit, pairwise[otherCrit][critName]);
            }
            if(pairwise[critName][otherCrit] == 1) {
                setPairwiseVal((prev) => {
                    return prev.map((pv, pvI) => {
                        if(idx === pvI) { return 2; }
                        return pv;
                    })
                })
                changeValue(critName, otherCrit, 2);
            }
        //when the button is clicked while the chosen criteria is active,
        //then reset the values to 1
        } else if(chosenCrits[idx] === critName) {
            setChosenCrits((prev) => {
                return prev.map((crit, cIdx) => {
                    if(idx === cIdx) { return 9; }
                    return crit;
                });
            });
            updatePairwise(critName, otherCrit, idx, 1);
        }
    }

    const updatePairwise = (crit1: number, crit2: number, idx: number, val: any) => {
        //console.log("val: ", val == 1);
        setPairwiseVal((prev) => {
            return prev.map((pv, pvI) => {
                if(idx === pvI) { return val; }
                return pv;
            })
        })
        if(val == 1) {
            //console.log("run 1 here");
            setChosenCrits((prev) => {
                return prev.map((crit, cIdx) => {
                    if(idx === cIdx) { return 9; }
                    return crit;
                });
            });
            changeValue(crit1, crit2, val);
        } else {
            if(chosenCrits[idx] === crit1) {
                changeValue(crit1, crit2, val);
            } else if (chosenCrits[idx] === crit2) {
                changeValue(crit2, crit1, val);
            }
        }
    }

    const changeValue = (row: any, col: any, val: any) => {
        const valN = parseInt(val);
        setPairwise((prev) => {
            return prev.map((rw, rwIdx) => 
                rw.map((cl, clIdx) => {
                    //updates value for the cell to the chosen number
                    if(rwIdx === row && clIdx === col) {
                        return valN;
                    }
                    //updates value for the opposite cell to one divided by the number
                    if(rwIdx === col && clIdx == row) {
                        return Math.round((1 / valN) * 1000) / 1000;
                    }
                    return cl;
                })
                //rI === row ? r.map((c, cI) => (cI === col ? valN : c)) : r
            );
        });
    };

    //this will call the ahpWeights function
    const logMatrix = () => {
        console.log(pairwise);
        const yee = ahpWeights(pairwise);
        console.log(yee);
        if(yee === undefined) {
            setShowToast(true);
            setToastMess("Your inputs are not accepted because the results are deemed inconsistent. Please lower some values to proceed");
        } else {
            setShowToast(true);
            setToastMess("Your inputs are accepted because the results are deemed consistent. Moving on to the next step...");
            //put the weights in local storage
            localStorage.setItem("weights", JSON.stringify(yee));
            setTimeout(() => {history.push("/rec/preference")}, 3000);
        }
    }

    return(
        <IonPage>
            <Header />
            <IonContent>
                <IonGrid>
                    <IonCol>
                        <IonRow className="criteriapriority-title">
                            <IonCol size={isLargeSize ? "11" : "9"}>
                                <div 
                                    className="recsystems-title"
                                >
                                        Step 1: Determine Criteria Priority
                                </div>
                            </IonCol>
                            <IonCol className="ion-text-end">
                                <IonIcon 
                                    icon={helpCircle} 
                                    style={{fontSize: isLargeSize ? 40 : 30}}
                                    onClick={() => setModalOpen(true)}
                                />
                            </IonCol>
                        </IonRow>
                        <IonGrid>
                            <IonRow>
                                <IonCol className="tableCol">Which Criterion Is More Important?</IonCol>
                                <IonCol className="tableCol">By How Much? (1-9)</IonCol>
                            </IonRow>
                            {critPairs.map(([crit1, crit2], i) => (
                                    <IonRow key={i}>
                                        <IonCol className="tableCol">
                                            <div className="criteriapriority-selectcrits">
                                                <IonButton
                                                    className="criteriapriority-button"
                                                    onClick={() => chooseCriteria(crit1, i, crit2)}
                                                    color={chosenCrits[i] === 9 ? "warning" :
                                                        chosenCrits[i] === crit1 ? "success" : "danger"}
                                                >
                                                    <IonLabel>{colNames[crit1]}</IonLabel>
                                                </IonButton>
                                                <IonLabel className="criteriapriority-versus">vs.</IonLabel>
                                                <IonButton
                                                    className="criteriapriority-button"
                                                    onClick={() => chooseCriteria(crit2, i, crit1)}
                                                    color={chosenCrits[i] === 9 ? "warning" :
                                                        chosenCrits[i] === crit2 ? "success" : "danger"}
                                                >
                                                    <IonLabel>{colNames[crit2]}</IonLabel>
                                                </IonButton>
                                            </div>
                                        </IonCol>
                                        <IonCol className="tableCol">
                                            <IonInput 
                                                type="number"
                                                min={1}
                                                max={9}
                                                value={pairwiseVal[i]}
                                                onIonChange={(e) => updatePairwise(crit1, crit2, i, e.detail.value!)}
                                                disabled={chosenCrits[i] === 9 ? true : false}
                                            />
                                        </IonCol>
                                    </IonRow>
                                )
                            )}
                            </IonGrid>
                        {/*<IonGrid>
                            <IonRow>
                                <IonCol className="tableCol"></IonCol>
                                {colNames.map((name, idx) => (
                                    <IonCol key={idx} className="tableCol">
                                        {isLargeSize ? name : <IonIcon icon={icons[idx]} />}
                                    </IonCol>
                                ))}
                            </IonRow>
                            {pairwise.map((row, rowI) => (
                                <IonRow key={rowI}>
                                    <IonCol className="tableCol">
                                        {isLargeSize ? colNames[rowI] : <IonIcon icon={icons[rowI]} />}
                                    </IonCol>
                                    {row.map((cell, cellI) => (
                                        <IonCol key={cellI} className="tableCol">
                                            <IonInput 
                                                type="number"
                                                value={cell}
                                                disabled={rowI === cellI ? true : false}
                                                onIonChange={(e) => changeValue(rowI, cellI, e.detail.value!)}
                                            ></IonInput>
                                        </IonCol>
                                    ))}
                                </IonRow>
                            ))}
                        </IonGrid>*/}
                        <IonRow className="submitbutton">
                            <IonButton onClick={logMatrix}>
                                <IonLabel>Submit</IonLabel>
                            </IonButton>
                        </IonRow>
                    </IonCol>
                </IonGrid>
                <IonModal isOpen={modalOpen}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Help</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setModalOpen(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <p>
                            There are two steps in the recommendation system. The first step is to determine
                            the priority between each pair of criteria, and the second is to determine the
                            user's preference in hotels.
                        </p>

                        <p>
                            In the first step, there are a list of each criteria pairs. Your task here is
                            to pick which one of the two criteria has a higher priority. This is done by
                            selecting the button for the criterion that you think is more important than
                            the other. Alongside is a number input, where you can also determine how much
                            each criteria is prioritized over the other, with a value of 1 to 9. A value
                            of 1 indicates that both criteria have the same priority, while a value of 9
                            indicates that the chosen criteria is massively prioritized over the other.
                            The selected criterion that will be of better importance will then be colored
                            green, whilst the other criterion for each pair will be colored red.
                        </p>

                        <p>
                            If you wish that for one pair, both criteria have the same priority, then
                            you can opt to not choose either criteria for that pair. Both buttons will
                            be colored yellow, and the value will be 1 by default.
                        </p>

                        <p>
                            When you are finished, click the Submit button, and the system will create
                            a matrix based on your choices and verify the
                            consistency of the matrix. If it is deemed consistent, the system will move on
                            to Step 2, where you will choose the criteria preferences. If not, try again
                            until you get a consistent matrix. Tip: try to balance out the numbers in the
                            matrix, such as having many smaller valued numbers, in order to make a 
                            consistent matrix. If the matrix is consistent, then it will be transformed into 
                            the "weights" of the criteria, to determine how much the criteria will be
                            calculated when determining the best hotel, with a higher weight signifying higher 
                            importance.
                        </p>

                        <p>
                            Make sure you have a destination in mind, as the distance from each hotel to your
                            chosen destination matters for the hotel recommendation! This will be inputted in
                            the next step.
                        </p>
                    </IonContent>
                </IonModal>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMess}
                    duration={3000}
                />
            </IonContent>
        </IonPage>
    );
};

export default CriteriaPriorities;