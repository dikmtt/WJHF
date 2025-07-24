import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext, Hotel } from "../../../components/context/AuthContext";
import { Review } from "../HotelList/HotelDetails";
import ReviewItem from "../../../components/ReviewItem";
import HotelItem from "../../../components/HotelItem";

interface ProfileSegmentProps {
    reviews: Array<Review> | null;
    hotels: Array<Hotel> | null;
    currSegment: string;
};

const ProfileSegment: React.FC<ProfileSegmentProps> = (props) => {
    const authCtx = useContext(AuthContext);
    const [revDetails, setRevDetails] = useState<Array<Review>>([]);
    const [hotelDetails, setHotelDetails] = useState<Array<Hotel>>([]);
    //const urldetails = "http://localhost:8000/getuserdetails.php";
    /*const getRecFavOrReview = () => {
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
    }*/
    return(
        <>
            {props.currSegment === "Reviews" && props.reviews.length > 0 && (
                <>
                    {
                        props.reviews?.map((rev, i) => (
                            <ReviewItem key={i} review={rev} />
                        ))
                    }
                </>
            )}
            {(props.currSegment === "Favs" || props.currSegment === "Recs") && props.hotels.length > 0 && (
                <>
                    {
                        props.hotels?.map((hotel, i) => (
                            <HotelItem key={i} hotel={hotel} fromProfile={1} />
                        ))
                    }
                </>
            )}
        </>
    );
}

export default ProfileSegment;