
const fs = require('fs');

const missing33 = {
  heroBadge1: {
    zh: '养生与美食',
    ru: 'ОТДЫХ И РЕСТОРАНЫ',
    fr: 'BIEN-ÊTRE & GASTRONOMIE',
    am: 'ጤና እና ምግብ'
  },
  heroTitle1: {
    zh: '探索 10,000+ 买一送一优惠',
    ru: 'Более 10 000 предложений «1+1 бесплатно»',
    fr: 'Découvrez plus de 10 000 offres 1 acheté = 1 offert',
    am: 'ከ 10,000 በላይ 1 ሲገዙ 1 በነፃ ቅናሾችን ያግኙ'
  },
  heroSubtitle1: {
    zh: '阿联酋顶级餐厅、水疗中心及家庭场所的认证优惠',
    ru: 'Проверенные скидки в лучших ресторанах, спа и семейных центрах ОАЭ',
    fr: 'Réductions vérifiées dans les meilleurs restaurants, spas et parcs familiaux aux EAU',
    am: 'በመላው ኤምሬትስ ባሉ ምርጥ ምግብ ቤቶች እና መዝናኛዎች ላይ የተረጋገጡ ቅናሾች'
  },
  heroBadge2: {
    zh: '家庭与水上乐园',
    ru: 'СЕМЬЯ И АКВАПАРКИ',
    fr: 'FAMILLE & PARCS AQUATIQUES',
    am: 'ቤተሰብ እና የውሃ ፓርኮች'
  },
  heroTitle2: {
    zh: '热门景点最高享 50% 折扣',
    ru: 'Скидки до 50% на главные достопримечательности',
    fr: 'Jusqu\'à 50% de réduction sur les meilleures attractions',
    am: 'በዋና ዋና መስህቦች ላይ እስከ 50% ቅናሽ'
  },
  heroSubtitle2: {
    zh: '水世界冒险乐园、IMG冒险乐园与度假酒店的即时电子券',
    ru: 'Мгновенные электронные ваучеры в Aquaventure, IMG Worlds и отели',
    fr: 'Bons numériques instantanés pour Aquaventure, IMG Worlds et séjours',
    am: 'ለአኳቬንቸር፣ ለአይኤምጂ ወርልድስ እና ለሆቴል ቆይታዎች ፈጣን ዲጂታል ቫውቸሮች'
  },
  heroBadge3: {
    zh: '精品早午餐',
    ru: 'ИЗЫСКАННЫЕ БРАНЧИ',
    fr: 'BRUNCHS GOURMETS',
    am: 'ምርጥ ብራንች እና ካፌዎች'
  },
  heroTitle3: {
    zh: '买一送一餐饮与咖啡优惠券',
    ru: 'Ваучеры «1+1 бесплатно» на рестораны и кофе',
    fr: 'Bons 1 acheté = 1 offert pour restaurants et cafés',
    am: '1 ሲገዙ 1 በነፃ የምግብ እና የቡና ቫውቸሮች'
  },
  heroSubtitle3: {
    zh: '在阿联酋 500 多家顶级咖啡馆和餐厅享受双人特惠',
    ru: 'Откройте предложения «два по цене одного» в 500+ кафе и ресторанах ОАЭ',
    fr: 'Profitez d\'offres 2 pour le prix d\'1 dans plus de 500 cafés et restaurants aux EAU',
    am: 'በ 500+ ምርጥ የኤምሬትስ ካፌዎች እና ሬስቶራንቶች የ 2 ለ 1 ቅናሾችን ያግኙ'
  },
  getVouchersNow: {
    zh: '立即领取优惠券',
    ru: 'Получить ваучеры',
    fr: 'Obtenir les bons',
    am: 'ቫውቸሮችን ያግኙ'
  },
  freeTrialTitle: {
    zh: '免费领取 2 张兑换券',
    ru: 'Получите 2 бесплатных ваучера',
    fr: 'Obtenez 2 bons d\'échange gratuits',
    am: '2 ነፃ የቫውቸር ቅናሾችን ያግኙ'
  },
  freeTrialDesc: {
    zh: '在阿联酋顶级家庭场所享受 30 天免费电子券体验。',
    ru: 'Наслаждайтесь 30 днями бесплатных ваучеров в лучших семейных центрах ОАЭ.',
    fr: 'Profitez de 30 jours de bons numériques gratuits dans les meilleurs lieux familiaux des EAU.',
    am: 'በምርጥ የኤምሬትስ የቤተሰብ ቦታዎች ለ 30 ቀናት በነጻ ዲጂታል ቫውቸሮች ይደሰቱ።'
  },
  signUpFree: {
    zh: '免费注册',
    ru: 'Зарегистрироваться',
    fr: 'S\'inscrire',
    am: 'በነፃ ይመዝገቡ'
  },
  exploreCategories: {
    zh: '浏览分类',
    ru: 'Категории',
    fr: 'Explorer les catégories',
    am: 'ምድቦችን ያስሱ'
  },
  unmissableOffers: {
    zh: '精选特惠',
    ru: 'Выгодные предложения',
    fr: 'Offres à ne pas manquer',
    am: 'ልዩ ቅናሾች'
  },
  discoverNearby: {
    zh: '探索附近的家庭场所',
    ru: 'Семейные места рядом с вами',
    fr: 'Découvrez les lieux familiaux à proximité',
    am: 'በአቅራቢያ ያሉ የቤተሰብ ቦታዎችን ያግኙ'
  },
  discoverNearbyDesc: {
    zh: '探索您身边的身临其境的主题公园、美食券与儿童游乐中心。',
    ru: 'Тематические парки, купоны на рестораны и игровые центры рядом с вами.',
    fr: 'Explorez les parcs à thème, bons de restauration et aires de jeux près de chez vous.',
    am: 'በአቅራቢያዎ ያሉ የመዝናኛ ፓርኮችን፣ የምግብ ቫውቸሮችን እና የመጫወቻ ማዕከላትን ያስሱ።'
  },
  openMap: {
    zh: '打开互动地图',
    ru: 'Открыть интерактивную карту',
    fr: 'Ouvrir la carte interactive',
    am: 'ካርታውን ይክፈቱ'
  },
  vipMembershipTitle: {
    zh: 'Spotera VIP 会员',
    ru: 'VIP-членство Spotera',
    fr: 'Adhésion VIP Spotera',
    am: 'የስፖቴራ ቪአይፒ አባልነት'
  },
  vipFeature1: {
    zh: '10,000+ 买一送一特惠',
    ru: 'Более 10 000 предложений 1+1',
    fr: 'Plus de 10 000 offres 1 acheté = 1 offert',
    am: '10,000+ 1 ሲገዙ 1 በነፃ ቅናሾች'
  },
  vipFeature2: {
    zh: '即时电子券兑换',
    ru: 'Мгновенное погашение ваучеров',
    fr: 'Utilisation instantanée des bons numériques',
    am: 'ፈጣን የዲጂታል ቫውቸር አጠቃቀም'
  },
  vipFeature3: {
    zh: 'VIP 专属客服优先支持',
    ru: 'Приоритетная поддержка клиентов',
    fr: 'Service client prioritaire',
    am: 'ቅድሚያ የሚሰጠው የደንበኞች ድጋፍ'
  },
  startFreeTrial: {
    zh: '开启免费试用',
    ru: 'Начать бесплатный период',
    fr: 'Démarrer l\'essai gratuit',
    am: 'ነፃ ሙከራ ይጀምሩ'
  },
  catNearby: {
    zh: '附近',
    ru: 'Рядом',
    fr: 'À proximité',
    am: 'አቅራቢያ'
  },
  catAttractions: {
    zh: '景点与乐园',
    ru: 'Достопримечательности',
    fr: 'Attractions',
    am: 'መስህቦች'
  },
  catOffers: {
    zh: '专属优惠',
    ru: 'Акции',
    fr: 'Offres',
    am: 'ቅናሾች'
  },
  catStaycation: {
    zh: '度假酒店',
    ru: 'Отели и отдых',
    fr: 'Séjours',
    am: 'የሆቴል ቆይታ'
  },
  catSpa: {
    zh: '水疗与养生',
    ru: 'Спа и релакс',
    fr: 'Spa & Bien-être',
    am: 'ስፓ እና ጤና'
  },
  catKids: {
    zh: '儿童游乐',
    ru: 'Детские развлечения',
    fr: 'Jeux pour enfants',
    am: 'የልጆች ጨዋታዎች'
  },
  catBirthday: {
    zh: '生日派对',
    ru: 'Дни рождения',
    fr: 'Fêtes d\'anniversaire',
    am: 'የልደት በዓላት'
  },
  catSummerCamps: {
    zh: '夏令营',
    ru: 'Летние лагеря',
    fr: 'Camps d\'été',
    am: 'የበጋ ካምፖች'
  },
  catWorkshops: {
    zh: '创意工作坊',
    ru: 'Мастер-классы',
    fr: 'Ateliers',
    am: 'ስልጠናዎች'
  },
  catEntertainment: {
    zh: '娱乐活动',
    ru: 'Развлечения',
    fr: 'Divertissement',
    am: 'መዝናኛ'
  }
};

const comprehensiveAdditions = {
  authWelcome: {
    en: 'Welcome to Spotera Deals',
    ar: 'مرحباً بك في عروض سبوتيرا',
    zh: '欢迎来到 Spotera Deals',
    ru: 'Добро пожаловать в Spotera Deals',
    fr: 'Bienvenue sur Spotera Deals',
    am: 'እንኳን ወደ ስፖቴራ ቅናሾች በደህና መጡ'
  },
  authTagline: {
    en: 'More fun, more together. Discover UAE family attractions, play areas, waterparks, and exclusive passes.',
    ar: 'متعة أكثر، معاً أكثر. اكتشف معالم الإمارات العائلية ومناطق اللعب والحدائق المائية والباقات الحصرية.',
    zh: '更多欢乐，更多陪伴。探索阿联酋家庭景点、游乐区、水上乐园与独家通票。',
    ru: 'Больше радости вместе. Семейные аттракционы, игровые зоны, аквапарки и эксклюзивные абонементы в ОАЭ.',
    fr: 'Plus de plaisir, ensemble. Découvrez les attractions familiales des EAU, aires de jeux, parcs aquatiques et pass exclusifs.',
    am: 'የበለጠ ደስታ ፣ አብረን። የኤምሬትስ የቤተሰብ መስህቦችን፣ የመጫወቻ ቦታዎችን፣ የውሃ ፓርኮችን እና ልዩ ማለፊያዎችን ያግኙ።'
  },
  authOrEmail: {
    en: 'Or with email',
    ar: 'أو عبر البريد الإلكتروني',
    zh: '或使用电子邮箱',
    ru: 'Или по электронной почте',
    fr: 'Ou par e-mail',
    am: 'ወይም በኢሜይል'
  },
  fullNameLabel: {
    en: 'Full Name / Family Name',
    ar: 'الاسم الكامل / اسم العائلة',
    zh: '全名 / 家庭名称',
    ru: 'ФИО / Название семьи',
    fr: 'Nom complet / Nom de famille',
    am: 'ሙሉ ስም / የቤተሰብ ስም'
  },
  fullNamePlaceholder: {
    en: 'e.g. Sarah & Family',
    ar: 'مثال: سارة والعائلة',
    zh: '例如：莎拉和家人',
    ru: 'Например: Сара и семья',
    fr: 'Ex. : Sarah et famille',
    am: 'ለምሳሌ ሳራ እና ቤተሰብ'
  },
  emailLabel: {
    en: 'Email Address',
    ar: 'البريد الإلكتروني',
    zh: '电子邮箱地址',
    ru: 'Адрес электронной почты',
    fr: 'Adresse e-mail',
    am: 'የኢሜይል አድራሻ'
  },
  passwordLabel: {
    en: 'Password',
    ar: 'كلمة المرور',
    zh: '密码',
    ru: 'Пароль',
    fr: 'Mot de passe',
    am: 'የይለፍ ቃል'
  },
  passwordPlaceholder: {
    en: 'Minimum 6 characters',
    ar: '6 أحرف على الأقل',
    zh: '至少 6 个字符',
    ru: 'Не менее 6 символов',
    fr: 'Au moins 6 caractères',
    am: 'ቢያንስ 6 ቁምፊዎች'
  },
  forgotPasswordLink: {
    en: 'Forgot?',
    ar: 'نسيت؟',
    zh: '忘记密码？',
    ru: 'Забыли?',
    fr: 'Oublié ?',
    am: 'ረሱት?'
  },
  forgotPasswordMsg: {
    en: 'Password reset instructions sent to your email.',
    ar: 'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',
    zh: '密码重置说明已发送至您的邮箱。',
    ru: 'Инструкции по сбросу пароля отправлены на ваш email.',
    fr: 'Instructions de réinitialisation envoyées à votre adresse e-mail.',
    am: 'የይለፍ ቃል ዳግም ማስጀመሪያ መመሪያዎች ወደ ኢሜይልዎ ተልከዋል።'
  },
  signInTab: {
    en: 'Sign In',
    ar: 'تسجيل الدخول',
    zh: '登录',
    ru: 'Войти',
    fr: 'Se connecter',
    am: 'ይግቡ'
  },
  signUpTab: {
    en: 'Sign Up',
    ar: 'إنشاء حساب',
    zh: '注册',
    ru: 'Регистрация',
    fr: 'Créer un compte',
    am: 'ይመዝገቡ'
  },
  familyFirst: {
    en: 'Family First',
    ar: 'العائلة أولاً',
    zh: '家庭至上',
    ru: 'Семья превыше всего',
    fr: 'La famille d\'abord',
    am: 'ቤተሰብ ቅድሚያ ይሰጠዋል'
  },
  familyFirstDesc: {
    en: 'Curated places kids love & parents trust',
    ar: 'وجهات مختارة يحبها الأطفال ويثق بها الآباء',
    zh: '孩子们喜爱、家长信赖的严选场所',
    ru: 'Проверенные места, которые любят дети и которым доверяют родители',
    fr: 'Des lieux sélectionnés adorés des enfants et approuvés par les parents',
    am: 'ልጆች የሚወዷቸው እና ወላጆች የሚያምኗቸው የተመረጡ ቦታዎች'
  },
  instantPasses: {
    en: 'Instant Passes',
    ar: 'تصاريح فورية',
    zh: '即时通行证',
    ru: 'Мгновенные пропуска',
    fr: 'Pass instantanés',
    am: 'ፈጣን ማለፊያዎች'
  },
  instantPassesDesc: {
    en: 'Show mobile pass at entry with no printing',
    ar: 'أظهر التصريح عبر الهاتف دون الحاجة للطباعة',
    zh: '入场出示手机电子码，无需打印',
    ru: 'Покажите пропуск на телефоне на входе без распечатки',
    fr: 'Présentez votre pass sur mobile à l\'entrée sans impression',
    am: 'ማተም ሳያስፈልግ የሞባይል ማለፊያ በመግቢያው ላይ ያሳዩ'
  },
  bestRates: {
    en: 'Best Rates',
    ar: 'أفضل الأسعار',
    zh: '最优价格',
    ru: 'Лучшие цены',
    fr: 'Meilleurs tarifs',
    am: 'ምርጥ ተመኖች'
  },
  bestRatesDesc: {
    en: 'Direct UAE family savings & vouchers',
    ar: 'خصومات وقسائم عائلية مباشرة في الإمارات',
    zh: '阿联酋家庭专属直减与优惠券',
    ru: 'Прямая выгода и семейные ваучеры в ОАЭ',
    fr: 'Économies et bons familiaux directs aux EAU',
    am: 'ቀጥተኛ የኤምሬትስ የቤተሰብ ቁጠባ እና ቫውቸሮች'
  },
  guestBannerTitle: {
    en: 'Browse as Guest',
    ar: 'تصفح كزائر',
    zh: '以访客身份浏览',
    ru: 'Просмотр в режиме гостя',
    fr: 'Naviguer en tant qu\'invité',
    am: 'እንደ እንግዳ ያስሱ'
  },
  guestBannerDesc: {
    en: 'You can explore deals and attractions. Sign in to save favorites and redeem vouchers.',
    ar: 'يمكنك استكشاف العروض والأنشطة. سجّل الدخول لحفظ المفضلة واسترداد القسائم.',
    zh: '您可以自由探索所有优惠和景点。登录后可收藏心仪项目并兑换礼券。',
    ru: 'Вы можете просматривать акции и места. Войдите, чтобы сохранять в избранное и использовать ваучеры.',
    fr: 'Vous pouvez explorer les offres et attractions. Connectez-vous pour enregistrer des favoris et échanger des bons.',
    am: 'ቅናሾችን እና መስህቦችን ማሰስ ይችላሉ። ወደ ተወዳጆች ለማስቀመጥ እና ቫውቸሮችን ለመጠቀም ይግቡ።'
  },
  guestSignInAction: {
    en: 'Sign In to Unlock Full Access',
    ar: 'سجل الدخول للوصول إلى كافة المزايا',
    zh: '登录以解锁全部功能',
    ru: 'Войдите для полного доступа',
    fr: 'Connectez-vous pour débloquer l\'accès complet',
    am: 'ሙሉ መዳረሻን ለመክፈት ይግቡ'
  },
  processing: {
    en: 'Processing...',
    ar: 'جارٍ المعالجة...',
    zh: '处理中...',
    ru: 'Обработка...',
    fr: 'Traitement en cours...',
    am: 'በሂደት ላይ ነው...'
  },
  uaeFamilyDeals: {
    en: 'UAE Family Deals & Experiences',
    ar: 'تجارب وعروض عائلية في الإمارات',
    zh: '阿联酋家庭优惠与精彩体验',
    ru: 'Семейные скидки и впечатления в ОАЭ',
    fr: 'Offres et expériences familiales aux EAU',
    am: 'የተባበሩት አረብ ኤምሬትስ የቤተሰብ ቅናሾች እና ተሞክሮዎች'
  },
  taglineSlogan: {
    en: 'More fun, more together.',
    ar: 'متعة أكثر، معاً أكثر.',
    zh: '更多欢乐，更多陪伴。',
    ru: 'Больше радости, больше вместе.',
    fr: 'Plus de plaisir, plus ensemble.',
    am: 'የበለጠ ደስታ ፣ የበለጠ አብረን።'
  },
  filterAll: {
    en: 'All',
    ar: 'الكل',
    zh: '全部',
    ru: 'Все',
    fr: 'Tous',
    am: 'ሁሉም'
  },
  filterNearby: {
    en: 'Nearby',
    ar: 'قريب مني',
    zh: '附近',
    ru: 'Рядом',
    fr: 'À proximité',
    am: 'አቅራቢያ'
  },
  filterFeatured: {
    en: 'Featured',
    ar: 'مميز',
    zh: '精选',
    ru: 'Рекомендуемые',
    fr: 'En vedette',
    am: 'ተለይተው የቀረቡ'
  },
  filterPopular: {
    en: 'Popular',
    ar: 'شائع',
    zh: '热门',
    ru: 'Популярные',
    fr: 'Populaire',
    am: 'ታዋቂ'
  },
  filterAvailable: {
    en: 'Available Now',
    ar: 'متاح الآن',
    zh: '当前可用',
    ru: 'Доступно сейчас',
    fr: 'Disponible maintenant',
    am: 'አሁን ይገኛል'
  },
  filterLimited: {
    en: 'Limited Slots',
    ar: 'أماكن محدودة',
    zh: '名额有限',
    ru: 'Ограниченные места',
    fr: 'Places limitées',
    am: 'የተገደበ ቦታ'
  },
  gridMode: {
    en: 'Grid',
    ar: 'شبكة',
    zh: '网格',
    ru: 'Сетка',
    fr: 'Grille',
    am: 'ፍርግርግ'
  },
  mapMode: {
    en: 'Map',
    ar: 'خريطة',
    zh: '地图',
    ru: 'Карта',
    fr: 'Carte',
    am: 'ካርታ'
  },
  savedFavoritesTitle: {
    en: 'My Saved Favorites',
    ar: 'قائمتي المفضلة',
    zh: '我的收藏夹',
    ru: 'Мое избранное',
    fr: 'Mes favoris enregistrés',
    am: 'የተቀመጡ ተወዳጆቼ'
  },
  clearFilters: {
    en: 'Clear Filters',
    ar: 'مسح التصفية',
    zh: '清除筛选',
    ru: 'Сбросить фильтры',
    fr: 'Effacer les filtres',
    am: 'ማጣሪያዎችን አጽዳ'
  },
  verifiedDeals: {
    en: 'Verified Deals',
    ar: 'عروض موثوقة',
    zh: '认证优惠',
    ru: 'Проверенные предложения',
    fr: 'Offres vérifiées',
    am: 'የተረጋገጡ ቅናሾች'
  },
  dealsCount: {
    en: 'deals available',
    ar: 'عروض متاحة',
    zh: '个优惠可用',
    ru: 'предложений доступно',
    fr: 'offres disponibles',
    am: 'ቅናሾች ይገኛሉ'
  },
  bookingReference: {
    en: 'Booking Reference',
    ar: 'رقم مرجع الحجز',
    zh: '预订编号',
    ru: 'Номер бронирования',
    fr: 'Référence de réservation',
    am: 'የቦታ ማስያዣ ቁጥር'
  },
  showQrAtEntry: {
    en: 'Show this QR code at the venue entry desk',
    ar: 'أظهر رمز الاستجابة السريعة (QR) عند مكتب الدخول',
    zh: '请在场馆入场处出示此二维码',
    ru: 'Покажите этот QR-код на входе в заведение',
    fr: 'Présentez ce QR code à l\'accueil du lieu',
    am: 'ይህንን የQR ኮድ በመግቢያው ጠረጴዛ ላይ ያሳዩ'
  },
  activityExperience: {
    en: 'Activity / Experience',
    ar: 'النشاط / التجربة',
    zh: '活动 / 体验项目',
    ru: 'Мероприятие / Впечатление',
    fr: 'Activité / Expérience',
    am: 'እንቅስቃሴ / ተሞክሮ'
  },
  bookingDateTime: {
    en: 'Date & Time',
    ar: 'التاريخ والوقت',
    zh: '日期与时间',
    ru: 'Дата и время',
    fr: 'Date et heure',
    am: 'ቀን እና ሰዓት'
  },
  venueLocation: {
    en: 'Venue Location',
    ar: 'موقع الوجهة',
    zh: '场馆地址',
    ru: 'Место проведения',
    fr: 'Emplacement du lieu',
    am: 'የቦታው አድራሻ'
  },
  totalAmountPaid: {
    en: 'Total Amount Paid',
    ar: 'المبلغ الإجمالي المدفوع',
    zh: '实付总金额',
    ru: 'Итого оплачено',
    fr: 'Montant total payé',
    am: 'አጠቃላይ የተከፈለ መጠን'
  },
  downloadPass: {
    en: 'Download Pass',
    ar: 'تحميل التذكرة',
    zh: '下载通行证',
    ru: 'Скачать пропуск',
    fr: 'Télécharger le pass',
    am: 'ማለፊያ ያውርዱ'
  },
  viewMyBookings: {
    en: 'View My Bookings',
    ar: 'عرض حجوزاتي',
    zh: '查看我的预订',
    ru: 'Мои бронирования',
    fr: 'Voir mes réservations',
    am: 'ቦታ ማስያዣዎቼን ይመልከቱ'
  },
  highlightsInclusions: {
    en: 'Highlights & Inclusions',
    ar: 'المزايا والتفاصيل المشمولة',
    zh: '亮点与包含项目',
    ru: 'Особенности и включенные услуги',
    fr: 'Points forts et inclusions',
    am: 'ዋና ዋና ነጥቦች እና የተካተቱ'
  },
  howToRedeem: {
    en: 'How to Redeem',
    ar: 'طريقة الاسترداد',
    zh: '如何兑换',
    ru: 'Как использовать',
    fr: 'Comment échanger',
    am: 'እንዴት መጠቀም እንደሚቻል'
  },
  termsAndConditions: {
    en: 'Terms & Conditions',
    ar: 'الشروط والأحكام',
    zh: '条款与条件',
    ru: 'Условия и положения',
    fr: 'Conditions générales',
    am: 'ውሎች እና ሁኔታዎች'
  },
  getDirections: {
    en: 'Get Directions',
    ar: 'الحصول على الاتجاهات',
    zh: '获取路线',
    ru: 'Маршрут',
    fr: 'Obtenir l\'itinéraire',
    am: 'አቅጣጫዎችን ያግኙ'
  },
  customerReviews: {
    en: 'Customer Reviews',
    ar: 'آراء وتقييمات الزوار',
    zh: '用户评价',
    ru: 'Отзывы посетителей',
    fr: 'Avis des clients',
    am: 'የደንበኞች ግምገማዎች'
  },
  writeReview: {
    en: 'Write a Review',
    ar: 'اكتب تقييماً',
    zh: '发表评价',
    ru: 'Написать отзыв',
    fr: 'Donner votre avis',
    am: 'ግምገማ ይጻፉ'
  },
  claimDigitalPass: {
    en: 'Claim Digital Pass',
    ar: 'احصل على التصريح الرقمي',
    zh: '领取电子通行证',
    ru: 'Получить электронный пропуск',
    fr: 'Obtenir le pass numérique',
    am: 'ዲጂታል ማለፊያ ያግኙ'
  },
  bookTickets: {
    en: 'Book Tickets',
    ar: 'حجز التذاكر',
    zh: '预订门票',
    ru: 'Забронировать билеты',
    fr: 'Réserver des billets',
    am: 'ትኬቶችን ይያዙ'
  },
  limitedAvailability: {
    en: 'Limited Availability',
    ar: 'توفر محدود',
    zh: '名额紧张',
    ru: 'Ограниченное количество',
    fr: 'Disponibilité limitée',
    am: 'የተገደበ አቅርቦት'
  },
  instantConfirmation: {
    en: 'Instant Confirmation',
    ar: 'تأكيد فوري',
    zh: '极速确认',
    ru: 'Мгновенное подтверждение',
    fr: 'Confirmation instantanée',
    am: 'ፈጣን ማረጋገጫ'
  },
  freeCancellation: {
    en: 'Free Cancellation',
    ar: 'إلغاء مجاني',
    zh: '免费取消',
    ru: 'Бесплатная отмена',
    fr: 'Annulation gratuite',
    am: 'ነፃ ስረዛ'
  },
  openingHours: {
    en: 'Opening Hours',
    ar: 'ساعات العمل',
    zh: '营业时间',
    ru: 'Часы работы',
    fr: 'Heures d\'ouverture',
    am: 'የስራ ሰዓታት'
  },
  aboutVenue: {
    en: 'About the Venue',
    ar: 'عن المكان',
    zh: '场馆介绍',
    ru: 'О заведении',
    fr: 'À propos du lieu',
    am: 'ስለ ቦታው'
  },
  shareOffer: {
    en: 'Share Offer',
    ar: 'مشاركة العرض',
    zh: '分享优惠',
    ru: 'Поделиться предложением',
    fr: 'Partager l\'offre',
    am: 'ቅናሹን ያጋሩ'
  },
  copiedOfferLink: {
    en: 'Offer link copied!',
    ar: 'تم نسخ رابط العرض!',
    zh: '优惠链接已复制！',
    ru: 'Ссылка на предложение скопирована!',
    fr: 'Lien de l\'offre copié !',
    am: 'የቅናሽ አገናኝ ተቀድቷል!'
  },
  vouchersTab: {
    en: 'My Vouchers',
    ar: 'قسائمي',
    zh: '我的卡券',
    ru: 'Мои ваучеры',
    fr: 'Mes bons',
    am: 'የእኔ ቫውቸሮች'
  },
  bookingsTab: {
    en: 'Activity Bookings',
    ar: 'حجوزات الأنشطة',
    zh: '活动预订',
    ru: 'Бронирования',
    fr: 'Réservations d\'activités',
    am: 'የእንቅስቃሴ ቦታ ማስያዣዎች'
  },
  activeVouchers: {
    en: 'Active Vouchers',
    ar: 'قسائم نشطة',
    zh: '有效卡券',
    ru: 'Активные ваучеры',
    fr: 'Bons actifs',
    am: 'ንቁ ቫውቸሮች'
  },
  usedVouchers: {
    en: 'Redeemed / Used',
    ar: 'مستردة / مستخدمة',
    zh: '已兑换 / 已使用',
    ru: 'Использованные',
    fr: 'Échangés / Utilisés',
    am: 'ጥቅም ላይ የዋሉ'
  },
  upcomingTab: {
    en: 'Upcoming',
    ar: 'القادمة',
    zh: '即将开始',
    ru: 'Предстоящие',
    fr: 'À venir',
    am: 'መጪ'
  },
  completedTab: {
    en: 'Completed',
    ar: 'المكتملة',
    zh: '已完成',
    ru: 'Завершенные',
    fr: 'Terminé',
    am: 'የተጠናቀቀ'
  },
  cancelledTab: {
    en: 'Cancelled',
    ar: 'الملغاة',
    zh: '已取消',
    ru: 'Отмененные',
    fr: 'Annulé',
    am: 'የተሰረዘ'
  },
  showCouponToCashier: {
    en: 'Show this code to cashier at checkout',
    ar: 'أظهر هذا الرمز للصندوق عند الدفع',
    zh: '结账时请向收银员出示此核销码',
    ru: 'Покажите этот код кассиру при оплате',
    fr: 'Présentez ce code au caissier lors du paiement',
    am: 'በክፍያ ጊዜ ይህንን ኮድ ለገንዘብ ተቀባዩ ያሳዩ'
  },
  tapToCopy: {
    en: 'Tap code to copy',
    ar: 'انقر لنسخ الرمز',
    zh: '点击复制优惠码',
    ru: 'Нажмите, чтобы скопировать',
    fr: 'Appuyez pour copier le code',
    am: 'ኮዱን ለመቅዳት ይንኩ'
  },
  expiresOn: {
    en: 'Expires on',
    ar: 'ينتهي في',
    zh: '有效期至',
    ru: 'Действует до',
    fr: 'Expire le',
    am: 'የሚያበቃበት ቀን'
  },
  bookAgain: {
    en: 'Book Again',
    ar: 'احجز مرة أخرى',
    zh: '再次预订',
    ru: 'Забронировать снова',
    fr: 'Réserver à nouveau',
    am: 'እንደገና ይያዙ'
  },
  noActiveVouchers: {
    en: 'No active vouchers',
    ar: 'لا توجد قسائم نشطة',
    zh: '暂无有效卡券',
    ru: 'Нет активных ваучеров',
    fr: 'Aucun bon actif',
    am: 'ምንም ንቁ ቫውቸሮች የሉም'
  },
  noActiveVouchersDesc: {
    en: 'You haven\'t claimed any digital vouchers yet. Explore deals and get your free passes today!',
    ar: 'لم تطالب بأي قسائم رقمية بعد. استكشف العروض واحصل على تصاريحك المجانية اليوم!',
    zh: '您尚未领取任何电子优惠券。立即浏览优惠，领取您的免费体验卡！',
    ru: 'Вы еще не получили ни одного ваучера. Изучите предложения и получите бесплатные пропуска прямо сейчас!',
    fr: 'Vous n\'avez encore réclamé aucun bon numérique. Explorez les offres et profitez de vos pass gratuits dès aujourd\'hui !',
    am: 'እስካሁን ምንም ዲጂታል ቫውቸሮችን አልወሰዱም። ቅናሾችን ያስሱ እና ነፃ ማለፊያዎችዎን ዛሬ ያግኙ!'
  },
  noUpcomingBookings: {
    en: 'No upcoming bookings',
    ar: 'لا توجد حجوزات قادمة',
    zh: '暂无待出行预订',
    ru: 'Нет предстоящих бронирований',
    fr: 'Aucune réservation à venir',
    am: 'ምንም መጪ ቦታ ማስያዣዎች የሉም'
  },
  noUpcomingBookingsDesc: {
    en: 'Your confirmed activity tickets and passes will show here.',
    ar: 'ستظهر تذاكر وتصاريح الأنشطة المؤكدة هنا.',
    zh: '您已确认的活动门票和通行证将显示在这里。',
    ru: 'Ваши подтвержденные билеты и пропуска появятся здесь.',
    fr: 'Vos billets d\'activités et pass confirmés s\'afficheront ici.',
    am: 'የተረጋገጡ የእንቅስቃሴ ትኬቶችዎ እና ማለፊያዎችዎ እዚህ ይታያሉ።'
  }
};

let content = fs.readFileSync('src/lib/translations.ts', 'utf8');

// Function to safely inject keys into a language block
function injectKeysIntoLang(langCode, keysObject) {
  const regex = new RegExp('(' + langCode + ':\\s*\\{)([\\s\\S]*?)(\\n\\s*\\},)');
  const match = content.match(regex);
  if (!match) {
    console.error('Could not find block for ' + langCode);
    return;
  }
  const prefix = match[1];
  const body = match[2];
  const suffix = match[3];

  let newEntries = '';
  for (const [key, valObj] of Object.entries(keysObject)) {
    const val = valObj[langCode] || valObj['en'];
    if (val !== undefined && !body.includes(key + ':')) {
      const escapedVal = val.replace(/'/g, "\\'");
      newEntries += `\n    ${key}: '${escapedVal}',`;
    }
  }

  if (newEntries) {
    content = content.replace(match[0], prefix + body + newEntries + suffix);
    console.log('Injected new entries for ' + langCode);
  }
}

// 1. Inject missing33 into zh, ru, fr, am
injectKeysIntoLang('zh', missing33);
injectKeysIntoLang('ru', missing33);
injectKeysIntoLang('fr', missing33);
injectKeysIntoLang('am', missing33);

// 2. Inject comprehensiveAdditions into all languages: en, ar, zh, ru, fr, am
injectKeysIntoLang('en', comprehensiveAdditions);
injectKeysIntoLang('ar', comprehensiveAdditions);
injectKeysIntoLang('zh', comprehensiveAdditions);
injectKeysIntoLang('ru', comprehensiveAdditions);
injectKeysIntoLang('fr', comprehensiveAdditions);
injectKeysIntoLang('am', comprehensiveAdditions);

fs.writeFileSync('src/lib/translations.ts', content, 'utf8');
console.log('translations.ts updated successfully!');
