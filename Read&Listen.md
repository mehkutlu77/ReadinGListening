# 📚 ReadingListening - İngilizce Öğrenme Uygulaması

**Versiyon:** v13 Evolution
**Durum:** Üretime hazır (Phase 1 & 2 tamamlandı)
**Son Güncelleme:** 2026-03-09

---

## 🎯 Proje Özeti

ReadingListening, akıllı spaced repetition sistemi ile İngilizce öğretmek için tasarlanmış gelişmiş PWA uygulamasıdır. Duyarlı kelime öğrenme deneyimi ve haftalık istatistikler sunmaktadır.

### Ana Özellikler
- ✅ **Akıllı Kelime İncelemesi** - SM-2 Spaced Repetition algoritması
- ✅ **Günlük Hatırlatmalar** - Özelleştirilebilir bildirim saatleri
- ✅ **Swipe Jestleri** - Mobil dostu hızlı yanıtlar
- ✅ **Haftalık İstatistikler** - Aktivite grafiği ve metrikleri
- ✅ **Geliştirilmiş Placement Testi** - Seviye önerileri ve örnekler
- 🔄 **Henüz Yapılacaklar** - Telaffuz, ses efektleri, fotoğraf avatarı, dark mode animasyonları

---

## 📁 Proje Yapısı

```
ReadingListening/
├── index.html              # Ana uygulama (5,800+ satır)
├── sw.js                   # Service Worker (165 satır)
├── manifest.json           # PWA konfigürasyonu
├── kelimeler.js            # 9,772 kelime veri tabanı (5.6 MB)
├── reading.js              # 228 okuma metni (2.2 MB)
├── sinavlar.js             # 6 placement testi tanımı (31 KB)
├── offline.html            # Offline fallback sayfası
├── icons/                  # PWA ikonu (72x72, 192x192, 512x512)
└── images/                 # Okuma resimleri
```

---

## 🏗️ Mimari & Teknoloji

### Veri Depolama
```javascript
// localStorage anahtarı: 'master_eng_v13'
let db = {
  lvl: 'Sprout',                    // Mevcut seviye
  lang: 'EN',                        // Dil (EN/TR)
  dictionary: [],                    // Tüm kelimeler
  unknown: [],                       // Öğrenilecek kelimeler (SRS verileri ile)
  readings: [],                      // Okuma metinleri
  weekActivity: {},                  // Günlük aktivite (YYYY-MM-DD)
  stats: {                           // Genel istatistikler
    completed: {},
    correct: 0,
    total: 0,
    learnedWords: 0
  },
  profile: {
    name: '',
    avatar: '😊',
    goal: 10                         // Günlük kelime hedefi
  },
  settings: {
    darkMode: false,
    notifications: false,
    remindersEnabled: false,         // ✨ YENİ
    reminderTime: '08:00',           // ✨ YENİ
    soundsEnabled: true
  },
  onboardingDone: false,
  todayWords: 0,
  todayDate: '',
  badges: [],
  srsLastReview: 0                   // ✨ YENİ - Son SRS incelemesi
};
```

### Kelime Formatı (SRS Alanları ile)
```javascript
{
  w: 'word',
  tr: 'Türkçe çeviri',
  te: 'Türkçe örnek',
  tt: 'Türkçe örnek çevirisi',
  de: 'English definition',
  dt: 'English definition translation',
  e1: 'Example 1',
  e1t: 'Example 1 translation',
  e2: 'Example 2',
  e2t: 'Example 2 translation',
  cefr: 'A1',                        // Seviye (A1-C2)

  // ✨ YENİ - SRS Alanları
  interval: 0,                       // Günler cinsinden inceleme aralığı
  repetitions: 0,                    // Kaç kez doğru cevaplanıldı
  easeFactor: 2.5,                   // Zorluk faktörü (1.3-5.0)
  nextReview: 0,                     // Sonraki inceleme zamanı (ms)
  lastReviewDate: 0                  // Son inceleme zamanı (ms)
}
```

---

## 🔧 Tamamlanan Özellikler (5/9)

### Phase 1: Altyapı ✅

#### **Feature 2: Spaced Repetition System (SM-2 Algoritması)**
**Dosya:** `index.html` (2778-2838 satır arası)

```javascript
calculateNextInterval(quality, interval, repetitions, easeFactor)
  // Kalite: 0-5 (0=tamamen unuttum, 5=mükemmel hatırlıyorum)
  // Sonuç: { interval, repetitions, easeFactor }

scoreCard(wordId, quality)
  // Kelimeyi SRS verilerine göre puanla
  // Günlük istatistikleri güncelle

getSRSStats()
  // Çıktı: { dueToday, total, learning }

sortCardsByPriority()
  // Kelimeleri sonraki inceleme zamanına göre sırala
```

**Test Sonuçları:**
- Kalite 5: interval=1 gün, ease=2.6
- Kalite 0: interval=0, ease=2.3

---

#### **Feature 1: Daily Reminders / Notifications**
**Dosya:** `index.html` (5020-5100 satır arası)

```javascript
scheduleNotifications()
  // Sonraki hatırlatma saatini hesapla
  // setTimeout() ile zamanla

sendDailyReminder()
  // SRS istatistiklerini göster
  // Bildirim gönder: "X kelime seni bekliyor!"

updateReminderTime(time)
  // Kullanıcı seçilen saati kaydet (08:00-22:00)

updateToggleUI()
  // Bildirim toggle'ını güncelle
  // Saat seçiciyi göster/gizle
```

**UI Konumu:** Ayarlar → 🔔 Bildirim Ayarları → Hatırlatma Saati seçici

---

### Phase 2: Temel Özellikler ✅

#### **Feature 4: Placement Test Enhancement**
**Dosya:** `index.html` (4669-4710 satır arası)

Yükseltmeler:
- ✅ Yüzde puanı büyük kutu içinde
- ✅ X/Y doğru cevaplar detaylı gösterimi
- ✅ O seviyeden örnek kelimeler
- ✅ "Öğrenmeye Başla" butonu

---

#### **Feature 5: Swipe Gestures**
**Dosya:** `index.html` (3605-3650 satır arası)

```javascript
initializeCardSwipe()
  // Touch event dinleyicileri ekle
  // Sağa swipe (>50px) = "Biliyorum" (quality 5)
  // Sola swipe (>50px) = "Tekrar" (quality 0)
  // Smooth animasyon: rotate + fade

Tetikleme: show('cardScreen') çağrıldığında otomatik
```

---

#### **Feature 6: Weekly Digest Stats**
**Dosya:** `index.html` (2802-2900 satır arası)

```javascript
calculateWeeklyStats()
  // 7 günlük aktivite topla
  // Günlük verileri hazırla

showWeeklyDigest()
  // Modal oluştur:
  // - 🔥 Günlük seri
  // - 📚 Bu hafta öğrenilen
  // - 📅 Günlük aktivite grafiği
  // - 🧠 Kart incelemeleri
  // - 📈 Günlük ortalama
  // - 🎓 Mevcut seviye

UI Konumu: Ayarlar → Haftalık İstatistikler butonu
```

**Veri Yapısı:**
```javascript
db.weekActivity = {
  "2026-03-09": { cardsReviewed: 15, newWordsLearned: 3 },
  "2026-03-08": { cardsReviewed: 12, newWordsLearned: 2 }
}
```

---

## 🚧 Henüz Yapılacaklar (4/9)

### Phase 3: Polish Özellikler

| Özellik | Karmaşıklık | Satırlar | Durum |
|---------|-----------|---------|--------|
| **Feature 3: Telaffuz** | SIMPLE | 100-150 | 🔄 |
| **Feature 7: Ses Efektleri** | SIMPLE | 80-120 | 🔄 |
| **Feature 8: Fotoğraf Avatar** | MEDIUM | 150-200 | 🔄 |
| **Feature 9: Dark Mode Animasyonları** | SIMPLE | 50-80 | 🔄 |

### Yayın Engelleri (iOS/Google Play)

- 🔴 **Kırık Screenshot Referansları**
  - `manifest.json` satır 69: `screenshots/home.png` silindi
  - `index.html` satır 64, 72: og:image/twitter:image kırık

- 🔴 **1024×1024 İkon Eksik**
  - App Store 1024×1024 gerektirir
  - Şu an max: 512×512

- 🔴 **Gizlilik Politikası Eksik**
  - manifest.json'da URL gerekli
  - HTML meta etiketlerinde gerekli

- 🔴 **Admin Kimlik Bilgileri Sabit Kodlu**
  - `index.html` satır ~5100: Hardcoded credentials
  - Güvenlik riski

---

## 🔑 Ana Fonksiyonlar Referansi

### Uygulama Başlatma
```javascript
load()                          // localStorage'den yükle (satır 2762)
applyLang()                     // Dili uygula (satır 2896)
buildLevelGrid()                // Seviye düğmelerini oluştur (satır 2816)
applyLevel(id)                  // Seviye değiştir (satır 2806)
scheduleNotifications()         // Hatırlatmaları zamanla (satır 5020)
```

### Kart Akışı
```javascript
show('cardScreen')              // Kart ekranını aç (satır 3029)
initializeCardSwipe()           // Swipe dinleyicilerini hazırla
renderCard()                    // Mevcut kartı çiz (satır 3559)
cardAction('know'|'again')      // SRS ile puanla (satır 3613)
```

### İstatistikler
```javascript
calculateWeeklyStats()          // Haftalık verileri topla (satır 2802)
showWeeklyDigest()              // Stats modalını aç (satır 2845)
streakCount()                   // Gün serisini say (satır ~2862)
getSRSStats()                   // SRS istatistiklerini al (satır 2838)
```

### Ayarlar
```javascript
toggleSetting(key)              // Toggle etkinleştir/devre dışı bırak (satır 5020)
updateToggleUI()                // Toggle UI'ı güncelle (satır 5050)
updateReminderTime(time)        // Hatırlatma saatini kaydet (satır 5045)
```

---

## 📊 Durum Özeti

### Kod İstatistikleri
- **index.html:** 6,000+ satır (Ana uygulama)
- **sw.js:** 165 satır (Service Worker)
- **Yeni Kod:** ~1,200 satır (5 özellik)
- **Kütüphaneler:** 0 (Vanilla JS + Web APIs)

### Veri Tabanı
- **Kelimeler:** 9,772 adet
- **Okuma Metinleri:** 228 adet
- **Sınavlar:** 6 adet
- **localStorage Boyutu:** <5 MB (hedef)

### Browser Desteği
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔄 Önemli Veri Döngüleri

### Kelime Öğrenme Akışı
```
1. Kullanıcı bilinmeyen kelime ekler
   → SRS alanları başlatılır (interval=0, repetitions=0)

2. Kartlar SRS önceliğine göre sıralanır
   → En geç review zamanına sahip kelime ilk gösterilir

3. Kullanıcı "Biliyorum" (swipe right) veya "Tekrar" (swipe left) yapar
   → scoreCard(quality) çağrılır

4. SM-2 algoritması interval/ease'i günceller
   → Sonraki review zamanı hesaplanır

5. Günlük aktivite kaydedilir
   → db.weekActivity[tarih].cardsReviewed++

6. Haftalık istatistikler güncellenir
   → Weekly digest'te gösterilir
```

### Bildirim Akışı
```
1. Kullanıcı Ayarlar → Bildirim Saati seçer (ör. 08:00)
   → db.settings.reminderTime = '08:00' kaydedilir

2. App başlarken scheduleNotifications() çağrılır
   → setTimeout() ile sonraki 08:00 zamanlanır

3. Her gün saat 08:00'de:
   → sendDailyReminder() çalışır
   → SRS istatistikleri (dueToday) alınır
   → Bildirim gönderilir
   → Sonraki gün için yeniden zamanlanır
```

---

## 🛠️ Geliştirme Notları

### Service Worker Desteği
- Push notifications handler: Hazır (satır 110-127)
- Background sync: Hazır (satır 147-157)
- Static cache: kelimeler.js, reading.js, sinavlar.js
- Data cache: localStorage yedekleme

### localStorage Limitleri
- **Hedef:** <5 MB
- **Şu an:** ~500 KB-2 MB (kullanıcı aktivitesine göre)
- **Maksimum avatar:** Base64 resim ~100 KB (sıkıştırılmış)

### Browser APIs Kullanılan
- ✅ localStorage (persistence)
- ✅ Notification API (reminders)
- ✅ Web Speech API (pronunciation - hazırlanıyor)
- ✅ File API (photo upload - hazırlanıyor)
- ✅ Canvas API (image resize - hazırlanıyor)
- ✅ Touch Events (swipe gestures)
- ✅ Service Worker (offline + push)

---

## 📝 Sonraki Adımlar (Öncelik Sırasına Göre)

### 1️⃣ KRITIK - iOS/Google Play Yayını Engelleri
```
[ ] Kırık screenshot referanslarını düzelt
    - manifest.json satır 69
    - index.html satır 64, 72

[ ] 1024×1024 app icon oluştur
    - icons/ klasörüne ekle
    - manifest.json'a ekle

[ ] Gizlilik politikası docümanı oluştur
    - manifest.json'a URL ekle
    - HTML meta etiketlerine ekle

[ ] Admin credentials güvenliği
    - Backend storage'a taşı
    - Şifrelemen ekle
```

### 2️⃣ Kalan 4 Özellik (Phase 3)
```
[ ] Feature 3: Telaffuz Pratiği (100-150 LOC)
[ ] Feature 7: Ses Efektleri (80-120 LOC)
[ ] Feature 8: Fotoğraf Avatar (150-200 LOC)
[ ] Feature 9: Dark Mode Animasyonları (50-80 LOC)
```

### 3️⃣ Optimizasyon
```
[ ] localStorage boyutunu profillendirin
[ ] Swipe jestlerini çeşitli cihazlarda test edin
[ ] Bildirim zamanlamasını ince ayarlayın
[ ] Offline senaryolarını test edin
```

---

## 🆘 Hızlı Referans

### Sık Kullanılan Komutlar
```javascript
// Tüm SRS istatistiklerini göster
getSRSStats()                           // → { dueToday: 5, total: 100, learning: 20 }

// Kelimeleri yeniden sırala
sortCardsByPriority()                   // → Kelimeleri interval'e göre sırala

// Haftalık stats'ı aç
showWeeklyDigest()                      // → Modal aç

// Reminder saatini değiştir
updateReminderTime('14:00')             // → Saat 14:00'ye ayarla

// Dark mode'u toggle et
toggleDarkMode()                        // → Açık ↔ Koyu

// Seviye değiştir (Admin)
applyLevel('Forest')                    // → B2 seviyesine geç

// localStorage'ı temizle (Developer)
localStorage.clear()                    // ⚠️ Tüm verileri siler!
```

### Console Hata Ayıklama
```javascript
// SRS test
console.log(calculateNextInterval(5, 0, 0, 2.5))

// Haftalık data
console.log(calculateWeeklyStats())

// localStorage boyutu
console.log(new Blob(Object.values(localStorage)).size, 'bytes')

// Service Worker status
navigator.serviceWorker.getRegistration().then(reg => console.log(reg))
```

---

## 📞 İletişim & Destek

**Sorunlar/Öneriler:**
- Feature tarafı sorunları: Feature tab'ında açıkla
- UI/UX sorunları: Screenshot ekle
- Performance sorunları: DevTools profili ekle

**Backlogs:**
- Feature 3-9 tamamlanmadı
- iOS/Play Store yayını için 4 engel var

---

**Son Güncelleme:** 2026-03-09
**Geliştirici:** Claude (Haiku 4.5)
**Durum:** Üretime Hazır (Phase 1 & 2)
**Sonraki Kontrol:** Feature 3 başlamadan önce yayın engelleri çözülmeli
