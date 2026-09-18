# Faxr Mebel — operatsion qo'llanma

Loyiha egasi uchun: deploy, Firestore qoidalari, admin huquqi, Telegram tokeni.
Kod bilan bog'liq tafsilotlar `README.md` da (Faza 8 da yangilanadi).

## 1. Deploy oqimi

- Hosting: Vercel, GitHub `main` branch'iga har push avtomatik deploy qilinadi.
- Ish tartibi: o'zgarishlar alohida branch'da → `npm run build` yashil → `main` ga merge → push.

```bash
git checkout main
git merge --ff-only <branch>
git push origin main
```

## 2. Vercel muhit o'zgaruvchilari

Vercel → loyiha → Settings → Environment Variables. Env o'zgargandan keyin **yangi deploy** shart (Deployments → ⋯ → Redeploy).

| Nomi | Muhit | Izoh |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Production, Preview | BotFather tokeni. `VITE_` prefiksi **bo'lmasin**: `VITE_*` qiymatlar brauzer bundle'iga kiradi. |
| `TELEGRAM_CHAT_ID` | Production, Preview | Xabarlar boradigan chat/guruh ID. |
| `ALLOWED_ORIGINS` | faqat Production | `https://faxr-mebel.vercel.app` (shaxsiy domen bo'lsa vergul bilan). Preview'ga qo'ymang: ro'yxat bo'sh bo'lsa hamma origin'ga ruxsat, preview URL'lar har deploy'da boshqacha. |
| `VITE_APP_URL` | Production | QR kod va kanonik havolalar uchun sayt manzili. |

Eski `VITE_TELEGRAM_BOT_TOKEN` va `VITE_TELEGRAM_CHAT_ID` o'chirilgan bo'lishi kerak.

Lokal ishlash uchun `.env.local` (git'ga kirmaydi): `.env.example` dagi kalitlar. `npm run dev` da `/api/notify` xuddi Vercel'dagidek ishlaydi.

## 3. Firestore qoidalarini chop etish

Loyiha: `gen-lang-client-0514709959`. Baza **nomlangan**: `ai-studio-9e20a7a9-1a8b-431c-9c9c-364fe5ae68c0` (`(default)` emas). Qoidalar manbai: repodagi `firestore.rules`.

**Console orqali:** Firebase Console → Firestore Database → yuqoridagi baza tanlagichdan nomlangan bazani tanlang → Rules → faylning to'liq matnini qo'ying → Publish.

**CLI orqali** (`firebase.json` va `.firebaserc` allaqachon sozlangan):

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
```

Faqat `firestore:rules`. Indekslar Faza 4 da qo'shiladi; `--only firestore` (indekslar bilan) hozircha ishlatilmasin.

Tekshirish: Rules Playground → `get`, yo'l `admins/<UID>`, auth shu UID bilan → Allow.

**Arizalar (`requests`) uchun qo'shimcha tekshiruv** — qoidalar yangilangandan keyin Playground'da:

| Amal | Yo'l | Auth | Ma'lumot | Kutilgan |
|---|---|---|---|---|
| `create` | `requests/REQ-test` | ixtiyoriy UID (anonim ham) | `userId` = shu UID, `status` = `new`, `client`, `phone`, `category` = `kitchen` | **Allow** |
| `create` | `requests/REQ-test` | ixtiyoriy UID | `status` = `installed` | **Deny** |
| `get` | `requests/<boshqaning arizasi>` | oddiy UID | — | **Deny** |
| `update` | `requests/<mavjud>` | admin bo'lmagan UID | — | **Deny** |

Eng ko'p uchraydigan xato: qoidalar `(default)` bazaga chop etiladi. Hammasi muvaffaqiyatli ko'rinadi, lekin saytdagi har bir ariza `permission-denied` oladi. Baza tanlagichdan **nomlangan** bazani tanlaganingizga ishonch hosil qiling.

## 4. Admin huquqi berish

`/admin` faqat `admins/{uid}` hujjati bor foydalanuvchiga ochiladi. Hujjat faqat Console'dan yaratiladi, klient yozolmaydi.

1. Authentication → Users → kerakli akkaunt → User UID ni nusxalang.
2. Firestore → nomlangan baza → `admins` kolleksiyasi (yo'q bo'lsa Start collection).
3. Document ID = UID (Auto-ID emas). Maydon: `role` (string) = `admin`. Save.
4. Tekshirish: saytga shu akkaunt bilan kiring → navbar'da "Admin" havolasi → `/admin` ochiladi, qizil xato banneri yo'q.

Huquqni olib tashlash: hujjatni o'chiring; foydalanuvchi keyingi kirishda oddiy mijozga aylanadi.

## 5. Telegram tokenini almashtirish

Token sizib chiqqan yoki eskirgan bo'lsa:

1. BotFather → `/mybots` → bot → API Token → Revoke.
2. Yangi tokenni Vercel env (`TELEGRAM_BOT_TOKEN`) va lokal `.env.local` ga yozing.
3. Vercel'da Redeploy.
4. Saytdagi Aloqa formasi orqali test xabar yuboring, chatga kelishini tekshiring.

Tokenni hech qachon `VITE_` prefiksi bilan yozmang va git'ga commit qilmang.

## 6. Anonim kirishni yoqish

Ariza qoldirish uchun mijoz ro'yxatdan o'tishi shart emas, lekin ariza baribir bazaga saqlanadi. Buning uchun sayt kirmagan mijozni ko'rinmas anonim hisob bilan kiritadi. Bu provayder sukut bo'yicha o'chiq:

1. Firebase Console → Authentication → Sign-in method.
2. Ro'yxatdan **Anonymous** ni toping → Enable → Save.

Yoqilmagan bo'lsa: ariza Telegramga baribir keladi (⚠️ belgisi bilan), lekin bazaga tushmaydi va mijoz profilida ko'rinmaydi. Sayt xato bermaydi, ariza yo'qolmaydi.

Anonim hisoblar Authentication → Users ro'yxatida "Anonymous" provayderi bilan ko'rinadi. Ularni o'chirish shart emas; mijoz haqiqiy hisob ochsa, yangi hisob bo'ladi.

## 7. Arizalar

- `requests` kolleksiyasi: mijoz (anonim ham) faqat o'z arizasini yaratadi va o'qiydi; holatni faqat admin o'zgartiradi; admin o'chira oladi.
- Admin panel → "Arizalar" → "Keyingi bosqich": `new → measured → production → quality → installed` (ariza qabul qilindi → o'lchov olindi → ustaxonada → sifat nazorati → o'rnatildi). Mijoz Profile'da shu bosqichni ko'radi.
- Ariza ikki joyga boradi: avval Firestore (8 soniya timeout bilan), keyin Telegram. Ikkalasidan bittasi ishlasa mijoz "yuborildi" ko'radi. Telegram xabarida `⚠️ Bazaga saqlanmadi` chiqsa — qoidalar chop etilmagan yoki anonim kirish yoqilmagan; mijozga o'zingiz qo'ng'iroq qiling.
- Qoidalarda faqat `admins` va `requests` qolgan. Do'kon bilan birga `products`, `categories`, `users`, `orders` va `reviews` bloklari olib tashlangan: ularni hech qanday kod ishlatmaydi, anonim kirish yoqilgach esa tekshiruvsiz `create` qoidalari istalgan tashrifchiga bazaga ixtiyoriy ma'lumot yozish imkonini berardi. Baza qoidalar birinchi marta chop etilganda bo'sh edi, saqlanadigan eski hujjat yo'q.
