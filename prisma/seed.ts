import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  console.log("🧹 Cleaning existing data...");
  await prisma.comment.deleteMany();
  await prisma.anketa.deleteMany();
  await prisma.category.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.city.deleteMany();

  // 1. SEED CITIES
  console.log("🏙️  Seeding cities...");
  const cities = await Promise.all([
    prisma.city.create({
      data: {
        nameRu: "Алматы",
        nameEn: "Almaty",
        nameKk: "Алматы",
        isActive: true,
      },
    }),
    prisma.city.create({
      data: {
        nameRu: "Астана",
        nameEn: "Astana",
        nameKk: "Астана",
        isActive: true,
      },
    }),
    prisma.city.create({
      data: {
        nameRu: "Шымкент",
        nameEn: "Shymkent",
        nameKk: "Шымкент",
        isActive: true,
      },
    }),
    prisma.city.create({
      data: {
        nameRu: "Караганда",
        nameEn: "Karaganda",
        nameKk: "Қарағанды",
        isActive: true,
      },
    }),
    prisma.city.create({
      data: {
        nameRu: "Актобе",
        nameEn: "Aktobe",
        nameKk: "Ақтөбе",
        isActive: true,
      },
    }),
  ]);

  const [almaty, astana, shymkent, karaganda, aktobe] = cities;
  console.log(`✅ Created ${cities.length} cities`);

  // 2. SEED CATEGORIES
  console.log("📂 Seeding categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        nameRu: "Уборка",
        nameEn: "Cleaning",
        nameKk: "Тазалау",
        imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80",
        filterTag: "cleaning",
      },
    }),
    prisma.category.create({
      data: {
        nameRu: "Няни и уход за детьми",
        nameEn: "Nannies and childcare",
        nameKk: "Балаларға күтім",
        imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop&q=80",
        filterTag: "childcare",
      },
    }),
    prisma.category.create({
      data: {
        nameRu: "Уход за пожилыми",
        nameEn: "Elderly care",
        nameKk: "Қарттарға күтім",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&q=80",
        filterTag: "eldercare",
      },
    }),
    prisma.category.create({
      data: {
        nameRu: "Офисная помощь",
        nameEn: "Office assistance",
        nameKk: "Кеңсе көмегі",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80",
        filterTag: "office-help",
      },
    }),
    prisma.category.create({
      data: {
        nameRu: "Курьерская доставка",
        nameEn: "Courier delivery",
        nameKk: "Курьерлік жеткізу",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80",
        filterTag: "delivery",
      },
    }),
    prisma.category.create({
      data: {
        nameRu: "IT-поддержка",
        nameEn: "IT support",
        nameKk: "IT қолдау",
        imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=80",
        filterTag: "it-support",
      },
    }),
    prisma.category.create({
      data: {
        nameRu: "Репетиторство и образование",
        nameEn: "Tutoring and education",
        nameKk: "Репетиторлық және білім беру",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&q=80",
        filterTag: "tutoring",
      },
    }),
    prisma.category.create({
      data: {
        nameRu: "Ремонт и мастер",
        nameEn: "Repair and handyman",
        nameKk: "Жөндеу және шебер",
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f088037?w=800&h=600&fit=crop&q=80",
        filterTag: "repair",
      },
    }),
    prisma.category.create({
      data: {
        nameRu: "Колл-центр и удаленный ассистент",
        nameEn: "Call center and remote assistant",
        nameKk: "Қоңырау орталығы және қашықтықтан көмекші",
        imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop&q=80",
        filterTag: "call-center",
      },
    }),
    prisma.category.create({
      data: {
        nameRu: "Другое",
        nameEn: "Other",
        nameKk: "Басқа",
        imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop&q=80",
        filterTag: "other",
      },
    }),
  ]);

  const [
    cleaningCategory,
    childcareCategory,
    eldercareCategory,
    officeHelpCategory,
    deliveryCategory,
    itSupportCategory,
    tutoringCategory,
    repairCategory,
    callCenterCategory,
    otherCategory,
  ] = categories;
  console.log(`✅ Created ${categories.length} categories`);

  // 3. SEED USERS
  console.log("👥 Seeding users...");
  const admin = await prisma.user.create({
    data: {
      name: "Администратор",
      email: "admin@jobmarket.kz",
      phone: "+77001234567",
      role: "ADMIN",
      rating: 5.0,
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Айгуль Нурланова",
        email: "aigul.nurlanova@example.com",
        phone: "+77001234568",
        role: "USER",
        rating: 4.8,
      },
    }),
    prisma.user.create({
      data: {
        name: "Дмитрий Смирнов",
        email: "dmitry.smirnov@example.com",
        phone: "+77001234569",
        role: "USER",
        rating: 4.6,
      },
    }),
    prisma.user.create({
      data: {
        name: "Асель Касымова",
        email: "asel.kasymova@example.com",
        phone: "+77001234570",
        role: "USER",
        rating: 4.9,
      },
    }),
    prisma.user.create({
      data: {
        name: "Александр Петров",
        email: "alexander.petrov@example.com",
        phone: "+77001234571",
        role: "USER",
        rating: 4.5,
      },
    }),
    prisma.user.create({
      data: {
        name: "Мария Иванова",
        email: "maria.ivanova@example.com",
        phone: "+77001234572",
        role: "USER",
        rating: 4.7,
      },
    }),
    prisma.user.create({
      data: {
        name: "Нурлан Беков",
        email: "nurlan.bekov@example.com",
        phone: "+77001234573",
        role: "USER",
        rating: 4.4,
      },
    }),
    prisma.user.create({
      data: {
        name: "Елена Козлова",
        email: "elena.kozlova@example.com",
        phone: "+77001234574",
        role: "USER",
        rating: 4.8,
      },
    }),
    prisma.user.create({
      data: {
        name: "Азамат Токтаров",
        email: "azamat.toktarov@example.com",
        phone: "+77001234575",
        role: "USER",
        rating: 4.6,
      },
    }),
    prisma.user.create({
      data: {
        name: "Ольга Волкова",
        email: "olga.volkova@example.com",
        phone: "+77001234576",
        role: "USER",
        rating: 4.9,
      },
    }),
    prisma.user.create({
      data: {
        name: "Асылбек Жумабеков",
        email: "asylbek.zhumabekov@example.com",
        phone: "+77001234577",
        role: "USER",
        rating: 4.5,
      },
    }),
    prisma.user.create({
      data: {
        name: "Анна Соколова",
        email: "anna.sokolova@example.com",
        phone: "+77001234578",
        role: "USER",
        rating: 4.7,
      },
    }),
    prisma.user.create({
      data: {
        name: "Руслан Абдуллин",
        email: "ruslan.abdullin@example.com",
        phone: "+77001234579",
        role: "USER",
        rating: 4.3,
      },
    }),
  ]);

  console.log(`✅ Created 1 admin and ${users.length} regular users`);

  // 4. SEED ANKETA
  console.log("📋 Seeding anketa...");
  const anketa = await Promise.all([
    // Cleaning services
    prisma.anketa.create({
      data: {
        userId: users[0].id,
        categoryId: cleaningCategory.id,
        title: "Профессиональная уборка квартир и офисов",
        description: `Предлагаю услуги профессиональной уборки с официальным трудоустройством. Работаю ответственно, использую качественные моющие средства. 

Готов выполнить:
- Генеральная уборка квартир и домов
- Регулярная поддерживающая уборка
- Уборка офисных помещений
- Мойка окон и балконов
- Уборка после ремонта

Все работы выполняю официально, с предоставлением документов. Гарантирую качество и пунктуальность. Работаю в Алматы, выезжаю в любой район.`,
        cityId: almaty.id,
        address: "Алматы, ул. Абая, 150",
        latitude: 43.238949,
        longitude: 76.889709,
        showLocation: true,
        isActive: true,
      },
    }),
    prisma.anketa.create({
      data: {
        userId: users[1].id,
        categoryId: cleaningCategory.id,
        title: "Уборка с гарантией качества",
        description: `Опытный специалист по уборке. Работаю официально, все документы в порядке. 

Специализация:
- Ежедневная уборка
- Уборка после мероприятий
- Химчистка ковров и мебели
- Уборка коммерческих помещений

Имею опыт работы более 5 лет. Всегда прихожу вовремя, работаю аккуратно и качественно. Готова к официальному трудоустройству.`,
        cityId: astana.id,
        address: "Астана, пр. Кабанбай батыра, 32",
        latitude: 51.169392,
        longitude: 71.449074,
        showLocation: true,
        isActive: true,
      },
    }),
    // Childcare
    prisma.anketa.create({
      data: {
        userId: users[2].id,
        categoryId: childcareCategory.id,
        title: "Опытная няня с педагогическим образованием",
        description: `Профессиональная няня с высшим педагогическим образованием. Работаю официально, все документы предоставлю.

Мой опыт:
- Уход за детьми от 1 года до 12 лет
- Развивающие занятия и игры
- Помощь с домашним заданием
- Прогулки и активные игры
- Приготовление детского питания

Имею медицинскую книжку, справку о несудимости. Готова работать по официальному договору. Очень люблю детей, ответственная и терпеливая.`,
        cityId: almaty.id,
        address: "Алматы, ул. Сатпаева, 90",
        latitude: 43.222015,
        longitude: 76.851248,
        showLocation: true,
        isActive: true,
      },
    }),
    prisma.anketa.create({
      data: {
        userId: users[3].id,
        categoryId: childcareCategory.id,
        title: "Няня для вашего ребенка",
        description: `Заботливая и ответственная няня. Работаю официально, готова предоставить все необходимые документы.

Что я предлагаю:
- Полный уход за ребенком
- Развивающие занятия
- Соблюдение режима дня
- Безопасность - приоритет номер один

Имею опыт работы с детьми более 3 лет. Всегда на связи, пунктуальна, легко нахожу общий язык с детьми. Готова к официальному трудоустройству.`,
        cityId: shymkent.id,
        showLocation: false,
        isActive: true,
      },
    }),
    // Elder care
    prisma.anketa.create({
      data: {
        userId: users[4].id,
        categoryId: eldercareCategory.id,
        title: "Уход за пожилыми людьми с медицинским опытом",
        description: `Медсестра с опытом работы. Предлагаю профессиональный уход за пожилыми людьми с официальным трудоустройством.

Мои услуги:
- Помощь в быту (приготовление пищи, уборка)
- Медицинский уход (измерение давления, прием лекарств)
- Компания и общение
- Сопровождение на прогулки и в поликлинику
- Гигиенические процедуры

Имею медицинское образование, опыт работы в больнице. Работаю официально, все документы предоставлю. Очень терпеливая и внимательная.`,
        cityId: almaty.id,
        address: "Алматы, ул. Толе би, 59",
        latitude: 43.256670,
        longitude: 76.928611,
        showLocation: true,
        isActive: true,
      },
    }),
    // Office help
    prisma.anketa.create({
      data: {
        userId: users[5].id,
        categoryId: officeHelpCategory.id,
        title: "Офисный ассистент и помощник руководителя",
        description: `Опытный офисный ассистент. Готова работать официально, все документы в порядке.

Мои навыки:
- Работа с документами и делопроизводство
- Прием звонков и работа с клиентами
- Организация встреч и мероприятий
- Работа в 1С, Excel, Word
- Переводы (русский, казахский, английский)

Опыт работы в офисе более 4 лет. Ответственная, внимательная к деталям, быстро обучаюсь. Готова к официальному трудоустройству.`,
        cityId: astana.id,
        address: "Астана, ул. Кенесары, 40",
        latitude: 51.160523,
        longitude: 71.470355,
        showLocation: true,
        isActive: true,
      },
    }),
    prisma.anketa.create({
      data: {
        userId: users[6].id,
        categoryId: officeHelpCategory.id,
        title: "Секретарь и администратор",
        description: `Профессиональный секретарь с опытом работы. Работаю официально, готова предоставить рекомендации.

Обязанности:
- Ведение делопроизводства
- Работа с клиентами и партнерами
- Подготовка документов и отчетов
- Организация рабочего дня руководителя
- Работа с оргтехникой

Опыт работы более 3 лет. Владею компьютером на продвинутом уровне, знаю деловой этикет. Всегда вежлива и профессиональна.`,
        cityId: karaganda.id,
        showLocation: false,
        isActive: true,
      },
    }),
    // Delivery
    prisma.anketa.create({
      data: {
        userId: users[7].id,
        categoryId: deliveryCategory.id,
        title: "Курьерская доставка по городу",
        description: `Надежный курьер с собственным транспортом. Работаю официально, все документы предоставлю.

Услуги:
- Доставка документов и корреспонденции
- Доставка товаров и продуктов
- Срочная доставка
- Работа с наличными и безналичными расчетами

Имею водительские права категории B, собственный автомобиль. Работаю быстро, аккуратно, всегда на связи. Готов к официальному трудоустройству.`,
        cityId: almaty.id,
        address: "Алматы, ул. Розыбакиева, 247",
        latitude: 43.207500,
        longitude: 76.884167,
        showLocation: true,
        isActive: true,
      },
    }),
    prisma.anketa.create({
      data: {
        userId: users[8].id,
        categoryId: deliveryCategory.id,
        title: "Доставка на велосипеде - быстро и экологично",
        description: `Курьер на велосипеде. Быстрая доставка по центру города. Работаю официально.

Преимущества:
- Быстрая доставка в центре города
- Экологичный транспорт
- Низкие цены
- Всегда на связи

Работаю ответственно, всегда приезжаю вовремя. Готов к официальному трудоустройству.`,
        cityId: astana.id,
        showLocation: false,
        isActive: true,
      },
    }),
    // IT Support
    prisma.anketa.create({
      data: {
        userId: users[9].id,
        categoryId: itSupportCategory.id,
        title: "IT-поддержка и настройка компьютеров",
        description: `IT-специалист с опытом работы. Предлагаю услуги по настройке и ремонту компьютеров с официальным трудоустройством.

Услуги:
- Настройка компьютеров и ноутбуков
- Установка программ и операционных систем
- Удаление вирусов и настройка антивируса
- Настройка интернета и Wi-Fi
- Консультации по работе с техникой

Опыт работы более 5 лет. Работаю официально, предоставляю гарантию на работы. Всегда объясняю, что делаю.`,
        cityId: almaty.id,
        address: "Алматы, ул. Байтурсынова, 100",
        latitude: 43.238056,
        longitude: 76.920833,
        showLocation: true,
        isActive: true,
      },
    }),
    // Tutoring
    prisma.anketa.create({
      data: {
        userId: users[10].id,
        categoryId: tutoringCategory.id,
        title: "Репетитор по математике и физике",
        description: `Опытный репетитор с высшим образованием. Работаю официально, все документы предоставлю.

Предметы:
- Математика (школьная программа, подготовка к ЕНТ)
- Физика (школьная программа)
- Подготовка к экзаменам

Опыт преподавания более 6 лет. Индивидуальный подход к каждому ученику. Работаю как очно, так и онлайн. Готова к официальному трудоустройству.`,
        cityId: shymkent.id,
        address: "Шымкент, ул. Казыбек би, 25",
        latitude: 42.341389,
        longitude: 69.590278,
        showLocation: true,
        isActive: true,
      },
    }),
    prisma.anketa.create({
      data: {
        userId: users[11].id,
        categoryId: tutoringCategory.id,
        title: "Репетитор по английскому языку",
        description: `Преподаватель английского языка. Работаю официально, имею сертификаты.

Уровни:
- Начальный и средний уровень
- Разговорный английский
- Подготовка к IELTS
- Бизнес-английский

Опыт преподавания более 4 лет. Использую современные методики, индивидуальный подход. Работаю очно и онлайн.`,
        cityId: aktobe.id,
        showLocation: false,
        isActive: true,
      },
    }),
    // Repair
    prisma.anketa.create({
      data: {
        userId: users[0].id,
        categoryId: repairCategory.id,
        title: "Мастер на все руки - ремонт и установка",
        description: `Опытный мастер. Выполняю различные виды ремонта с официальным трудоустройством.

Услуги:
- Мелкий ремонт в квартире
- Установка мебели и техники
- Сантехнические работы
- Электромонтажные работы
- Покраска и отделка

Опыт работы более 7 лет. Все работы выполняю качественно, предоставляю гарантию. Работаю официально, все документы в порядке.`,
        cityId: karaganda.id,
        address: "Караганда, пр. Бухар жырау, 45",
        latitude: 49.801944,
        longitude: 73.102222,
        showLocation: true,
        isActive: true,
      },
    }),
    // Call center
    prisma.anketa.create({
      data: {
        userId: users[1].id,
        categoryId: callCenterCategory.id,
        title: "Оператор call-центра и удаленный ассистент",
        description: `Опытный оператор call-центра. Работаю удаленно, готова к официальному трудоустройству.

Услуги:
- Прием входящих звонков
- Консультирование клиентов
- Обработка заявок
- Работа с CRM-системами
- Удаленная административная поддержка

Опыт работы более 3 лет. Владею русским, казахским и английским языками. Работаю ответственно, всегда на связи.`,
        cityId: almaty.id,
        showLocation: false,
        isActive: true,
      },
    }),
    prisma.anketa.create({
      data: {
        userId: users[2].id,
        categoryId: callCenterCategory.id,
        title: "Виртуальный ассистент и помощник",
        description: `Виртуальный ассистент для вашего бизнеса. Работаю удаленно, официально.

Обязанности:
- Обработка электронной почты
- Работа с документами
- Ведение соцсетей
- Планирование и организация
- Клиентская поддержка

Опыт работы более 2 лет. Быстро обучаюсь, ответственная, всегда на связи. Готова к официальному трудоустройству.`,
        cityId: astana.id,
        showLocation: false,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${anketa.length} anketa`);

  // 5. SEED COMMENTS
  console.log("💬 Seeding comments...");
  const comments = await Promise.all([
    // Comments for anketa[0] (cleaning - Aigul)
    prisma.comment.create({
      data: {
        authorId: users[1].id,
        recipientId: users[0].id,
        anketaId: anketa[0].id,
        rating: 5,
        text: "Очень ответственный специалист, все сделал вовремя. Уборка выполнена на отлично, рекомендую!",
      },
    }),
    prisma.comment.create({
      data: {
        authorId: users[2].id,
        recipientId: users[0].id,
        anketaId: anketa[0].id,
        rating: 5,
        text: "Быстро связались, удобно работать официально. Все документы предоставлены, работа выполнена качественно.",
      },
    }),
    prisma.comment.create({
      data: {
        authorId: users[3].id,
        recipientId: users[0].id,
        anketaId: anketa[0].id,
        rating: 4,
        text: "Хорошая работа, пришла вовремя. Единственное - можно было бы чуть быстрее, но качество отличное.",
      },
    }),
    // Comments for anketa[2] (childcare - Asel)
    prisma.comment.create({
      data: {
        authorId: users[0].id,
        recipientId: users[2].id,
        anketaId: anketa[2].id,
        rating: 5,
        text: "Замечательная няня! Ребенок очень доволен, всегда с радостью идет на занятия. Очень ответственная и добрая.",
      },
    }),
    prisma.comment.create({
      data: {
        authorId: users[1].id,
        recipientId: users[2].id,
        anketaId: anketa[2].id,
        rating: 5,
        text: "Профессиональный подход, все документы в порядке. Ребенок под присмотром, мы спокойны. Спасибо!",
      },
    }),
    // Comments for anketa[4] (elder care - Maria)
    prisma.comment.create({
      data: {
        authorId: users[0].id,
        recipientId: users[4].id,
        anketaId: anketa[4].id,
        rating: 5,
        text: "Очень внимательная и заботливая. Бабушке очень нравится, всегда приходит вовремя. Медицинский опыт чувствуется.",
      },
    }),
    prisma.comment.create({
      data: {
        authorId: users[1].id,
        recipientId: users[4].id,
        anketaId: anketa[4].id,
        rating: 4,
        text: "Хороший специалист, работает официально. Все документы предоставлены, мы довольны.",
      },
    }),
    // Comments for anketa[5] (office help - Nurlan)
    prisma.comment.create({
      data: {
        authorId: users[0].id,
        recipientId: users[5].id,
        anketaId: anketa[5].id,
        rating: 4,
        text: "Ответственный сотрудник, быстро входит в курс дела. Работает официально, все в порядке.",
      },
    }),
    // Comments for anketa[7] (delivery - Azamat)
    prisma.comment.create({
      data: {
        authorId: users[1].id,
        recipientId: users[7].id,
        anketaId: anketa[7].id,
        rating: 5,
        text: "Быстрая доставка, всегда на связи. Работает официально, все документы в порядке. Рекомендую!",
      },
    }),
    prisma.comment.create({
      data: {
        authorId: users[2].id,
        recipientId: users[7].id,
        anketaId: anketa[7].id,
        rating: 4,
        text: "Надежный курьер, привез вовремя. Удобно, что работает официально.",
      },
    }),
    // Comments for anketa[9] (IT support - Asylbek)
    prisma.comment.create({
      data: {
        authorId: users[0].id,
        recipientId: users[9].id,
        anketaId: anketa[9].id,
        rating: 5,
        text: "Отличный специалист! Все настроил быстро и качественно. Объяснил все доступно. Работает официально.",
      },
    }),
    prisma.comment.create({
      data: {
        authorId: users[1].id,
        recipientId: users[9].id,
        anketaId: anketa[9].id,
        rating: 4,
        text: "Хорошая работа, компьютер работает отлично. Все документы предоставлены.",
      },
    }),
    // Comments for anketa[10] (tutoring - Anna)
    prisma.comment.create({
      data: {
        authorId: users[0].id,
        recipientId: users[10].id,
        anketaId: anketa[10].id,
        rating: 5,
        text: "Отличный репетитор! Ребенок начал понимать математику. Очень терпеливая и профессиональная.",
      },
    }),
    // Comments for anketa[12] (repair - Aigul)
    prisma.comment.create({
      data: {
        authorId: users[1].id,
        recipientId: users[0].id,
        anketaId: anketa[12].id,
        rating: 5,
        text: "Мастер на все руки! Все сделал качественно и быстро. Работает официально, предоставил гарантию.",
      },
    }),
    prisma.comment.create({
      data: {
        authorId: users[2].id,
        recipientId: users[0].id,
        anketaId: anketa[12].id,
        rating: 4,
        text: "Хорошая работа, все аккуратно. Рекомендую.",
      },
    }),
    // Comments for anketa[13] (call center - Dmitry)
    prisma.comment.create({
      data: {
        authorId: users[0].id,
        recipientId: users[1].id,
        anketaId: anketa[13].id,
        rating: 4,
        text: "Ответственный оператор, работает официально. Всегда на связи, клиенты довольны.",
      },
    }),
  ]);

  // Update user ratings based on comments
  for (const user of users) {
    const userComments = comments.filter((c: typeof comments[0]) => c.recipientId === user.id);
    if (userComments.length > 0) {
      const avgRating =
        userComments.reduce((sum: number, c: typeof comments[0]) => sum + c.rating, 0) / userComments.length;
      await prisma.user.update({
        where: { id: user.id },
        data: { rating: Math.round(avgRating * 10) / 10 },
      });
    }
  }

  console.log(`✅ Created ${comments.length} comments`);

  // 6. SEED SITE SETTINGS
  console.log("⚙️  Seeding site settings...");
  await prisma.siteSettings.create({
    data: {
      id: "singleton",
      phone: "+7 (700) 123-45-67",
      address: JSON.stringify({
        ru: "Алматы, ул. Абая, 150, офис 205",
        en: "Almaty, Abay Ave, 150, office 205",
        kk: "Алматы, Абай даңғылы, 150, 205 кеңсе",
      }),
      whatsappNumber: "+77001234567",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.5!2d76.889709!3d43.238949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDE0JzIwLjIiTiA3NsKwNTMnMjMuNSJF!5e0!3m2!1sru!2skz!4v1234567890",
      officeLat: 43.238949,
      officeLng: 76.889709,
      footerLinks: JSON.stringify([
        { label: { ru: "О нас", en: "About", kk: "Біз туралы" }, href: "/about" },
        { label: { ru: "FAQ", en: "FAQ", kk: "Жиі қойылатын сұрақтар" }, href: "/faq" },
        { label: { ru: "Контакты", en: "Contacts", kk: "Байланыс" }, href: "/contacts" },
      ]),
      homepageTexts: JSON.stringify({
        ru: {
          heroTitle: "Найдите надежного специалиста с официальным трудоустройством",
          heroSubtitle: "Платформа для поиска проверенных специалистов в различных сферах услуг",
          ctaText: "Начать поиск",
        },
        en: {
          heroTitle: "Find a reliable anketa with official employment",
          heroSubtitle: "Platform for finding verified anketas in various service sectors",
          ctaText: "Start searching",
        },
        kk: {
          heroTitle: "Ресми жұмысқа орналастырумен сенімді маман табыңыз",
          heroSubtitle: "Әртүрлі қызметтер саласында тексерілген мамандарды табуға арналған платформа",
          ctaText: "Іздеуді бастау",
        },
      }),
      faq: JSON.stringify({
        ru: [
          {
            question: "Как работает платформа?",
            answer: "Платформа соединяет специалистов с клиентами. Все aнкеты готовы к официальному трудоустройству. Вы можете легко найти нужного специалиста, просмотреть его профиль и связаться через WhatsApp.",
          },
          {
            question: "Безопасно ли это?",
            answer: "Да, все aнкеты проверяются и предоставляют документы. Мы рекомендуем всегда работать официально с заключением договора для защиты ваших прав.",
          },
          {
            question: "Сколько это стоит?",
            answer: "Использование платформы бесплатно как для клиентов, так и для специалистов. Вы оплачиваете только услуги специалиста напрямую.",
          },
          {
            question: "Как связаться со специалистом?",
            answer: "Просто нажмите кнопку 'Связаться через WhatsApp' в профиле специалиста. Вы сразу перейдете в чат и сможете обсудить все детали работы.",
          },
          {
            question: "Как оставить отзыв?",
            answer: "После работы со специалистом вы можете оставить отзыв в его профиле. Честные отзывы помогают другим пользователям сделать правильный выбор и повышают качество услуг на платформе.",
          },
          {
            question: "Что такое официальное трудоустройство?",
            answer: "Это работа по трудовому договору или договору подряда с предоставлением всех необходимых документов. Официальное оформление защищает права как работника, так и заказчика.",
          },
          {
            question: "Как стать специалистом на платформе?",
            answer: "Зарегистрируйтесь на платформе, создайте профиль специалиста, заполните информацию о себе и своих услугах. После проверки администратором ваш профиль станет видимым для клиентов.",
          },
          {
            question: "Что делать, если возникли проблемы?",
            answer: "Свяжитесь с нами через WhatsApp или форму обратной связи на странице контактов. Мы оперативно поможем решить любые вопросы и разберемся в ситуации.",
          },
        ],
        en: [
          {
            question: "How does the platform work?",
            answer: "The platform connects anketas with clients. All anketas are ready for official employment. You can easily find the right anketa, view their profile and contact via WhatsApp.",
          },
          {
            question: "Is it safe?",
            answer: "Yes, all anketas are verified and provide documents. We recommend always working officially with a contract to protect your rights.",
          },
          {
            question: "How much does it cost?",
            answer: "Using the platform is free for both clients and anketas. You only pay for the anketa's services directly.",
          },
          {
            question: "How to contact a anketa?",
            answer: "Just click the 'Contact via WhatsApp' button on the anketa's profile. You'll go directly to the chat and can discuss all work details.",
          },
          {
            question: "How to leave a review?",
            answer: "After working with a anketa, you can leave a review on their profile. Honest reviews help other users make the right choice and improve service quality on the platform.",
          },
          {
            question: "What is official employment?",
            answer: "It's work under an employment contract or service agreement with all necessary documents. Official registration protects the rights of both workers and clients.",
          },
          {
            question: "How to become a anketa on the platform?",
            answer: "Register on the platform, create a anketa profile, fill in information about yourself and your services. After admin verification, your profile will become visible to clients.",
          },
          {
            question: "What to do if problems arise?",
            answer: "Contact us via WhatsApp or the contact form on the contacts page. We will promptly help solve any issues and look into the situation.",
          },
        ],
        kk: [
          {
            question: "Платформа қалай жұмыс істейді?",
            answer: "Платформа мамандарды клиенттермен байланыстырады. Барлық мамандар ресми жұмысқа орналастыруға дайын. Сіз оңай қажетті маманды таба аласыз, оның профилін қарап, WhatsApp арқылы байланыса аласыз.",
          },
          {
            question: "Бұл қауіпсіз бе?",
            answer: "Иә, барлық мамандар тексереді және құжаттарды ұсынады. Біз құқықтарыңызды қорғау үшін әрқашан келісім-шартпен ресми жұмыс істеуді ұсынамыз.",
          },
          {
            question: "Бұл қанша тұрады?",
            answer: "Платформаны пайдалану клиенттер мен мамандар үшін тегін. Сіз тек маман қызметтері үшін тікелей төлейсіз.",
          },
          {
            question: "Маманмен қалай байланысуға болады?",
            answer: "Маманның профиліндегі 'WhatsApp арқылы байланысу' батырмасын басыңыз. Сіз тікелей чатқа өтіп, жұмыстың барлық мәселелерін талқылай аласыз.",
          },
          {
            question: "Пікір қалай қалдыруға болады?",
            answer: "Маманмен жұмыс істегеннен кейін оның профилінде пікір қалдыра аласыз. Адал пікірлер басқа пайдаланушыларға дұрыс таңдау жасауға көмектеседі және платформадағы қызмет сапасын арттырады.",
          },
          {
            question: "Ресми жұмысқа орналастыру деген не?",
            answer: "Бұл барлық қажетті құжаттарды ұсына отырып, еңбек келісім-шарты немесе қызмет келісім-шарты бойынша жұмыс. Ресми ресімдеу жұмысшылар мен клиенттердің құқықтарын қорғайды.",
          },
          {
            question: "Платформада маман қалай болуға болады?",
            answer: "Платформада тіркеліңіз, маман профилін жасаңыз, өзіңіз және қызметтеріңіз туралы ақпаратты толтырыңыз. Әкімші тексергеннен кейін сіздің профиліңіз клиенттерге көрінетін болады.",
          },
          {
            question: "Мәселелер туындаса не істеу керек?",
            answer: "WhatsApp арқылы немесе байланыс бетіндегі кері байланыс формасы арқылы бізбен хабарласыңыз. Біз кез келген мәселелерді шешуге тез көмектесеміз және жағдайды қарастырамыз.",
          },
        ],
      }),
      about: JSON.stringify({
        ru: "Мы создаем возможности для официального трудоустройства в сфере услуг. Наша миссия - сделать рынок услуг более прозрачным и безопасным.",
        en: "We create opportunities for official employment in the service sector. Our mission is to make the service market more transparent and safe.",
        kk: "Біз қызметтер саласында ресми жұмысқа орналастыру мүмкіндіктерін жасаймыз. Біздің миссиямыз - қызметтер нарығын ашық және қауіпсіз ету.",
      }),
    },
  });
  console.log("✅ Created site settings");

  console.log("\n🎉 Database seed completed successfully!");
  console.log(`\n📊 Summary:`);
  console.log(`   - Cities: ${cities.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Users: ${users.length + 1} (1 admin + ${users.length} regular)`);
  console.log(`   - Anketa: ${anketa.length}`);
  console.log(`   - Comments: ${comments.length}`);
  console.log(`   - Page content: 3 pages`);
  console.log(`   - Site settings: 1`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

