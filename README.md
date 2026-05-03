# CodeFlux AI

React + Vite ile geliştirilmiş, Gemini API destekli hafif bir kod asistanı.

## Özellikler

- Sohbet panelinden aktif dosya hakkında AI yardımı alma
- AI yanıtından gelen kodu aktif dosyaya otomatik uygulama
- Çoklu dosya sekmeleri, yeniden adlandırma ve silme
- Kod kopyalama, aktif dosyayı temizleme ve satır/karakter sayacı
- LocalStorage ile sohbet ve dosyaları tarayıcıda saklama
- Gemini API anahtarını `.env` üzerinden okuma

## Kurulum

```bash
npm install
```

Proje kökünde `.env` dosyası oluştur:

```bash
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_GEMINI_MODEL=gemini-2.5-flash
```

Geliştirme sunucusunu başlat:

```bash
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışır.

## Komutlar

```bash
npm run dev
npm run build
npm run lint
```

## Notlar

AI katmanı Gemini API'ye doğrudan tarayıcıdan istek atar. Bu yaklaşım küçük denemeler için pratik olsa da gerçek üretim ortamında API anahtarını sunucu tarafında tutmak daha güvenlidir.
