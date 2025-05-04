import React, { useEffect, useState } from "react";
import { UserService } from "../../../../utils/services/UserService";
import { toast } from "react-toastify";

const ApprovalRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const response = await UserService.getUnapprovedUsers();
            console.log("API Response:", response); // Log the full response
            setRequests(response.payload || []); // Extract the payload array
        } catch (error) {
            console.error("Error fetching approval requests:", error);
            toast.error("Failed to fetch approval requests");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await UserService.approveUser(userId);
            toast.success("User approved successfully");
            fetchRequests();
        } catch (error) {
            console.error("Error approving user:", error);
            toast.error("Failed to approve user");
        }
    };

    const handleReject = async (userId) => {
        try {
            await UserService.rejectUser(userId);
            toast.success("User rejected successfully");
            fetchRequests();
        } catch (error) {
            console.error("Error rejecting user:", error);
            toast.error("Failed to reject user");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container my-3">
            <h1>Approval Requests</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(requests) && requests.map((request, index) => (
                    <tr key={request.id}>
                        <td>{index + 1}</td>
                        <td>{request.name}</td>
                        <td>{request.email}</td>
                        <td>
                            <button
                                className="btn btn-success me-2"
                                onClick={() => handleApprove(request.id)}
                            >
                                Approve
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleReject(request.id)}
                            >
                                Reject
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApprovalRequestsPage;
