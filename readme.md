# SheetFast ⚡

এক ক্লিকে Google Sheet সেভ এবং Steadfast কুরিয়ার বুকিং।

## কী কী করে

- কাস্টমারের অর্ডার ফর্ম পূরণ করলে স্বয়ংক্রিয়ভাবে Google Sheet-এ সেভ হয়
- একই সাথে Steadfast-এ কুরিয়ার বুক হয়ে যায়
- ট্র্যাকিং কোড সরাসরি শিটে চলে আসে
- আলাদা করে কুরিয়ার প্যানেলে লগইন করতে হয় না

## যা যা লাগবে

- একটি Google Account
- একটি Google Sheet
- Steadfast Merchant Account (API Key ও Secret Key সহ)

## সেটআপ

### ধাপ ১ — Apps Script

1. Google Sheet খুলুন
2. **Extensions → Apps Script**-এ যান
3. `Code.gs` ফাইলে `appsscript.gs`-এর কোডটি পেস্ট করুন
4. নিজের `apiKey` ও `secretKey` বসান
5. **Deploy → New Deployment → Web App** হিসেবে deploy করুন
6. **Execute as: Me** এবং **Who has access: Anyone** সিলেক্ট করুন
7. Deploy করলে একটি Web App URL পাবেন — এটি কপি করুন

### ধাপ ২ — HTML ফর্ম

1. `index.html` ফাইলটি যেকোনো এডিটরে খুলুন
2. `googleScriptUrl` ভেরিয়েবলে ধাপ ১-এ পাওয়া URL বসান
3. ফাইলটি যেকোনো ব্রাউজারে খুলুন — ব্যস, রেডি!

## ফাইল স্ট্রাকচার

```
sheetfast/
├── index.html        # অর্ডার ফর্ম (ফ্রন্টএন্ড)
└── appsscript.gs     # Google Apps Script (ব্যাকএন্ড)
```

## কীভাবে কাজ করে

```
ফর্ম সাবমিট
    ↓
Google Apps Script
    ↓
├── Google Sheet-এ রো যোগ হয়
└── Steadfast API-তে অর্ডার তৈরি হয়
        ↓
    ট্র্যাকিং কোড শিটে সেভ হয়
```

## Steadfast API Credentials কোথায় পাবেন

Steadfast Merchant Dashboard-এ লগইন করে **API Credentials** সেকশন থেকে `API Key` ও `Secret Key` সংগ্রহ করুন।

