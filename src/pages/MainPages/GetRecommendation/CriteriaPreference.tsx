import { IonButton, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, useIonViewWillEnter } from "@ionic/react";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { Dest } from "../../../components/context/AuthContext";
import axios from "axios";
import { wpmMethod } from "../../../components/wpmMethod";
import { useHistory } from "react-router";

const CriteriaPreference: React.FC = () => {
    //in these ion selects, 1 represent benefits and 0 represent costs
    //the "distance" column is always a cost as it prioritizes lower values (closer distances)
    const [benorCost, setBenOrCost] = useState([0, 0, 0, 0, 0, 0]);
    const [chosenDestId, setChosenDestId] = useState(0);

    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = "/backend/getdestinations.php";
    const [dests, setDests] = useState<Array<Dest>>([]);

    const getData = () => {
        axios.get(url).then((res) => {
            setDests(res.data.dest);
        })
    }
    useEffect(() => {
        getData();
    }, []);
    
    useIonViewWillEnter(() => {
        getData();
    });

    const changeBorCData = (pos, value) => {
        setBenOrCost((prev) => {
            return prev.map((val, idx) => {
                if(idx === pos) {
                    return value;
                }
                return val;
            })
        });
    }

    const submiturl = "/backend/wpmhotels.php";
    const [wpmHotels, setWpmHotels] = useState();
    const [hotelIdName, setHotelIdName] = useState();

    const history = useHistory();
    const submit = () => {
        console.log(benorCost);
        console.log(chosenDestId);
        const formdata = new FormData();
        formdata.append("benOrCost", JSON.stringify(benorCost));
        formdata.append("destId", chosenDestId.toString());
        axios.post(submiturl, formdata).then((res) => {
            //console.log(res.data);
            setWpmHotels(res.data.wpmHotels);
            setHotelIdName(res.data.idAndName);
            findHotel(res.data.wpmHotels, res.data.idAndName);
        });
    }
    const findHotel = (hotelsNumeric, hotelsIDName) => {
        if(hotelsNumeric !== undefined) {
            //change to array of arrays
            var wpmHotelsAoA = hotelsNumeric.map(Object.values);
            console.log(wpmHotelsAoA);
            //then calculate!
            const weights = localStorage.getItem("weights");
            if(weights) {
                const bestHotels = wpmMethod(JSON.parse(weights), wpmHotelsAoA, benorCost);

                var bestHotelsName = Array();
                bestHotels.forEach(hIdx => {
                    bestHotelsName.push(hotelsIDName[hIdx]);
                });
                console.log("Top 5 hotels: ", bestHotelsName);

                const bestHotelsNew = Array();
                bestHotelsName.forEach(hotel => {
                    bestHotelsNew.push(hotel.id);
                });
                //console.log(bestHotelsNew);
                //localStorage.setItem("bestHotelId", be)
                //with the best hotel move to the recommendation page, save to history and delete weights item
                //console.log("JSON best hotels: ", JSON.stringify(bestHotelsNew));
                history.push({
                    pathname: '/rec/result',
                    state: {bestHotelList: JSON.stringify(bestHotelsNew)},
                });
            }
        }
    }

    const [isLargeSize, setIsLargeSize] = useState(window.innerWidth > 1000);
        const updateSize = () => {
            setIsLargeSize(window.innerWidth > 1000);
        }
        useEffect(() => {
            window.addEventListener("resize", updateSize);
            return () => window.removeEventListener("resize", updateSize);
        });

    const selectLabel = (label: string) => {
        if(!isLargeSize) {
            return {
                header: label
            };
        }
        return {};
    };

    return(
        <IonPage>
            <Header />
            <IonContent>
                <IonGrid>
                    <IonCol>
                        <IonRow className="criteriapriority-title">
                            <div
                                className="recsystems-title"
                            >
                                Step 2: Determine Criteria Preferences
                            </div>
                        </IonRow>
                    </IonCol>
                    <IonRow>
                        <IonCol>
                            <IonLabel>Class Type:</IonLabel>
                            <IonSelect
                                interface={isLargeSize ? "popover" : "alert"}
                                interfaceOptions={selectLabel("Class Type")}
                                placeholder="Class"
                                fill="outline"
                                onIonChange={(e) => changeBorCData(0, e.detail.value!)}
                            >
                                <IonSelectOption value={0}>Prioritize Budget Hotels</IonSelectOption>
                                <IonSelectOption value={1}>Prioritize Higher Class Hotels</IonSelectOption>
                            </IonSelect>
                        </IonCol>
                        <IonCol>
                        <IonLabel>Price:</IonLabel>
                            <IonSelect
                                interface={isLargeSize ? "popover" : "alert"}
                                interfaceOptions={selectLabel("Price")}
                                placeholder="Price"
                                fill="outline"
                                onIonChange={(e) => changeBorCData(1, e.detail.value!)}
                            >
                                <IonSelectOption value={1}>Any Price</IonSelectOption>
                                <IonSelectOption value={0}>Prioritize Cheaper Hotels</IonSelectOption>
                            </IonSelect>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonLabel>Wi-Fi:</IonLabel>
                            <IonSelect
                                interface={isLargeSize ? "popover" : "alert"}
                                interfaceOptions={selectLabel("Needs Wi-Fi")}
                                placeholder="Y/N"
                                fill="outline"
                                onIonChange={(e) => changeBorCData(2, e.detail.value!)}
                            >
                                <IonSelectOption value={1}>Needed</IonSelectOption>
                                <IonSelectOption value={0}>Not Necessary</IonSelectOption>
                            </IonSelect>
                        </IonCol>
                        <IonCol>
                            <IonLabel>Restaurant:</IonLabel>
                            <IonSelect
                                interface={isLargeSize ? "popover" : "alert"}
                                interfaceOptions={selectLabel("Needs Restaurant")}
                                placeholder="Y/N"
                                fill="outline"
                                onIonChange={(e) => changeBorCData(3, e.detail.value!)}
                            >
                                <IonSelectOption value={1}>Needed</IonSelectOption>
                                <IonSelectOption value={0}>Not Necessary</IonSelectOption>
                            </IonSelect>
                        </IonCol>
                        <IonCol>
                            <IonLabel>Pool:</IonLabel>
                            <IonSelect
                                interface={isLargeSize ? "popover" : "alert"}
                                interfaceOptions={selectLabel("Needs Pool")}
                                placeholder="Y/N"
                                fill="outline"
                                onIonChange={(e) => changeBorCData(4, e.detail.value!)}
                            >
                                <IonSelectOption value={1}>Needed</IonSelectOption>
                                <IonSelectOption value={0}>Not Necessary</IonSelectOption>
                            </IonSelect>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonLabel>Desired Destination:</IonLabel>
                        <IonSelect
                            interface={isLargeSize ? "popover" : "alert"}
                            interfaceOptions={selectLabel("Desired Destination")}
                            placeholder="Choose Destination"
                            fill="outline"
                            onIonChange={(e) => setChosenDestId(e.detail.value!)}
                        >
                            {dests.map((dest, idx) => (
                                <IonSelectOption value={dest.id}>{dest.name}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonRow>
                    <IonRow className="submitbutton">
                        <IonButton onClick={submit}>
                            <IonLabel>Submit</IonLabel>
                        </IonButton>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default CriteriaPreference;