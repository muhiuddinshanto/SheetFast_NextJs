import { useState } from 'react';

export default function OrderDashboard() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        amount: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/submit-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.status === 'success') {
                if (data.tracking.includes('Error') || data.tracking.includes('Failed')) {
                    alert('⚠️ শিটে সেভ হয়েছে কিন্তু কুরিয়ার এরর: ' + data.tracking);
                } else {
                    alert(
                        '🔥 সফল! অর্ডারটি গুগল শিটে সেভ হয়েছে এবং স্টিডফাস্টে বুক হয়েছে।\nট্র্যাকিং আইডি: ' +
                        data.tracking
                    );
                }
                setFormData({ name: '', phone: '', address: '', amount: '' });
            } else {
                alert('ভুল হয়েছে: ' + data.message);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('অর্ডার সাবমিট করতে ত্রুটি হয়েছে। দয়া করে আবার চেষ্টা করুন।');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
                <h2 className="text-xl font-bold mb-2 text-emerald-400 text-center">
                    Quick Order Dashboard
                </h2>
                <p className="text-xs text-slate-400 text-center mb-6">
                    এক ক্লিকে শিট সেভ ও স্টিডফাস্ট বুকিং
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
                            কাস্টমারের নাম
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
                            ফোন নম্বর
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
                            সম্পূর্ণ ঠিকানা
                        </label>
                        <textarea
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            required
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
                            পণ্যের দাম (COD টাকা)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="0"
                            placeholder="যেমন: 650"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-500 text-slate-900 font-bold py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-emerald-500/20"
                    >
                        {isLoading ? 'Processing...' : 'Submit Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}
