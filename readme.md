# SheetFast ⚡ (Next.js Version)

Next.js ভিত্তিতে তৈরি একটি অ্যাপ যা কাস্টমার অর্ডার নিয়ে:
- Google Sheet-এ ডেটা সেভ করে
- Steadfast এ অর্ডার করে
- একটি প্রফেশনাল ইনভয়েস PDF ডাউনলোড করে দেয়

## কি করে

- কাস্টমারের তথ্য দিয়ে অর্ডার সাবমিট
- `pages/api/submit-order.js` এ ব্যাকএন্ড রিকোয়েস্ট
- Steadfast API থেকে ট্র্যাকিং আইডি ফেরত
- Google Apps Script-এ ডেটা পাঠিয়ে শিটে রো যোগ
- লোগো সহ PDF ইনভয়েস জেনারেট

## ইনস্টলেশন

### 1. ডিপেনডেন্সি ইনস্টল করুন

```bash
npm install
# অথবা
# yarn install
```

### 2. `.env.local` তৈরি করুন

প্রকল্প মূল ডিরেক্টরিতে `.env.local` ফাইল তৈরি করে নিচের ভ্যালু গুলো দিন:

```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
STEADFAST_API_KEY=আপনার_API_KEY
STEADFAST_SECRET_KEY=আপনার_SECRET_KEY
STEADFAST_API_URL=https://portal.packzy.com/api/v1/create_order
GOOGLE_SHEET_ID=আপনার_SHEET_ID
```

## চালু করা

### ডেভেলপমেন্ট মোড

```bash
npm run dev
```

তারপর ব্রাউজারে যান:

```text
http://localhost:3000
```

### প্রোডাকশন বিল্ড

```bash
npm run build
npm start
```

## ফাইল স্ট্রাকচার

```
SheetFast+nextjs/
├── pages/
│   ├── _app.js
│   ├── index.jsx
│   └── api/
│       └── submit-order.js
├── public/
│   ├── customer_logo.png
│   ├── favicon.svg
├── styles/
│   └── globals.css
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## কীভাবে কাজ করে

1. ফর্ম সাবমিট করলে `pages/api/submit-order.js` কল হয়
2. সেটি Steadfast API-তে অর্ডার পাঠায়
3. Google Apps Script URL-এ ডেটা POST করে শিটে রাখতে বলে
4. সফল হলে ট্র্যাকিং আইডি এবং ইনভয়েস নম্বর ফেরত দেয়
5. `Download Invoice PDF` বাটনে ক্লিক করলে ইনভয়েস ডাউনলোড হয়

## Google Apps Script সেটআপ

1. Google Sheet খুলুন
2. **Extensions → Apps Script** এ যান
3. নিম্নের মতো `Code.gs` কোড ব্যবহার করুন:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById("YOUR_SHEET_ID");
    var sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];

    sheet.appendRow([
      new Date(),
      data.name,
      data.phone,
      data.address,
      data.amount,
      data.tracking || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Deploy করুন `New Deployment → Web App`
5. **Execute as:** Me
6. **Who has access:** Anyone
7. Web App URL কপি করে `.env.local` এ `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` এ দিন

## ট্রাবলশুটিং

### যদি বিল্ড না হয়

```bash
rm -rf node_modules package-lock.json
npm install
```

### যদি অ্যাপ কাজ না করে

- `.env.local` এ সব ভেরিয়েবল সঠিক আছে কিনা চেক করুন
- Steadfast API Key ও Secret Key সঠিক কিনা দেখুন
- Google Apps Script URL সঠিক কিনা নিশ্চিত করুন
- `Google Sheet ID` সঠিক আছে কিনা দেখুন

## প্রয়োজনীয় লক্ষ্য

- `public/customer_logo.png`-এর উপর ভিত্তি করে ইনভয়েস লোগো নেয়া হচ্ছে
- ফর্মে কেবল গ্রাহকের নাম, ফোন, ঠিকানা, এমাউন্টই লাগে
- Google Apps Script শুধু শিটে ডেটা যোগ করে
- Steadfast বুকিং চালানোর কাজ সার্ভার/Next.js API Route করে

---

### নোট

এই README ফাইলটি `Next.js` ভার্সনের জন্য আপডেট করা হয়েছে। পুরাতন `index.html` ও `appsscript.gs` ভার্সন না থাকলে, মূলভাবে `pages/index.jsx` ও `pages/api/submit-order.js` থেকে কাজ হবে।

