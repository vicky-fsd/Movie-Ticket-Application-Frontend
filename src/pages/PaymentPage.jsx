import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import {  Navigate, useLocation } from 'react-router-dom';


const PaymentPage = () => {
    const location = useLocation();
    const { _id, showName, tickets, selectedDate, selectedTime, payment, seatIN, selectedFoodDetails, payableAmount, foodAmount, selectedFood} = location.state;
    const moviData = JSON.parse(localStorage.getItem("bookMovie")) || '';
    const langFormat = JSON.parse(localStorage.getItem("langFormat")) || '';
    const userData = JSON.parse(localStorage.getItem('loggedUser')) || '';

    const config = {
        headers: {
          'Authorization': `Bearer ${userData.token}`
        }
      };
    const [userMobile, setUserMobile] = useState('+91');
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExp, setCardExp] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successPayment, setSuccessPayment] = useState('');
    const [loading, setLoading] = useState(false);
    //const baseUrl = "http://localhost:8000/bookings/book"
     const baseUrl = "https://bookmyticket-v21x.onrender.com/bookings/book"

    const handleCardChange = (event) => {
        const { value } = event.target;
        // Remove any non-numeric characters from the input
        const numericvalue = value.replace(/\D/g, '');
    
        // Format the input as groups of 4 digits
        const formattedvalue = numericvalue.replace(/(\d{4})/g, '$1 ');
    
        setCreditCardNumber(formattedvalue);
      };


      const handleMakePayment = async (e) => {
        setLoading(true);
        e.preventDefault();
        if(userMobile.length!=13){
            setErrorMessage("Invalid mobile number");
            return
        }
        try {
            const response = await axios.post(`${baseUrl}?email=${userData.data.email}&mobile=${userMobile}`, {
                PvrId: _id,
                date: selectedDate,
                time: selectedTime,
                seat: seatIN,
                userId: userData.data._id,
                showName: moviData.title,
                showImage: moviData.Poster,
                foodAndBeverage: selectedFoodDetails,
                langFormat: langFormat,
                cinemaName: showName,
                payment: (payableAmount+141.60).toFixed(2),
                movieId: moviData._id
            }, config)
            if(response.data.success){
                setErrorMessage('');
                setSuccessPayment('Please check you mail');
                Navigate(`/user_dashboard/${userData.data._id}`);
            }
            
        } catch (error) {
            console.log(error.message);
        }
        setLoading(false)
      }

    return (
        <>
        {
            userData ? <div className="payment_bill_container">
        <div className="left_payment_container">
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successPayment && <Alert severity="success">
  <AlertTitle>Movie Booked</AlertTitle>
  Please check your — <strong>Email and SMS</strong>
</Alert>}
            <form onSubmit={(e) => handleMakePayment(e)} >
                <div className="contack_details">
                    <p className="payment_form_title">Share your Contact Details</p>
                    <div>
                    <input type="email" value={userData.data.email} />
                    <input style={{marginLeft: "10px"}} type="text" placeholder="Movile Number" value={userMobile} onChange={(e) => setUserMobile(e.target.value)} />
                    </div>
                </div>
                <div className="credit_card_details">
                    <p className="payment_form_title">Enter your Card details</p>
                    <div>
                        <input style={{display: "block", marginBottom: "10px"}} type="text" maxLength={25} value={creditCardNumber} placeholder="Enter Your Card Number" onChange={handleCardChange} required />
                        <input style={{display: "block", marginBottom: "10px"}} type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on the card" required />
                        <div>
                        <input type="date" value={cardExp} onChange={(e) => setCardExp(e.target.value)} required />
                        <input style={{marginLeft: "10px", width: "100px", textAlign: "center"}} type="number" maxLength={4} placeholder="CVV" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} required />
                        </div>
                    </div>
                    <button type="submit" style={{
                        backgroundColor: "#F84464",
                        color: "#fff",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginTop: "20px"
                    
                    }}>  
                    {loading ? <CircularProgress color='secondary' size={24} /> : 'MAKE PAYMENT'} 
                    
                    </button>
                </div>
                
            </form>
        </div>
        <div className="right_payment_container">
              <div>
                <div className="booking_summary">
                    <p className="booking_tag">ORDER SUMMARY</p>
                    <div className="flex_just">
                        <div>
                        <p className="simple_box_modle">{moviData.title}</p>
                        <p className="simple_box_modle">(U/A)</p>
                        </div>
                        <span style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>
                        <h3 className="simple_box_modle">{tickets}</h3>
                        <p className="simple_box_modle">Tickets</p>
                        </span>
                    </div>
                    <div className="description_meta" style={{
                        borderBottom: "1px dashed #666666",
                        paddingBottom: "10px"
                    }}>
                        <p>{langFormat.language}, {langFormat.format}</p>
                        <p className="simple_box_modle">{showName}</p>
                        <p className="simple_box_modle">(SCREEN 1)</p>
                        <p>M-Ticket</p>
                        <p className="simple_box_modle" style={{color: "#000", fontSize: "13px"}}>IN-{seatIN.map((ele, index) => index>0 ? `, ${ele}` : ele)}</p>
                        <p className="simple_box_modle" style={{color: "#000", fontSize: "13px"}}>{selectedDate}</p>
                        <p className="simple_box_modle" style={{color: "#000", fontSize: "13px"}}>{selectedTime}</p>
                    </div>
                    <div className="convenience_container">
                    <div className="flex_just">
                        <p style={{fontSize: 12, fontWeight: 500}}> Convenience fees </p>
                        <p style={{fontSize: 14}}>Rs.141.60</p>
                    </div>
                    <div className="flex_just">
                        <p style={{fontSize: 10, color: "#969696"}}>Base Amount</p>
                        <p style={{fontSize: 10, color: "#969696"}}>Rs. 120.00</p>   
                    </div>
                    <div className="flex_just">
                        <p style={{fontSize: 10, color: "#969696"}}>Integrated GST (IGST) @ 18%</p>
                        <p style={{fontSize: 10, color: "#969696"}}>Rs. 21.60</p>
                    </div>
                    </div>
                    <div className="flex_just">
                        <p style={{fontSize: 14, fontWeight: 500}}>Sub total</p>
                        <p style={{fontSize: 14, fontWeight: 500}}>Rs. {(payment+141.60).toFixed(2)}</p>
                    </div>
                    <div className="food_beverage_amount">
                    {
                        foodAmount ? 
                        <div className="flex_just">
                        <p style={{fontSize: 14, fontWeight: 500}}>Food & Beveragel</p>
                        <p style={{fontSize: 14, fontWeight: 500}}>Rs. {foodAmount}</p>
                    </div>
                    :
                    <span></span>
                    }
                {
                    selectedFood.map((ele) => {
                        return <div className="flex_just">
                            <p style={{fontSize: 10, color: "#969696"}}>{selectedFoodDetails[`${ele}`].title}<span style={{color: "#000", fontWeight: 500}}>(Qt. {selectedFoodDetails[`${ele}`].quantity})</span></p>
                            <p style={{fontSize: 10, color: "#969696"}}>Rs. {selectedFoodDetails[`${ele}`].price * selectedFoodDetails[`${ele}`].quantity}</p>
                        </div>
                    })
                }
                </div>
                </div>
                <div className="amount_payable flex_just">
                    <p>Amount Payable</p>
                    <p style={{fontWeight: 500}}> Rs. {(payableAmount+141.60).toFixed(2)}</p>
                </div>
                </div>
            </div>
    </div> : <Alert severity="error">Please Login !</Alert>
        }
        </>
    
    )
}

export default PaymentPage;