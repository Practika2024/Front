import React, { useState } from "react";
import { UserService } from "../../../../utils/services/UserService";
import { toast } from "react-toastify";

const EmailConfirmationPage = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const sendConfirmationEmail = async () => {
        setLoading(true);
        try {
            await UserService.sendEmailConfirmation();
            setMessage("Verification email sent successfully!");
            toast.success("Verification email sent successfully!");
        } catch (error) {
            console.error("Error sending email:", error);
            if (error.response?.status === 409) {
                setMessage("The verification token has expired. Please request a new email.");
                toast.error("The verification token has expired. Please request a new email.");
            } else {
                setMessage("Failed to send the email. Please try again.");
                toast.error("Failed to send the email.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container my-3">
            <h1>Email Confirmation</h1>
            <p>{message}</p>
            <button
                className="btn btn-primary"
                onClick={sendConfirmationEmail}
                disabled={loading}
            >
                {loading ? "Надсилання..." : "Надіслати лист для підтвердження"}
            </button>
        </div>
    );
};

export default EmailConfirmationPage;