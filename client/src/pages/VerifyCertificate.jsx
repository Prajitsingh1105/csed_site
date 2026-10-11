import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyCertificate = () => {
    const { id } = useParams();
    const { backendUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/public/verify/no-dues/${id}`);
                if (res.data.success) {
                    setData(res.data.data);
                } else {
                    setError('Invalid Certificate ID');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to verify certificate.');
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [id, backendUrl]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-red-100">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-green-100">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Valid Certificate</h2>
                
                <div className="text-left space-y-4">
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Student Name</div>
                        <div className="text-lg font-semibold text-gray-800">{data.name}</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Roll Number</div>
                        <div className="text-lg font-semibold text-gray-800">{data.rollNumber}</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Branch</div>
                        <div className="text-lg font-semibold text-gray-800">{data.branch}</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date Issued</div>
                        <div className="text-lg font-semibold text-gray-800">{new Date(data.approvedAt).toLocaleDateString()}</div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Approved
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyCertificate;
