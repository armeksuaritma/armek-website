# ARMEK Su Arıtma Web Sitesi

Bu proje GitHub Pages üzerinde doğrudan yayınlanacak statik web sitesidir.

## Yayınlama
1. Bu ZIP içindeki tüm dosyaları GitHub deposunun ana dizinine yükleyin.
2. GitHub: Settings → Pages.
3. Source: Deploy from a branch.
4. Branch: main, Folder: /(root).
5. Save.

`CNAME` dosyası özel alan adını `armeksuaritma.com.tr` olarak ayarlar.

## İçerik
Ana site içeriği `content.json` dosyasındadır. Fotoğraflar `uploads/` klasöründedir.

## Yönetici paneli
`/admin/` arayüzü projede bulunur; ancak GitHub Pages üzerinde güvenli giriş ve kaydetme için ayrıca GitHub OAuth yetkilendirmesi gerekir. Bu ayar yapılmadan içerikleri GitHub üzerinden `content.json` dosyasını düzenleyerek değiştirebilirsiniz.
