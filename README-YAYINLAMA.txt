ARMEK SİTE + YÖNETİM PANELİ

Bu paket Netlify üzerinde ücretsiz yayınlanacak şekilde hazırlanmıştır.
Yönetim paneli adresi: https://SITENIZ.netlify.app/admin/

Yayınlama için gerekenler:
1) GitHub hesabı açılır.
2) Bu klasör GitHub'da armek-site adlı depoya yüklenir.
3) Netlify'da Add new site > Import an existing project ile GitHub deposu seçilir.
4) Publish directory boş veya . olarak bırakılır ve Deploy yapılır.
5) Netlify > Site configuration > Identity bölümünde Identity etkinleştirilir.
6) Registration preferences "Invite only" yapılır.
7) Services > Git Gateway etkinleştirilir.
8) Identity > Invite users bölümünden kendi e-posta adresiniz davet edilir.
9) Gelen e-postadaki bağlantı ile şifre oluşturulur.
10) /admin/ adresinden giriş yapılır.

Panelden değişen içerikler Kaydet/Yayınla denildiğinde GitHub'a yazılır ve site otomatik yeniden yayınlanır.

.com alan adı daha sonra Netlify > Domain management > Add a domain bölümünden bağlanır.

NOT: index.html bilgisayarda çift tıklanarak önizlenebilir. /admin paneli yalnızca site Netlify üzerinde yayınlandıktan ve Netlify Identity/Git Gateway kurulduktan sonra çalışır.
