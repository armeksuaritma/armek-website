# ARMEK SEO PRO — Kurulum

Bu paket mevcut ürün, iş, fotoğraf ve ayar JSON dosyalarınızı SİLMEZ. Paket bunları GitHub Actions sırasında okuyup gerçek HTML sayfaları üretir.

## Yükleme
ZIP içindeki tüm dosya ve klasörleri deponun ana dizinine yükleyin. Aynı isimli `index.html`, `app.js`, `styles.css` ve `admin/config.yml` dosyalarının üzerine yazın. Mevcut `products.json`, `works.json`, `content.json`, `home.json`, `settings.json`, `uploads/` dosyalarını silmeyin.

## GitHub Pages ayarı (bir kez)
GitHub > Settings > Pages > Build and deployment > Source bölümünde **GitHub Actions** seçin.

Her panel kaydından sonra workflow otomatik çalışır ve şunları üretir:
- /urunler/
- /urun/urun-adi/
- /yaptigimiz-isler/
- /isler/is-basligi/
- /hizmetler/ ve hizmet detayları
- /bilgi/ ve bilgi yazıları
- sitemap.xml, robots.txt, feed.xml

## Önemli
Google sıralamasını hiçbir yazılım garanti edemez. Bu sürüm teknik altyapıyı Google'ın önerilerine uygun hale getirir; sonuçlar rekabet, işletme profili, gerçek yorumlar, içerik kalitesi, yaş ve bağlantılar gibi dış etkenlere de bağlıdır.
