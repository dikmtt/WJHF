import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle } from "@ionic/react";
import React, { useState } from "react";
import Header from "../../../components/Header";
import axios from "axios";
import { useHistory } from "react-router";

const NewHotel: React.FC = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [hotelClass, setHotelClass] = useState(0);
    const [price, setPrice] = useState(0);
    const [hasWifi, setHasWifi] = useState(0);
    const [hasResto, setHasResto] = useState(0);
    const [hasPool, setHasPool] = useState(0);
    const [desc, setDesc] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [img, setImg] = useState<File>();

    const handleDescChange = (event: CustomEvent) => {
        setDesc(event.detail.value);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImg(event.target!.files![0]);
    }

    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = "/backend/newhotel.php";
    const history = useHistory();

    const submit = () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("class", hotelClass.toString());
        formData.append("price", price.toString());
        formData.append("hasWifi", hasWifi.toString());
        formData.append("hasResto", hasResto.toString());
        formData.append("hasPool", hasPool.toString());
        formData.append("description", desc);
        formData.append("lat", lat.toString());
        formData.append("lng", lng.toString());
        formData.append("image", img as File);
        console.log(formData);
        axios.post(url, formData).then((res) => {
            console.log(res.data);
        });
        history.goBack();
    }

    return(
        <IonPage>
            <Header />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonTitle className="pagetitle">Add New Hotel</IonTitle>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonRow>
                                <IonInput
                                    fill="outline"
                                    label="Name"
                                    labelPlacement="floating"
                                    className="newhotel-input"
                                    onIonChange={(e) => setName(e.detail.value!)}
                                ></IonInput>
                            </IonRow>
                            <IonRow>
                                <IonInput
                                    fill="outline"
                                    label="Address"
                                    labelPlacement="floating"
                                    className="newhotel-input"
                                    onIonChange={(e) => setAddress(e.detail.value!)}
                                ></IonInput>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonInput
                                        type="number"
                                        min="1"
                                        max="5"
                                        fill="outline"
                                        label="Class (1-5)"
                                        labelPlacement="floating"
                                        onIonChange={(e) => setHotelClass(parseInt(e.detail.value!))}
                                    ></IonInput>
                                </IonCol>
                                <IonCol>
                                    <IonInput
                                        type="number"
                                        fill="outline"
                                        label="Price"
                                        labelPlacement="floating"
                                        onIonChange={(e) => setPrice(parseInt(e.detail.value!))}
                                    ></IonInput>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonSelect
                                        interface="popover"
                                        placeholder="select"
                                        fill="outline"
                                        label="Wi-Fi?"
                                        labelPlacement="floating"
                                        onIonChange={(e) => setHasWifi(parseInt(e.detail.value!))}
                                    >
                                        <IonSelectOption value={0}>No</IonSelectOption>
                                        <IonSelectOption value={1}>Yes</IonSelectOption>
                                    </IonSelect>
                                </IonCol>
                                <IonCol>
                                    <IonSelect
                                        interface="popover"
                                        placeholder="select"
                                        fill="outline"
                                        label="Restaurant?"
                                        labelPlacement="floating"
                                        onIonChange={(e) => setHasResto(parseInt(e.detail.value!))}
                                    >
                                        <IonSelectOption value={0}>No</IonSelectOption>
                                        <IonSelectOption value={1}>Yes</IonSelectOption>
                                    </IonSelect>
                                </IonCol>
                                <IonCol>
                                    <IonSelect
                                        interface="popover"
                                        placeholder="select"
                                        fill="outline"
                                        label="Pool?"
                                        labelPlacement="floating"
                                        onIonChange={(e) => setHasPool(parseInt(e.detail.value!))}
                                    >
                                        <IonSelectOption value={0}>No</IonSelectOption>
                                        <IonSelectOption value={1}>Yes</IonSelectOption>
                                    </IonSelect>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonTextarea
                                    fill="outline"
                                    value={desc}
                                    onIonChange={handleDescChange}
                                    rows={3}
                                    label="Description"
                                    className="newhotel-input"
                                    labelPlacement="floating"
                                ></IonTextarea>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonInput
                                        type="number"
                                        fill="outline"
                                        label="Latitude"
                                        labelPlacement="floating"
                                        onIonChange={(e) => setLat(parseFloat(e.detail.value!))}
                                    ></IonInput>
                                </IonCol>
                                <IonCol>
                                    <IonInput
                                        type="number"
                                        fill="outline"
                                        label="Longitude"
                                        labelPlacement="floating"
                                        onIonChange={(e) => setLng(parseFloat(e.detail.value!))}
                                    ></IonInput>
                                </IonCol>
                            </IonRow>
                            <IonRow className="newhotel-imageinput">
                                <IonCol>
                                    <IonLabel className="newhotel-imagetext">Image:</IonLabel>
                                </IonCol>
                                <IonCol>
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </IonCol>
                            </IonRow>
                        </IonCol>
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

export default NewHotel;