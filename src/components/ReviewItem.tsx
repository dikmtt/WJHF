import React from "react";
import { Review } from "../pages/MainPages/HotelList/HotelDetails";
import { IonAvatar, IonCol, IonGrid, IonIcon, IonItem, IonRow, IonText } from "@ionic/react";
import "./ReviewItem.css";
import { star } from "ionicons/icons";

interface ReviewProps {
    review: Review;
}

const ReviewItem: React.FC<ReviewProps> = (props) => {
    //const backendUrl = process.env.REACT_APP_BACKEND_URL;
    return(
        <>
                <IonGrid className="rev-grid">
                    <IonRow>
                    <IonCol size="2">
                        <IonAvatar class="rev-avatar">
                            <img 
                                src={`/backend/${props.review.profile_pic}`} 
                                className="w-12 h-12 mt-2"
                            />
                        </IonAvatar>
                    </IonCol>
                    <IonCol size="8">
                        <IonRow>
                            <IonText className="rev-uname">{props.review.username}</IonText>
                        </IonRow>
                        <IonRow>
                            <IonText className="rev-date">
                                {props.review.date} {props.review.hotel_name !== undefined && `| on ${props.review.hotel_name}`}
                            </IonText>
                        </IonRow>
                        <IonRow>
                            <IonText className="rev-content">{props.review.comment}</IonText>
                        </IonRow>
                    </IonCol>
                    <IonCol size="2">
                        <IonRow>
                            <IonText className="rev-rating">{props.review.rating}</IonText>
                            <IonIcon className="rev-rating rev-rating-icon" icon={star} color="success" />
                        </IonRow>
                    </IonCol>
                    </IonRow>
                </IonGrid>
        </>
    );
}

export default ReviewItem;