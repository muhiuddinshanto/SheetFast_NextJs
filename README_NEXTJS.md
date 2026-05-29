# SheetFast ⚡ (Next.js Version)

এক ক্লিকে Google Sheet সেভ এবং Steadfast কুরিয়ার বুকিং।

## কী কী করে

- কাস্টমারের অর্ডার ফর্ম পূরণ করলে স্বয়ংক্রিয়ভাবে Google Sheet-এ সেভ হয়
- একই সাথে Steadfast-এ কুরিয়ার বুক হয়ে যায়
- ট্র্যাকিং কোড সরাসরি শিটে চলে আসে
- আলাদা করে কুরিয়ার প্যানেলে লগইন করতে হয় না

## ইনস্টলেশন

### 1. Dependencies ইনস্টল করুন

```bash
npm install
# অথবা
yarn install
```

### 2. .env.local ফাইল সেটআপ করুন

`.env.local` ফাইলটি খুলুন এবং নিজের API Keys ও URLs আপডেট করুন:

```env
# Google Apps Script URL (আপনার Google Sheet এর Apps Script Web App URL)
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Steadfast API Credentials
STEADFAST_API_KEY=আপনার_API_KEY
STEADFAST_SECRET_KEY=আপনার_SECRET_KEY
STEADFAST_API_URL=https://portal.packzy.com/api/v1/create_order

# Google Sheet ID (ঐচ্ছিক)
GOOGLE_SHEET_ID=আপনার_SHEET_ID
```

## চালু করুন

### Development Mode

```bash
npm run dev
# অথবা
yarn dev
```

তারপর `http://localhost:3000` ব্রাউজারে খুলুন।

### Production Build

```bash
npm run build
npm start
# অথবা
yarn build
yarn start
```

## প্রজেক্ট স্ট্রাকচার

```
sheetfast-nextjs/
├── pages/
│   ├── _app.js              # Next.js App Component
│   ├── index.jsx            # মূল অর্ডার ড্যাশবোর্ড পেজ
│   └── api/
│       └── submit-order.js   # API Route (অর্ডার সাবমিশন)
├── styles/
│   └── globals.css          # গ্লোবাল স্টাইল
├── .env.local               # পরিবেশ ভেরিয়েবল
├── package.json
├── next.config.js
├── tailwind.config.js
├── jsconfig.json
└── README_NEXTJS.md
```

## কিভাবে কাজ করে

```
ফ্রন্টএন্ড ফর্ম সাবমিট
    ↓
Next.js API Route (/api/submit-order)
    ↓
├── Steadfast API-তে অর্ডার তৈরি করা
└── Google Apps Script-এ ডেটা পাঠানো
        ↓
    Google Sheet-এ সেভ হয়
    ট্র্যাকিং কোড রিটার্ন হয়
```

## Steadfast API Credentials কোথায় পাবেন

1. [Steadfast Merchant Dashboard](https://portal.packzy.com) এ লগইন করুন
2. **API Settings** অথবা **API Credentials** সেকশন খুঁজুন
3. `API Key` এবং `Secret Key` কপি করুন
4. `.env.local` ফাইলে পেস্ট করুন

## Google Apps Script সেটআপ (যদি পরিবর্তন প্রয়োজন হয়)

1. আপনার Google Sheet খুলুন
2. **Extensions → Apps Script** যান
3. `Code.gs` ফাইলে এই কোড পেস্ট করুন:

```javascript
function doPost(e) {
}
```
  try {
    var data = JSON.parse(e.postData.contents);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];

    // Do NOT call courier APIs from Apps Script — backend handles booking and returns tracking.
    sheet.appendRow([
      new Date(),
      data.name,
      data.phone,
      data.address,
      data.amount,
      data.tracking || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. **Deploy → New Deployment → Web App** করুন
5. **Execute as: Me**, **Who has access: Anyone** সিলেক্ট করুন
6. Deploy করলে URL পাবেন - এটি কপি করে `.env.local` এ পেস্ট করুন

## ট্রাবলশুটিং

### "Error: Cannot find module" 
```bash
rm -rf node_modules package-lock.json
npm install
```

### API একশনিং না হলে
- `.env.local` ফাইল চেক করুন যে সব ভেরিয়েবল সঠিক আছে কিনা
- Steadfast API Key এবং Secret Key সঠিক কিনা দেখুন
- Google Apps Script URL সঠিক কিনা দেখুন

### Google Sheet-এ ডেটা না যাওয়ার মামলায়
- Google Apps Script এর Web App URL সঠিক কিনা চেক করুন
- Google Sheet এ "Sheet1" নামের শীট আছে কিনা দেখুন

## টিপস

- পোর্ট পরিবর্তন করতে: `npm run dev -- -p 3001`
- Environment ভেরিয়েবল শুধুমাত্র backend থেকে ব্যবহার করুন `.env.local` থেকে
- Frontend থেকে sensitive keys expose করবেন না

---

কোনো প্রশ্ন বা সমস্যা? আমার কাছে যোগাযোগ করুন। 😊
