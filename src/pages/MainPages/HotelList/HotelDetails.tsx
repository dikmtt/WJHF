import { IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useParams } from "react-router";
import axios from "axios";
import { AuthContext, Hotel } from "../../../components/context/AuthContext";
import { cafeOutline, fastFood, fastFoodOutline, fishOutline, heart, heartOutline, star, wifi } from "ionicons/icons";
import "./HotelDetails.css";
import ReviewItem from "../../../components/ReviewItem";

export interface Review {
    username: string;
    profile_pic: string;
    comment: string;
    rating: number;
    date: string;
    hotel_name: string | null;
}

const HotelDetails: React.FC = () => {
    const hotelId = useParams<{hotelId: string}>().hotelId;
    const authCtx = useContext(AuthContext);

    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const url = "/backend/getsinglehotel.php";
    const getreviewurl = "/backend/gethotelreviews.php";
    const favurl = "/backend/setfavorite.php";
    const urlreview = "/backend/postreview.php";

    const [hotel, setHotel] = useState<Hotel>();
    const [reviews, setReviews] = useState<Array<Review>>();
    const [avgRating, setAvgRating] = useState(0);
    const [isFavorited, setIsFavorited] = useState<boolean | null>(null);
    const [favs, setFavs] = useState(0);

    const getData = () => {
        const formdata = new FormData();
        formdata.append("hotelId", hotelId as string);
        //formdata.append("userId", authCtx?.user.id.toString() as string);
        axios.post(url, formdata).then((res) => {
            setHotel(res.data.post);
        })
    }

    const getReviews = () => {
        const formdata = new FormData();
        formdata.append("hotelId", hotelId as string);
        formdata.append("userId", authCtx?.user.id.toString() as string);
        axios.post(getreviewurl, formdata).then((res) => {
            console.log(res.data);
            setReviews(res.data.reviews);
            setAvgRating(res.data.avg_rating);
        })
    }

    useEffect(() => {
        /*const formdata = new FormData();
        formdata.append("hotelId", hotelId as string);
        axios.post(url, formdata).then((res) => {
            setHotel(res.data.post);
        })*/
       getData();
       getReviews();
    }, []);

    useIonViewWillEnter(() => {
        getData();
        getReviews();
        console.log("IonViewWillEnter");
    });

    useEffect(() => {
        const formdata = new FormData();
        formdata.append("user_id", authCtx?.user.id.toString() as string);
        formdata.append("hotel_id", hotelId as string);
        formdata.append("type", "check");
        axios.post(favurl, formdata).then((res) => {
            //console.log(res.data);
            //console.log(res.data.isFav === 1);
            setIsFavorited(res.data.isFav === 1);
            setFavs(res.data.totalFavs);
        });
    }, [isFavorited]);

    const favHandler = () => {
        const formdata = new FormData();
        formdata.append("user_id", authCtx?.user.id.toString() as string);
        formdata.append("hotel_id", hotelId as string);
        formdata.append("type", isFavorited ? "unfav" : "fav");
        axios.post(favurl, formdata).then((res) => {
            if(res.data.success) {
                //console.log(res.data);
                setIsFavorited(res.data.isFav === 1);
                setFavs((prev) => prev + (res.data.isFav === 1 ? 1 : -1));
            }
        });
    }

    const submitReview = () => {
        setModalOpen(false);
        const formData = new FormData();
        formData.append("user_id", authCtx?.user.id.toString() as string);
        formData.append("hotel_id", hotelId.toString());
        formData.append("comment", reviewComment);
        formData.append("rating", reviewRating.toString());
        //console.log(formData);
        axios.post(urlreview, formData).then((res) => {
            console.log(res.data);
            getReviews();
        });
    }

    const [modalOpen, setModalOpen] = useState(false);

    const [reviewComment, setReviewComment] = useState("");
    const [reviewRating, setReviewRating] = useState(0);

    return(
        <IonPage>
            <Header />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol className="hoteldetails-imgcol">
                            <img
                                src={`/backend/${hotel?.image}`}
                                className="hoteldetails-img"
                            />
                        </IonCol>
                        <IonCol>
                            <IonCardHeader className="hoteldetails-detailscol">
                                <IonCardTitle>
                                    <IonText className="hoteldetails-title">{hotel?.name}</IonText>
                                </IonCardTitle>
                                <IonCardTitle>
                                    {Array(hotel?.class).fill("e").map((_, idx) => (
                                        <IonIcon icon={star} key={idx} className="hoteldetails-class" color="warning"/>
                                    ))}
                                </IonCardTitle>
                                <IonCardSubtitle class="hoteldetails-address">
                                    <IonText>{hotel?.address}</IonText>
                                </IonCardSubtitle>
                                <IonCardTitle>
                                    <IonText className="hoteldetails-price">Price: {hotel?.price.toLocaleString()}*</IonText>
                                </IonCardTitle>
                                <IonCardSubtitle>
                                    <IonText className="hoteldetails-pricedetails">Standard price for 2 days, 1 night, and 2 adult guests. Prices may vary on different sites.</IonText>
                                </IonCardSubtitle>
                                <IonCardTitle>
                                    <IonRow>
                                        <IonCol>
                                            <IonRow className="facilities-col">
                                                <IonIcon 
                                                    icon={wifi} 
                                                    color={hotel?.hasWifi ? "success" : "danger"} 
                                                    className="hoteldetails-facilities"
                                                />
                                            </IonRow>
                                            <IonRow className="facilities-col">
                                                <IonText>{hotel?.hasWifi ? "Wi-Fi" : "No Wi-Fi"}</IonText>
                                            </IonRow>
                                        </IonCol>
                                        <IonCol>
                                            <IonRow className="facilities-col">
                                                <IonIcon 
                                                    icon={cafeOutline} 
                                                    color={hotel?.hasResto ? "success" : "danger"} 
                                                    className="hoteldetails-facilities"
                                                />
                                            </IonRow>
                                            <IonRow className="facilities-col">
                                                <IonText>{hotel?.hasResto ? "Restaurant" : "No Restaurant"}</IonText>
                                            </IonRow>
                                        </IonCol>
                                        <IonCol>
                                            <IonRow className="facilities-col">
                                                <IonIcon 
                                                    icon={fishOutline} 
                                                    color={hotel?.hasPool ? "success" : "danger"} 
                                                    className="hoteldetails-facilities"
                                                />
                                            </IonRow>
                                            <IonRow className="facilities-col">
                                                <IonText>{hotel?.hasPool ? "Pool" : "No Pool"}</IonText>
                                            </IonRow>
                                        </IonCol>
                                    </IonRow>
                                </IonCardTitle>
                                <IonCardTitle>
                                    <IonRow>
                                        <IonCol className="hoteldetails-favcontainer">
                                            <IonText className="hoteldetails-avg1">Average user rating: </IonText>
                                            <IonText className="hoteldetails-avg2">
                                                {avgRating}
                                            </IonText>
                                            <IonText className="hoteldetails-avg3">/5</IonText>
                                            <IonIcon icon={star} color="success" className="hoteldetails-avg4" />
                                        </IonCol>
                                        <IonCol className="hoteldetails-favcontainer">
                                            <IonButton 
                                                fill="clear" 
                                                color="danger" 
                                                className="hoteldetails-like1"
                                                onClick={favHandler}
                                            >
                                                <IonIcon 
                                                    icon={isFavorited ? heart : heartOutline} 
                                                    slot="icon-only" />
                                            </IonButton>
                                            <IonText className="hoteldetails-like2">{favs} fav{favs === 1 ? '' : 's'}</IonText>
                                        </IonCol>
                                    </IonRow>
                                </IonCardTitle>
                            </IonCardHeader>
                        </IonCol>
                    </IonRow>
                    <hr/>
                    <IonRow>
                        <IonCardContent>
                            <fieldset className="hoteldetails-descbox">
                                <legend className="hoteldetails-abouthotel">About Hotel:</legend>
                                <IonText className="hoteldetails-desc">{hotel?.desc}</IonText>
                            </fieldset>
                        </IonCardContent>
                    </IonRow>
                    <hr/>
                    <IonRow>
                        <IonRow>
                            <IonTitle style={{fontWeight: "bold"}}>Reviews</IonTitle>
                            <IonButton onClick={() => setModalOpen(true)}>
                                <IonLabel>Add New Review</IonLabel>
                            </IonButton>
                        </IonRow>
                    </IonRow>
                        {reviews?.length > 0 && (
                            <>
                            {reviews?.map((rev, i) => (
                                <ReviewItem key={i} review={rev} />
                            ))}
                            </>
                        )}
                </IonGrid>
                <IonModal isOpen={modalOpen}>
                    <IonHeader>
                        <IonToolbar>
                        <IonTitle>Add New Review</IonTitle>
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
                                            label="Hotel: "
                                            className="newhotel-input"
                                            value={hotel?.name}
                                            disabled
                                        />
                                    </IonRow>
                                    <IonRow>
                                        <IonSelect
                                            fill="outline"
                                            label="Rating:"
                                            interface="popover"
                                            placeholder="select"
                                            className="newhotel-input"
                                            onIonChange={(e) => setReviewRating(e.detail.value!)}
                                        >
                                            <IonSelectOption value={1}>1</IonSelectOption>
                                            <IonSelectOption value={2}>2</IonSelectOption>
                                            <IonSelectOption value={3}>3</IonSelectOption>
                                            <IonSelectOption value={4}>4</IonSelectOption>
                                            <IonSelectOption value={5}>5</IonSelectOption>
                                        </IonSelect>
                                    </IonRow>
                                    <IonRow>
                                        <IonTextarea 
                                            fill="outline"
                                            label="Comment:"
                                            className="newhotel-input"
                                            value={reviewComment}
                                            onIonChange={(e) => setReviewComment(e.detail.value!)}
                                            rows={3}
                                        />
                                    </IonRow>
                                    <IonRow class="submitbutton">
                                        <IonButton onClick={submitReview}>
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
};

export default HotelDetails;