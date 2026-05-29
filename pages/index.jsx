import { useState } from 'react';
import { jsPDF } from 'jspdf';

const COMPANY_DETAILS = {
    name: 'SheetFast',
    address: 'Dhaka, Bangladesh',
    phone: '+880 17XXXXXXXX',
    email: 'support@sheetfast.com',
    website: 'sheetfast.com',
};

const DEFAULT_LOGO_SRC = '/customer_logo.png';

export default function OrderDashboard() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        amount: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successInfo, setSuccessInfo] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const generateInvoicePDF = async () => {
        if (!successInfo) return;

        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text(COMPANY_DETAILS.name, 40, 60);

        try {
            const response = await fetch(DEFAULT_LOGO_SRC);
            const blob = await response.blob();
            const logoDataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            if (typeof logoDataUrl === 'string') {
                const logoImage = await new Promise((resolve, reject) => {
                    const image = new Image();
                    image.onload = () => resolve(image);
                    image.onerror = reject;
                    image.src = logoDataUrl;
                });

                const maxWidth = 120;
                const maxHeight = 60;
                const widthRatio = maxWidth / logoImage.naturalWidth;
                const heightRatio = maxHeight / logoImage.naturalHeight;
                const ratio = Math.min(widthRatio, heightRatio, 1);
                const logoWidth = logoImage.naturalWidth * ratio;
                const logoHeight = logoImage.naturalHeight * ratio;
                const x = pageWidth - 40 - logoWidth;

                doc.addImage(logoDataUrl, 'PNG', x, 40, logoWidth, logoHeight);
            }
        } catch (err) {
            console.warn('Logo load failed, skipping image:', err);
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(COMPANY_DETAILS.address, 40, 80);
        doc.text(`Phone: ${COMPANY_DETAILS.phone}`, 40, 95);
        doc.text(`Email: ${COMPANY_DETAILS.email}`, 40, 110);
        doc.text(`Website: ${COMPANY_DETAILS.website}`, 40, 125);

        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(40, 140, pageWidth - 40, 140);

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice', 40, 170);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Invoice No: ${successInfo.invoice}`, 40, 190);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 40, 205);
        doc.text(`Tracking ID: ${successInfo.tracking}`, 40, 220);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Bill To:', 40, 255);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);

        const billingLines = [
            successInfo.name,
            successInfo.phone,
            ...doc.splitTextToSize(successInfo.address, 380),
        ];
        doc.text(billingLines, 40, 270, { maxWidth: 380, align: 'left' });

        const tableTop = 360;
        doc.setDrawColor(160);
        doc.setLineWidth(0.7);
        doc.rect(40, tableTop, pageWidth - 80, 80);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Description', 50, tableTop + 18);
        doc.text('Amount', pageWidth - 110, tableTop + 18, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.text('Courier Order Booking', 50, tableTop + 42);
        doc.text(`৳${successInfo.amount}`, pageWidth - 110, tableTop + 42, { align: 'right' });

        doc.setLineWidth(0.5);
        doc.line(40, tableTop + 56, pageWidth - 40, tableTop + 56);

        doc.setFont('helvetica', 'bold');
        doc.text('Total', 50, tableTop + 75);
        doc.text(`৳${successInfo.amount}`, pageWidth - 110, tableTop + 75, { align: 'right' });

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Thank you for your business.', 40, tableTop + 105);
        doc.text('If you have any questions, contact us at ' + COMPANY_DETAILS.email, 40, tableTop + 120);

        doc.save(`${successInfo.invoice || 'invoice'}.pdf`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setSuccessInfo(null);

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
                setSuccessInfo({
                    invoice: data.invoice || `INV${Math.floor(100000 + Math.random() * 900000)}`,
                    tracking: data.tracking,
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    amount: formData.amount,
                });
                setFormData({ name: '', phone: '', address: '', amount: '' });
                setMessage('অর্ডার সফলভাবে পাঠানো হয়েছে। ইনভয়েস ডাউনলোড করতে নিচের বাটনে ক্লিক করুন।');
            } else {
                setMessage('ভুল হয়েছে: ' + data.message);
            }
        } catch (err) {
            console.error('Error:', err);
            setMessage('অর্ডার সাবমিট করতে ত্রুটি হয়েছে। দয়া করে আবার চেষ্টা করুন।');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
                <h2 className="text-xl font-bold mb-2 text-emerald-400 text-center">Quick Order Dashboard</h2>
                <p className="text-xs text-slate-400 text-center mb-6">
                    এক ক্লিকে শিট সেভ, স্টিডফাস্ট বুকিং ও ইনভয়েস ডাউনলোড
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">কাস্টমারের নাম</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoFocus
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">ফোন নম্বর</label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            inputMode="tel"
                            pattern="[0-9+\-\s]*"
                            placeholder="017XXXXXXXX"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">সম্পূর্ণ ঠিকানা</label>
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
                        <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">পণ্যের দাম (COD টাকা)</label>
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

                {message ? (
                    <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-100">
                        {message}
                    </div>
                ) : null}

                {successInfo ? (
                    <div className="mt-4 space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                        <div className="text-sm text-emerald-300">Tracking ID: {successInfo.tracking}</div>
                        <button
                            onClick={generateInvoicePDF}
                            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-600"
                        >
                            Download Invoice PDF
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
