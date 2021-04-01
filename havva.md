# Çalışma Planı WEBAPI (Havva)

Çalışma planı api'ları kullanıcının kendisine çalıştığı sınav ile ilgili bilgi ve kayıtları tutacak verilerin çağırılması ve yönetilmesi için kullanılıyor. Kullanıcının soru çözümleri ve konu çalışmaları direkt olarak ilgili çalışma planı ile ilişkilendirilmiş durumda, dolayısıyla doğru yapılandırılmış olması **çok önemli**.

## Çalışma Planları Listesini İste
Bu istek kullanıcının yarattığı çalışma planlarını bir liste olarak gönderecek. Bu dönen listeyi "Çalışma Planlarım" sayfasında alt alta çizdirmek için kullanıyoruz. Böylece planlardan birine dokunulduğunda, dokunulan planın detayları ile ilgili sayfaya navigasyon yapabiliriz (plan_id'yi o ekrana göndermeyi unutmamak lazım).
###### APIEP (POST)
> ss/sdb/plan/all
###### REQUEST
	 public class AuthorizedRequest {} // Parametre istemez
###### RESPONSE

Çalışma planları listesi "plans" objesi ile dönecektir. Bu liste asla **null** olmaz ama boş olabilir (Kullanıcı henüz hiç çalışma planı yaratmamış olabilir), bunu hesaba katmak gerekli. Burada "active_plan" objesiyle işimiz yok, onun amacı farklı.

            public class SdbPlansResponse : ResponseContract {

                public List<SDBPlan> plans { get; set; }

                [JsonProperty("active_plan")]
                public long ActivePlan { get; set; } = -1;
            }

## Çalışma Planını İste
Kullanıcının yarattığı çalışma planlarından biri hakkında bilgi istemek için kullanılır. PlanId'si kullanılarak istek yapılmalıdır. Plana dair bilgilere ek olarak planın içindeki tüm dersler ve çalışma planının olup olmadığına dair bilgiler de cevap olarak döner.
###### APIEP (POST)
> ss/sdb/plan

###### REQUEST
	public class SdbGetPlan : AuthorizedRequest {
		public  long  plan_id { get; set; } // Hangi plan?
	}
###### RESPONSE
	public class SdbPlanResponse : ResponseContract {
		public  SDBPlan plan { get; set; }
	}
###### CLASS
    public class SDBPlan {

        [JsonProperty("plan_id")]
        public long PlanId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("exam_uid")]
        public string ExamUid { get; set; }

        [JsonProperty("program_type")]
        public string ProgramType { get; set; }

        [JsonProperty("created")]
        public string CreatedDate { get; set; }

        [JsonProperty("lessons")]
        public List<SDBPlanLesson> Lessons { get; set; }

        [JsonProperty("exam_acr")]
        public string ExamAcronym { get; set; }

        [JsonProperty("exam_title")]
        public string ExamName { get; set; }
    }
    
	// Plan Dersi
	public class SDBPlanLesson {

        [JsonProperty("lesson_id")]
        public long LessonId { get; set; }

        [JsonIgnore]
        public long AssocFk { get; set; }

        [JsonProperty("lesson_plan")]
        public long LessonPlan { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("lesson_uid")]
        public string Uid { get; set; }

        [JsonProperty("is_hidden")]
        public bool IsHidden { get; set; }

        [JsonProperty("is_predef")]
        public bool IsPredefined { get; set; }

        [JsonProperty("order")]
        public int DisplayOrder { get; set; }
    }

## Çalışma Planı Yarat
Burası önemli, çalışma planı oluşturulurken bir kaç api devreye girmek zorunda. Kullanıcının plan yaratmak üzere seçebileceği sınavların hepsi birer benzersiz id ile sunucuda tanımlı, bu durum gelecekte istediğim zaman yeni sınavlar ekleyebilmemi sağlıyor. Dolayısıyla öncelikle bu bilgileri almak üzere bir çağrı yapmamız gerekiyor.
#### Sunucudaki Sınavları İste
Bir liste halinde bunlar yazdırılmalı, önemli olan sınav ismi ve sınavın id'si
###### APIEP (GET)
> ss/sdb/get-known-exams

###### REQUEST
	Parametre istemiyor
###### RESPONSE
            public class SdbKnownExams : ResponseContract {
                public List<KnownExams.Exam> known_exams { get; set; }
            }
###### CLASS

        // İhtiyacın olmayacak şeyleri yazmadım.
        public class Exam {

			// Sınavın kısaltılmış ismi (YKS gibi...)
            [JsonProperty("acronym")]
            public string Acronym { get; set; }

			// Sınavın id bilgisi, çok önemli çünkü plan ile
			// ilişkilendirilmek zorunda
            [JsonProperty("exam_uid")]
            public string Key { get; set; }

			// Sınavın ismi (Yükseköğretim Sınavı gibi..)
            [JsonProperty("title")]
            public string Title { get; set; } 
        }

Bu istekle aldığın sınavları title bilgilerini kullanarak listele, bir tanesi seçildiğinde onun exam_uid değerinin çalışma planına verilmesi gerek.

Kullanıcıdan planı ile ilgili ismi de aldıktan sonra, çalışma planını sunucuda oluşturmak için
###### APIEP
> ss/sdb/plans/new

###### REQUEST (POST)
Bu noktada kafanı karıştırmamak adına direkt olarak authorizedRequest içindeki parametre kısmına yazman gereken şeyleri vermeyi uygun gördüm.

       { plan: {exam_uid: $seçilenExamUid, name: $çalışmaPlanıİsmi} }


###### RESPONSE
> Burada sonuç olarak sadece başarılı mı başarısız mı diye dönecektir, dolayısıyla (json) bloğu çalışıyorsa başarılı oldu demektir. (error) bloğu çalıştıysa bir hata olmuştur (parametre kısmına bir bak).

## Plan İsmi Değiştirme
###### APIEP
> ss/sdb/plans/rename
###### REQUEST
        public class SdbRenamePlan : AuthorizedRequest {
                public long plan_id { get; set; }
                public string new_name { get; set; }
        }

###### RESPONSE
Önemli değil yüksek ihtimalle OK döner.
## Plan Silme
En kolayı bu diyebilirim :) Sadece plan id'si istiyor.
###### APIEP
> ss/sdb/plans/delete

###### REQUEST
            public class SdbDeleteStudyPlan : AuthorizedRequest {
                public long plan_id { get; set; }
            }
###### RESPONSE
Ok yada fail döner.

> Ders programları kısmına şimdilik girmek istemiyorum vizeye kadar bunları yapsan yeter zaten..