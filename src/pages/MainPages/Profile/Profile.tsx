import { IonAvatar, IonButton, IonButtons, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonPage, IonRow, IonSegment, IonSegmentButton, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { AuthContext, Hotel } from "../../../components/context/AuthContext";
import axios from "axios";
import "./Profile.css";
import ReviewItem from "../../../components/ReviewItem";
import { Review } from "../HotelList/HotelDetails";
import HotelItem from "../../../components/HotelItem";
import ProfileSegment from "./ProfileSegment";

const Profile: React.FC = () => {
    const authCtx = useContext(AuthContext);
    const [currSegment, setCurrSegment] = useState("Reviews");

    const [modalOpen, setModalOpen] = useState(false);
    const [newUsername, setNewUsername] = useState<string>(authCtx?.user.username as string);
    const [newBio, setNewBio] = useState<string>(authCtx?.user.bio as string);
    const [newProfilePic, setNewProfilePic] = useState<File>();
    const changeProfilePic = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewProfilePic(event.target!.files![0]);
    }

    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const urledit = "/backend/updateuser.php";
    const submit = () => {
        const formdata = new FormData();
        var newpptoupdate = "";
        formdata.append("user_id", authCtx?.user.id.toString() as string);
        formdata.append("username", newUsername);
        formdata.append("bio", newBio);
        if(newProfilePic === undefined) {
            formdata.append("oldpp", authCtx?.user.profile_pic as string);
            newpptoupdate = authCtx?.user.profile_pic!;
        } else {
            formdata.append("profile_pic", newProfilePic as File);
            newpptoupdate = "uploads/profile_pics/" + newProfilePic?.name!;
        }
        //console.log(formdata);
        axios.post(urledit, formdata).then((res) => {
            console.log(res);
        });
        authCtx?.updateUser(
            newUsername,
            newBio,
            newpptoupdate
        );
        setModalOpen(false);
    }

    const [revDetails, setRevDetails] = useState<Array<Review>>([]);
    const [hotelDetails, setHotelDetails] = useState<Array<Hotel>>([]);
    const urldetails = "/backend/getuserdetails.php";
    const getRecFavOrReview = () => {
        const formdata = new FormData();
        formdata.append("userId", authCtx?.user.id.toString() as string);
        formdata.append("type", currSegment);
        axios.post(urldetails, formdata).then((res) => {
            console.log(res.data);
            if(currSegment === "Reviews") {
                setRevDetails(res.data.resp_data);
            } else {
                setHotelDetails(res.data.resp_data);
            }
        });
    }

    useEffect(() => {
        getRecFavOrReview();
    }, [currSegment]);
    return(
        <IonPage>
            <IonHeader>
                <Header />
                <IonGrid className="center-grid">
                    <IonRow>
                        <IonCol class="centeredcols-prof">

                                <img
                                    alt="Profile Picture"
                                    src={`/backend/${authCtx?.user.profile_pic}`} 
                                    className="pp-prof w-28 h-28 rounded-full"
                                />

                        </IonCol>
                        <IonCol>
                            <IonCardHeader>
                                <IonCardTitle>
                                    {authCtx?.user.username}
                                </IonCardTitle>
                                <IonCardSubtitle className="bio-items">
                                    {authCtx?.user.email} - Joined on {authCtx?.user.date_created}
                                </IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonLabel className="bio-items">
                                    {authCtx?.user.bio}
                                </IonLabel>
                            </IonCardContent>
                        </IonCol>
                        <IonCol class="centeredcols-prof">
                            <IonButton onClick={() => setModalOpen(true)} fill="clear" color={"secondary"}>
                                <IonLabel>Edit Profile</IonLabel>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                {/* Segment for recent comments and favorite hotels */}
            </IonHeader>
            <IonSegment
                value={currSegment}
                onIonChange={(e) => setCurrSegment(e.detail.value as string)}
                color={"secondary"}
            >
                <IonSegmentButton value="Reviews">
                    <IonLabel>Recent Reviews</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="Favs">
                    <IonLabel>Favorite Hotels</IonLabel>
                </IonSegmentButton>
                {authCtx?.user.is_admin == 0 && (
                    <IonSegmentButton value="Recs">
                        <IonLabel>My Recommendations</IonLabel>
                    </IonSegmentButton>
                )}
            </IonSegment>
            <IonContent>
                <ProfileSegment reviews={revDetails} hotels={hotelDetails} currSegment={currSegment} />
                <IonModal isOpen={modalOpen}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Edit Profile</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setModalOpen(false)}>Cancel</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonRow>
                                        <IonInput 
                                            fill="outline"
                                            label="Username"
                                            labelPlacement="floating"
                                            className="newhotel-input"
                                            value={newUsername}
                                            onIonChange={(e) => setNewUsername(e.detail.value!)}
                                        />
                                    </IonRow>
                                    <IonRow>
                                        <IonTextarea 
                                            fill="outline"
                                            label="Bio"
                                            labelPlacement="floating"
                                            className="newhotel-input"
                                            value={newBio}
                                            onIonChange={(e) => setNewBio(e.detail.value!)}
                                            rows={3}
                                        />
                                    </IonRow>
                                    <IonRow className="newhotel-imageinput">
                                        <IonCol>
                                            <IonLabel className="newhotel-imagetext">Profile Picture:</IonLabel>
                                        </IonCol>
                                        <IonCol>
                                            <input 
                                                type="file"
                                                accept="image/*"
                                                onChange={changeProfilePic}
                                            />
                                        </IonCol>
                                    </IonRow>
                                    <IonRow class="submitbutton">
                                        <IonButton onClick={submit}>
                                            <IonLabel>Submit</IonLabel>
                                        </IonButton>
                                    </IonRow>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
}

export default Profile;