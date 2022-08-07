Bu bir node projesi olduğu için işlemlerimize ilk başta "npm init" kodu ile başlamalıyız.
daha sonra ise nodemon indirip, nodemon ile serverimizi başlatmaliyiz.

----------------------------------------------------------------------------------------------------------------------------

dotenv ile ortam değişkenlerini kullanmalıyız. dotenv.config() dosyası normalde config in altındaki config.env e bakiyor
fakat bizim config in altında bir dosyamız daha olduğu için env adinda bu yolu ona göstermeliyiz 
(config(x) => x için gösterilecek)

env dosyasının içerisindeki değişkenlere, "proess.env.degiskenAdi" seklinde ulasilabilinir.

----------------------------------------------------------------------------------------------------------------------------
PROJENİN GENEL HATLARI VE DOSYALAR

Proje 5 katmandan oluşmaktadır, 

1- biz projemize herhangi bir url girdiğimizde ilk önce routes katmanına gidecektir, bu routeslarimizda değişik route larimiz
olacak. Örneğin siz bir api/questions ile ilgili route girmisseniz bu route ilgili işlemi controller a gönderecek. Yani biz
örneğin questionslar ile ilgili bir işlem yapmak istiyor isek bu route controllers i çalıştıracak

2- Ve biz örneğin bir questions oluşturmak istedik, controller katmanından veri, models katmanına gidecektir ve oradaki schema
lara göre mongoDb veritabanı için gerekli islemler yapilacaktir.

3- Helpers katmanı: bizim yardımcı fonksiyonumuz icin var olacaktir, örneğiz biz dışarıdan farkli kütüphaneler kullanacağız
bu kütüphaneler helpers içerisinde yer alacaktır

4- proje içerisinde kendi oluşturduğumuz middlewares katmanı olacaktir, buda bir katmandır. Örneğin biz bir route
a ulaşmak istiyoruz bir başkasının sorusunu güncellemek istiyoruz. Bu mümkün değil bunu sadece kendi sahibi güncelleyebilir.
Bunun için bu route bu fonksiyonu çalıştırmadan once ilgili middleware fonksiyonunu çalıştırmaya çalışacak, ayrica middleware
söyle bir future da bulunduracak: Örneğin siz bir questions a erişmek istiyorsunuz, bu bir cok controller icerisinde yer 
alabilir, erişim işlemi. Ancak bunu her seferinde kontrol etmeyelim diye biz merkezi bir question middleware i oluşturacağız
ve oda yine middlewares içerisinde yer alacak.

----------------------------------------------------------------------------------------------------------------------------
ROUTER katmani

Eğer ki biz tüm get işlemlerimizi, server.js içerisinde yazar isek bir süre sonra bakımı oldukça zorlaşacaktır ve değişime
de oldukça kapalı olacaktır, neyin nerede olduğunu bulmakta zorlanacağız. Projenin router larını modüler hale getirmeye
çalışmalıyız.

----------------------------------------------------------------------------------------------------------------------------
CONTROLLER katmani

routerlarimiza herhangi bir istek gönderdiğimiz zaman, routerlarimizda requst repsonse larimiza göre işlemlerimizi
gerçekleştiriyoruz. Ancak uygulamamizin sürdülebilirliği ve yönetiminin kolaylığı için modüler olmasi gerekli.
Yani biz artik router larimizdaki response, request işlemlerimizi controller katmaninda yapmalıyız. Buraya yazilacak
controller fonksiyonlar belli bir router dan sonra çalışacak ve ona göre işlem yapacaklar. Örneğin bir soruyu ekleme,
bir soruyu güncelleme gibi işlemleri gerçekleştirecekler.

----------------------------------------------------------------------------------------------------------------------------
Veritabanı bağlantısı (HELPER Katmani)

veritabanımızın bağlantısı için mongoose adindaki bir npm paketinden yararlanmaliyiz, bu paket ile ilgili işlemler helpers
içeriisnde yer almalıdır.

----------------------------------------------------------------------------------------------------------------------------
Error Handling

Hata yakalama bir api projesinde en önemli kisimlardan biridir. Eğer bir projede hata yakalama olmaz ise request ve response
larini yerine getiremeyebilir. Bu durum herhangi bir web projesi için hiç iyi bir şey değildir. Bir projede çok fazla hata olur
ve bu hataları yakalayamaz isek, bu projeyi kullanan web kullanıcıları bir süre sonra sistemden gideceklerdir. Ve eğer kritik
api lar var ise bu api larin çökmesi oldukça zararlı olacaktır. O yüzden error handling konusunu projemize dahil etmeliyiz.

Express'in kendi sitesinde error handling aratır isek karşımıza gerekli makale gelecektir.

Expresste 2 türlü error handling mekanizması vardır. Birinci kullanımı senkron kodları yakalamak anlamında, eğer bizim
senkron kodlarımızda herhangi bir hata olursa express burda building olarak, error handling mekanizması var ve bunu
kendi içerisinde yakalayabiliyor, ve uygululamamız patlamıyor. Sadece burada hata fırlatılıyor ve express bunu yakalayabiliyor.

Anca express in yakalayamadığı durumlarda mevcut. Bu durum asenkron kodlarda herhangi bir problem olur ise express bunu
yakalayamıyor. Express in bunu direk olarak yakalayabilmesi için, hatayı next parametresi ile göndermemiz gerekiyor. Eğer biz
hatayı next ile express e gönderir isek, express bunu yine kendi içerisinde yakalayacaktır.

----------------------------------------------------------------------------------------------------------------------------
Password Hash

bcryptjs - npm package
----------------------------------------------------------------------------------------------------------------------------

