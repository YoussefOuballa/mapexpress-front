/* assets/js/ar-test.js
 * Arabic / RTL overlay for MAP Express static prototype.
 * Loaded only when the URL contains ?lang=ar (see inline loader in each shell).
 * Pure runtime translation — never modifies the source HTML files.
 */
(function () {
    'use strict';

    /* =========================================================
     * 3.1 Intl.DateTimeFormat patch — forces all live clock
     *     components (Alpine x-text) to output ar-MA dates.
     * ========================================================= */
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
        Intl.DateTimeFormat = new Proxy(Intl.DateTimeFormat, {
            construct: function (Target, args) {
                args[0] = 'ar-MA';
                return Reflect.construct(Target, args);
            }
        });
    }

    /* =========================================================
     * 3.2 Month-name table + regex
     * ========================================================= */
    var MONTHS = {
        'janvier': 'يناير',   'fevrier': 'فبراير', 'février': 'فبراير',
        'mars': 'مارس',       'avril': 'أبريل', 'Avril': 'أبريل',
        'mai': 'ماي',         'juin': 'يونيو',
        'juillet': 'يوليوز',  'aout': 'غشت',       'août': 'غشت',
        'septembre': 'شتنبر', 'octobre': 'أكتوبر',
        'novembre': 'نونبر',  'decembre': 'دجنبر', 'décembre': 'دجنبر',

        'January': 'يناير',   'February': 'فبراير', 'March': 'مارس',
        'April': 'أبريل',     'May': 'ماي',         'June': 'يونيو',
        'July': 'يوليوز',     'August': 'غشت',      'September': 'شتنبر',
        'October': 'أكتوبر',  'November': 'نونبر',  'December': 'دجنبر',

        'lundi': 'الإثنين',   'mardi': 'الثلاثاء',  'mercredi': 'الأربعاء',
        'jeudi': 'الخميس',    'vendredi': 'الجمعة', 'samedi': 'السبت',
        'dimanche': 'الأحد',
        'Lundi': 'الإثنين',   'Mardi': 'الثلاثاء',  'Mercredi': 'الأربعاء',
        'Jeudi': 'الخميس',    'Vendredi': 'الجمعة', 'Samedi': 'السبت',
        'Dimanche': 'الأحد'
    };
    var monthKeys = Object.keys(MONTHS).sort(function (a, b) { return b.length - a.length; });
    var MONTH_RE = new RegExp('\\b(' + monthKeys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')\\b', 'g');
    function translateMonths(text) {
        return text.replace(MONTH_RE, function (m) { return MONTHS[m] || m; });
    }

    /* =========================================================
     * Normalisation helpers
     * ========================================================= */
    function norm(s) {
        if (s == null) return '';
        s = String(s);
        if (s.normalize) s = s.normalize('NFC');
        return s
            .replace(/ /g, ' ')
            .replace(/[‘’ʼ]/g, "'")
            .replace(/[“”]/g, '"')
            .replace(/[–—]/g, '-')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /* =========================================================
     * 3.3 Translation dictionary
     * Keys are the EXACT French/English strings as they appear
     * in the rendered DOM (after whitespace collapse).
     * ========================================================= */
    var T = {
        /* ---------- Header / nav ---------- */
        'Accueil': 'الرئيسية',
        'ACCEUIL': 'الرئيسية',
        'Politique': 'سياسة',
        'Société': 'مجتمع',
        'Société et Régions': 'مجتمع وجهات',
        'Société Civile et vie associative': 'المجتمع المدني والحياة المجتمعية',
        "Droits de l'Homme": 'حقوق الإنسان',
        'Économie et Finances': 'الاقتصاد والمال',
        'Economie et Finances': 'الاقتصاد والمال',
        'Culture et Médias': 'الثقافة والإعلام',
        'Culture et Medias': 'الثقافة والإعلام',
        'Tous les communiqués': 'جميع البيانات',
        'Sport': 'رياضة',
        'Sports': 'رياضة',
        'SOS Fake news': 'الأخبار الزائفة',
        'SOS Fake News': 'الأخبار الزائفة',
        'Opinions et Débats': 'الآراء و حوارات',
        'Grand Maghreb': 'المغرب الكبير',
        'Monde': 'العالم',
        'Actualités': 'الأخبار',

        'Activités Royales': 'الأنشطة الملكية',
        'Activités Princières': 'الأنشطة الأميرية',
        'Activités Parlementaires': 'الأنشطة البرلمانية',
        'Activités Gouvernementales': 'الأنشطة الحكومية',
        'Activités Partisanes et Syndicales': 'الأنشطة الحزبية والنقابية',
        'ACTIVITÉS ROYALES': 'الأنشطة الملكية',
        'ACTIVITÉS PRINCIÈRES': 'الأنشطة الأميرية',

        'Radio rim': 'إذاعة ريم',
        'TV': 'التلفزة',
        'MAP LIVE': 'ماب لايف',
        'MAP TV': 'ماب تي في',
        'MAP Live': 'ماب لايف',
        'MAP Audio': 'ماب أوديو',
        'MAP Photo': 'خدمة الصور',
        'MAP Sport': 'ماب رياضة',
        'MAP Infographie': 'خدمة الرسوم البيانية',
        'MAP Info':'نشرة ”ماب أنفو”',
        'MAP Amazigh': 'ماب أمازيغ',
        'MAP Mobile': 'خدمات الهاتف المحمول',
        'MAP SITES': 'مواقع الوكالة',
        'Médiateur de la MAP': 'وسيط الوكالة',
        'Plan de site': 'خريطة الموقع',
        'Contactez-nous': 'اتصل بنا',
        'Mentions légales': 'تدابير قانونية',

        'Rechercher': 'بحث',
        'Rechercher...': 'بحث...',
        'Arabe': 'العربية',
        'Français': 'الفرنسية',

        /* ---------- Breaking news ---------- */
        'Flash infos': 'آخر الأخبار',
        "Économie : L'ONMT déploie une stratégie ciblée pour accompagner l'essor de Dakhla":
            'اقتصاد: المكتب الوطني للسياحة يطلق استراتيجية موجهة لمواكبة ازدهار الداخلة',
        'Régional : Lancement officiel des festivités de "Tétouan, capitale méditerranéenne de la culture et du dialogue 2026"':
            'جهوي: الانطلاق الرسمي لتظاهرات "تطوان، عاصمة البحر الأبيض المتوسط للثقافة والحوار 2026"',
        "Régional : Marrakech-Safi: Lancement d'une campagne régionale de plantation de 5.000 arbres au sein des centres de jeunesse":
            'جهوي: مراكش-آسفي: انطلاق حملة جهوية لغرس 5000 شجرة بمراكز الشباب',
        'Régional : Le rôle central de la recherche universitaire dans le développement territorial en débat à Marrakech':
            'جهوي: الدور المحوري للبحث الجامعي في التنمية الترابية محور نقاش بمراكش',
        "Politique : Le Maroc, \"partenaire stratégique\" et \"porte d'entrée\" de l'Equateur vers l'Afrique (ministre équatorienne des Relations extérieures)":
            'سياسة: المغرب "شريك استراتيجي" و"بوابة" الإكوادور نحو إفريقيا (وزيرة الخارجية الإكوادورية)',
        "Monde : Le plan marocain d'autonomie au Sahara au centre d'une conférence à l'université de Saragosse":
            'العالم: مخطط الحكم الذاتي بالصحراء المغربية محور ندوة بجامعة سرقسطة',
        "Économie : Convention de partenariat entre le ministère de l'Équipement et de l'Eau et la CDG pour dématérialiser les procédures d'indemnisation liées à l'expropriation":
            'اقتصاد: اتفاقية شراكة بين وزارة التجهيز والماء وصندوق الإيداع والتدبير لرقمنة مساطر التعويض المتعلقة بنزع الملكية',

        /* ---------- Section / widget headings ---------- */
        'Dernière Heure': 'أخبار آخر الساعة',
        'DERNIÈRE HEURE': 'أخبار آخر الساعة',
        'DÉCOUVRIR PLUS': 'اكتشف المزيد',
        'Découvrir plus': 'اكتشف المزيد',
        'PHOTOTHÈQUE ROYALE': 'مكتبة الصور الملكية',
        'Dossiers': 'الملفات',
        'TOUTES LES': 'جميع',
        'Toutes les actualités': 'جميع الأخبار',
        'Voir plus': 'عرض المزيد',
        'Voir tout': 'عرض الكل',
        'Lire la suite': 'اقرأ المزيد',
        'Read more': 'اقرأ المزيد',
        'En savoir plus': 'لمعرفة المزيد',
        'Communiqués de presse': 'بيانات صحفية',
        'Communiqué du Cabinet Royal': 'بلاغ للديوان الملكي',
        'Télécharger': 'تحميل',
        'Partager': 'مشاركة',
        'Copier le lien': 'نسخ الرابط',
        'Lien copié !': 'تم نسخ الرابط!',
        'à': '',

        /* ---------- Pagination ---------- */
        '« Premier': '« الأول',
        '« Premier ': '« الأول',
        '« Premier': '« الأول',
        'Premier': 'الأول',
        '‹ Précédent': '‹ السابق',
        '‹ Précédent': '‹ السابق',
        'Précédent': 'السابق',
        'Suivant ›': 'التالي ›',
        'Suivant ›': 'التالي ›',
        'Suivant': 'التالي',
        'Dernier »': 'الأخير »',
        'Dernier »': 'الأخير »',
        'Dernier': 'الأخير',

        /* ---------- Footer copyright ---------- */
        '© 2026 MapExpress Tous droits réservés.': '© 2026 ماب إكسبريس. جميع الحقوق محفوظة.',

        /* ---------- Royal & Princely Activities — section labels ---------- */
        'TOUTES LES ACTIVITÉS ROYALES': 'جميع الأنشطة الملكية',
        'TOUTES LES ACTIVITÉS PRINCIÈRES': 'جميع الأنشطة الأميرية',

        /* ---------- Royal Activities — hero ---------- */
        'Mercredi, 15 avril, 2026 à 11:53': 'الأربعاء 15 أبريل 2026 على الساعة 11:53',
        'SM le Roi félicite M. Romuald Wadagni suite à son élection Président de la République du Bénin':
            'جلالة الملك يهنئ السيد رومالد واداني إثر انتخابه رئيسا لجمهورية بنين',
        'Sa Majesté le Roi Mohammed VI a adressé un message de félicitations à M. Romuald Wadagni suite à son élection Président de la République du Bénin.':
            'بعث صاحب الجلالة الملك محمد السادس برسالة تهنئة إلى السيد رومالد واداني إثر انتخابه رئيسا لجمهورية بنين.',

        /* ---------- Royal Activities — list articles & discover-more ---------- */
        'Rabat - Voici un communiqué du Cabinet Royal :': 'الرباط - وفيما يلي نص بلاغ للديوان الملكي:',
        'Rabat - Voici un communiqué du Cabinet Royal:': 'الرباط - وفيما يلي نص بلاغ للديوان الملكي:',

        'SM le Roi préside à Rabat un Conseil des ministres':
            'جلالة الملك يترأس بالرباط مجلسا للوزراء',
        "Sa Majesté le Roi Mohammed VI, que Dieu L'assiste, a présidé, jeudi au Palais Royal de Rabat, un Conseil des ministres, indique un communiqué du Cabinet Royal.":
            'ترأس صاحب الجلالة الملك محمد السادس، نصره الله، يوم الخميس بالقصر الملكي بالرباط، مجلسا للوزراء، وذلك حسب بلاغ للديوان الملكي.',
        "Sa Majesté le Roi Mohammed VI, que Dieu L'assiste, a présidé, Jeudi au Palais Royal de Rabat, un Conseil des ministres, indique un communiqué du Cabinet Royal.":
            'ترأس صاحب الجلالة الملك محمد السادس، نصره الله، يوم الخميس بالقصر الملكي بالرباط، مجلسا للوزراء، وذلك حسب بلاغ للديوان الملكي.',

        "SM le Roi félicite M. Nizar Amidi suite à son élection Président de la République d'Irak":
            'جلالة الملك يهنئ السيد نزار عميدي إثر انتخابه رئيسا لجمهورية العراق',
        "Sa Majesté le Roi Mohammed VI a adressé un message de félicitations à M. Nizar Amidi suite à son élection Président de la République d'Irak.":
            'بعث صاحب الجلالة الملك محمد السادس برسالة تهنئة إلى السيد نزار عميدي إثر انتخابه رئيسا لجمهورية العراق.',

        "SM le Roi félicite M. Ismaïl Omar Guelleh à l'occasion de sa réélection Président de la République de Djibouti":
            'جلالة الملك يهنئ السيد إسماعيل عمر جيله بمناسبة إعادة انتخابه رئيسا لجمهورية جيبوتي',
        "SM le Roi félicite M. Ismaïl Omar Guelleh à l'occasion de sa réélection Président de la République de Djibouti.":
            'جلالة الملك يهنئ السيد إسماعيل عمر جيله بمناسبة إعادة انتخابه رئيسا لجمهورية جيبوتي.',

        "SM le Roi félicite le Président sénégalais à l'occasion du 66e anniversaire d'indépendance de son pays":
            'جلالة الملك يهنئ الرئيس السنغالي بمناسبة الذكرى الـ66 لاستقلال بلاده',
        "Sa Majesté le Roi Mohammed VI a adressé un message de félicitations au Président de la République du Sénégal, M. Bassirou Diomaye Faye, à l'occasion du 66e anniversaire d'indépendance de son pays.":
            'بعث صاحب الجلالة الملك محمد السادس برسالة تهنئة إلى رئيس جمهورية السنغال، السيد باسيرو ديوماي فاي، بمناسبة الذكرى الـ66 لاستقلال بلاده.',

        "SM le Roi félicite le Président grec à l'occasion de la fête nationale de son pays":
            'جلالة الملك يهنئ الرئيس اليوناني بمناسبة العيد الوطني لبلاده',
        "Sa Majesté le Roi Mohammed VI a adressé un message de félicitations au Président de la République grecque, M. Konstantinos Tasoulas, à l'occasion de la fête nationale de son pays":
            'بعث صاحب الجلالة الملك محمد السادس برسالة تهنئة إلى رئيس الجمهورية الهيلينية، السيد قسطنطينوس تاسولاس، بمناسبة العيد الوطني لبلاده',

        "SM le Roi félicite le Président pakistanais à l'occasion de la fête nationale de son pays":
            'جلالة الملك يهنئ الرئيس الباكستاني بمناسبة العيد الوطني لبلاده',
        "Sa Majesté le Roi Mohammed VI a adressé un message de félicitations au Président de la République islamique du Pakistan, M. Asif Ali Zardari, à l'occasion de la fête nationale de son pays.":
            'بعث صاحب الجلالة الملك محمد السادس برسالة تهنئة إلى رئيس جمهورية باكستان الإسلامية، السيد آصف علي زرداري، بمناسبة العيد الوطني لبلاده.',

        "SM le Roi reçoit le président du Conseil d'Administration du Groupe Safran":
            'جلالة الملك يستقبل رئيس مجلس إدارة مجموعة سافران',

        

        /* ---------- Royal Article body ---------- */
        'Samedi 18 Avril 2026 à 12:57': 'السبت 18 أبريل 2026 على الساعة 12:57',
        'Rabat - Sa Majesté le Roi Mohammed VI a adressé un message de félicitations à M. Romuald Wadagni suite à son élection Président de la République du Bénin.':
            'الرباط - بعث صاحب الجلالة الملك محمد السادس برسالة تهنئة إلى السيد رومالد واداني إثر انتخابه رئيسا لجمهورية بنين.',
        '"Unis par des liens fraternels d\'amitié, le Royaume du Maroc et la République du Bénin ont su, au fil du temps, développer une étroite coopération et un partenariat solide et mutuellement bénéfique", indique Sa Majesté le Roi dans ce message.':
            '"تجمع المملكة المغربية وجمهورية بنين روابط أخوة وصداقة مكنتهما، عبر الزمن، من تطوير تعاون وثيق وشراكة متينة ومتبادلة المنفعة"، يقول جلالة الملك في هذه الرسالة.',
        "Le Souverain souligne, à cette occasion, Sa pleine disposition à œuvrer, avec M. Wadagni, en vue d'insuffler une dynamique toujours plus soutenue à ce partenariat privilégié et d'élargir sa portée tant sur le plan bilatéral qu'à l'échelle du continent africain.":
            'ويؤكد جلالته بهذه المناسبة استعداده الكامل للعمل، رفقة السيد واداني، من أجل إضفاء دينامية أقوى على هذه الشراكة المتميزة وتوسيع نطاقها سواء على المستوى الثنائي أو على صعيد القارة الإفريقية.',

        /* ---------- Princely Activities — hero ---------- */
        "SAR le Prince Moulay Rachid préside à Meknès l'ouverture de la 18e édition du Salon International de l'Agriculture au Maroc":
            'صاحب السمو الملكي الأمير مولاي رشيد يترأس بمكناس افتتاح الدورة الثامنة عشرة للمعرض الدولي للفلاحة بالمغرب',
        "Son Altesse Royale le Prince Moulay Rachid a présidé, lundi au Mechouar Stinia-Sahrij Souani à Meknès, la cérémonie d'ouverture de la 18e édition du Salon International de l'Agriculture au Maroc (SIAM), organisée sous le Haut Patronage de Sa Majesté le Roi Mohammed VI, du 20 au 28 avril, sous le thème « Durabilité de la production animale et souveraineté alimentaire ».":
            'ترأس صاحب السمو الملكي الأمير مولاي رشيد، يوم الإثنين بالمشور الستينية - صهريج السواني بمكناس، مراسيم افتتاح الدورة الثامنة عشرة للمعرض الدولي للفلاحة بالمغرب (سيام)، المنظم تحت الرعاية السامية لصاحب الجلالة الملك محمد السادس، من 20 إلى 28 أبريل، تحت شعار "استدامة الإنتاج الحيواني والسيادة الغذائية".',

        /* ---------- Princely Activities — list articles & discover-more ---------- */
        'Sur Ordre de Sa Majesté le Roi, SAR le Prince Héritier Moulay El Hassan inaugure la “Tour Mohammed VI”, un emblème de modernité et symbole du rayonnement des deux villes jumelles de Rabat et Salé':
            'بأمر من صاحب الجلالة الملك، صاحب السمو الملكي ولي العهد الأمير مولاي الحسن يدشن "برج محمد السادس"، رمزا للحداثة وتجسيدا لإشعاع المدينتين التوأمين الرباط وسلا',
        "Sur Ordre de Sa Majesté le Roi Mohammed VI, que Dieu L'assiste, Son Altesse Royale le Prince Héritier Moulay El Hassan, a procédé, lundi sur la rive droite de Bouregreg, à l'inauguration de la « Tour Mohammed VI », une nouvelle icône architecturale et un emblème de modernité qui symbolise l'émergence et le rayonnement des deux villes jumelles de Rabat et Salé, sous l'impulsion du Souverain.":
            'بأمر من صاحب الجلالة الملك محمد السادس، نصره الله، دشن صاحب السمو الملكي ولي العهد الأمير مولاي الحسن، يوم الإثنين بالضفة اليمنى لأبي رقراق، "برج محمد السادس"، أيقونة معمارية جديدة ورمزا للحداثة يجسد بزوغ وإشعاع المدينتين التوأمين الرباط وسلا، تحت قيادة العاهل المغربي.',

        'SAR la Princesse Lalla Hasnaa représente le Royaume du Maroc à Washington au sommet de la Coalition mondiale pour les enfants "Fostering the Future Together"':
            'صاحبة السمو الملكي الأميرة للا حسناء تمثل المملكة المغربية بواشنطن في قمة التحالف العالمي للأطفال "Fostering the Future Together"',
        "Son Altesse Royale la Princesse Lalla Hasnaa a, sur invitation de Madame Melania Trump, Première Dame des Etats-Unis d'Amérique, représenté le Royaume du Maroc, mercredi à la Maison Blanche à Washington, au sommet de la Coalition mondiale pour les enfants \"Fostering the Future Together\" (Construire l'avenir ensemble).":
            'مثلت صاحبة السمو الملكي الأميرة للا حسناء، بدعوة من السيدة ميلانيا ترامب، السيدة الأولى للولايات المتحدة الأمريكية، المملكة المغربية، يوم الأربعاء بالبيت الأبيض بواشنطن، في قمة التحالف العالمي للأطفال "Fostering the Future Together" (لنبني المستقبل معا).',

        'Témara : Remise des prix aux lauréats du concours de mémorisation et de déclamation du Saint Coran au profit des élèves et étudiants non-voyants':
            'تمارة: تسليم الجوائز للفائزين في مسابقة حفظ وتجويد القرآن الكريم لفائدة التلاميذ والطلبة المكفوفين',
        "L'Organisation Alaouite pour la Promotion des Aveugles au Maroc (OAPAM) a organisé, jeudi à l'Institut Mohammed VI pour l'éducation et l'enseignement des aveugles à Témara, une cérémonie de remise des prix aux lauréats non-voyants du Concours national de mémorisation et de déclamation du Saint Coran.":
            'نظمت المنظمة العلوية لرعاية المكفوفين بالمغرب، يوم الخميس بمعهد محمد السادس لتربية وتعليم المكفوفين بتمارة، حفل تسليم الجوائز للفائزين المكفوفين في المسابقة الوطنية لحفظ وتجويد القرآن الكريم.',

        'Le peuple marocain célèbre samedi le 19e anniversaire de SAR la Princesse Lalla Khadija':
            'الشعب المغربي يحتفل يوم السبت بالذكرى التاسعة عشرة لميلاد صاحبة السمو الملكي الأميرة للا خديجة',
        "La Famille Royale et l'ensemble du peuple marocain célèbrent, samedi, le dix-neuvième anniversaire de Son Altesse Royale la Princesse Lalla Khadija, un heureux événement qui reflète la parfaite symbiose entre le Trône et les différentes composantes de la Nation et les sentiments de loyalisme et d'affection profonde que voue le peuple marocain à l'Illustre Famille Royale.":
            'تحتفل الأسرة الملكية وعموم الشعب المغربي، يوم السبت، بالذكرى التاسعة عشرة لميلاد صاحبة السمو الملكي الأميرة للا خديجة، وهي مناسبة سعيدة تعكس التلاحم التام بين العرش ومختلف مكونات الأمة، ومشاعر الولاء والمحبة العميقة التي يكنها الشعب المغربي للأسرة الملكية الكريمة.',

        "Sur Hautes Instructions de SM le Roi, SAR le Prince Moulay Rachid reçoit les membres de l'Équipe nationale de football, finaliste de la CAN Maroc-2025":
            'بتعليمات سامية من جلالة الملك، صاحب السمو الملكي الأمير مولاي رشيد يستقبل أعضاء المنتخب الوطني لكرة القدم، الوصيف في كأس إفريقيا للأمم المغرب-2025',
        "Sur Hautes Instructions de Sa Majesté le Roi Mohammed VI, que Dieu L'assiste, Son Altesse Royale le Prince Moulay Rachid a reçu, lundi au Palais des Hôtes Royaux de Rabat, les membres de l'Équipe nationale de football, finaliste de la Coupe d'Afrique des Nations (Maroc-2025).":
            'بتعليمات سامية من صاحب الجلالة الملك محمد السادس، نصره الله، استقبل صاحب السمو الملكي الأمير مولاي رشيد، يوم الإثنين بقصر الضيافة الملكية بالرباط، أعضاء المنتخب الوطني لكرة القدم، الوصيف في كأس إفريقيا للأمم (المغرب-2025).',

        "SAR le Prince Moulay Rachid préside la finale de la 35e édition de la Coupe d'Afrique des Nations-Maroc 2025":
            'صاحب السمو الملكي الأمير مولاي رشيد يترأس نهائي الدورة الـ35 لكأس إفريقيا للأمم المغرب 2025',
        "Son Altesse Royale le Prince Moulay Rachid a présidé, dimanche au Stade « Prince Moulay Abdellah » à Rabat, la finale de la 35e édition de la Coupe d'Afrique des Nations (CAN-Maroc 2025), remportée par l'équipe sénégalaise qui s'est imposée face à son homologue marocaine (1-0 après prolongations).":
            'ترأس صاحب السمو الملكي الأمير مولاي رشيد، يوم الأحد بمركب الأمير مولاي عبد الله بالرباط، نهائي الدورة الـ35 لكأس إفريقيا للأمم (الكان-المغرب 2025)، الذي توج به المنتخب السنغالي بعد فوزه على نظيره المغربي (1-0 بعد الوقت الإضافي).',

        'SAR la Princesse Lalla Hasnaa préside à Rabat le dîner de Gala diplomatique annuel de bienfaisance':
            'صاحبة السمو الملكي الأميرة للا حسناء تترأس بالرباط حفل العشاء الدبلوماسي الخيري السنوي',
        "Son Altesse Royale la Princesse Lalla Hasnaa a présidé, dimanche à Rabat, le dîner de Gala diplomatique annuel de bienfaisance, organisé à l'initiative de la Fondation diplomatique et en partenariat avec l'ambassade du Royaume d'Arabie Saoudite.":
            'ترأست صاحبة السمو الملكي الأميرة للا حسناء، يوم الأحد بالرباط، حفل العشاء الدبلوماسي الخيري السنوي، المنظم بمبادرة من المؤسسة الدبلوماسية وبشراكة مع سفارة المملكة العربية السعودية.',

        "SAR le Prince Héritier Moulay El Hassan préside la cérémonie d'ouverture de la 35e édition de la CAN-Maroc 2025":
            'صاحب السمو الملكي ولي العهد الأمير مولاي الحسن يترأس حفل افتتاح الدورة الـ35 لكأس إفريقيا للأمم المغرب 2025',
        "Son Altesse Royale le Prince Héritier Moulay El Hassan a présidé, dimanche au Stade « Prince Moulay Abdellah » à Rabat, la cérémonie d'ouverture de la 35e édition de la Coupe d'Afrique des Nations (CAN-Maroc 2025), qu'abrite le Royaume jusqu'au 18 janvier prochain.":
            'ترأس صاحب السمو الملكي ولي العهد الأمير مولاي الحسن، يوم الأحد بمركب الأمير مولاي عبد الله بالرباط، حفل افتتاح الدورة الـ35 لكأس إفريقيا للأمم (الكان-المغرب 2025)، التي تحتضنها المملكة إلى غاية 18 يناير المقبل.',

        "SAR la Princesse Lalla Asmaa préside à Rabat la cérémonie d'ouverture du 1er Congrès africain sur l'implantation cochléaire de l'enfant":
            'صاحبة السمو الملكي الأميرة للا أسماء تترأس بالرباط مراسيم افتتاح المؤتمر الإفريقي الأول لزراعة قوقعة الأذن لدى الأطفال',
        "Son Altesse Royale la Princesse Lalla Asmaa, Présidente de la Fondation Lalla Asmaa, a présidé, vendredi à l'Université Mohammed VI des Sciences et de la Santé à Rabat, la cérémonie d'ouverture du 1er Congrès africain sur l'implantation cochléaire de l'enfant, un rendez-vous majeur dans la structuration d'un véritable hub africain consacré à la surdité infantile et à l'implant cochléaire.":
            'ترأست صاحبة السمو الملكي الأميرة للا أسماء، رئيسة مؤسسة للا أسماء، يوم الجمعة بجامعة محمد السادس للعلوم والصحة بالرباط، مراسيم افتتاح المؤتمر الإفريقي الأول لزراعة قوقعة الأذن لدى الأطفال، وهو موعد رئيسي في إرساء قطب إفريقي حقيقي مخصص لمعالجة الصمم لدى الأطفال وزراعة قوقعة الأذن.',

        /* ---------- Princely Article body ---------- */
        "Meknès - Son Altesse Royale le Prince Moulay Rachid a présidé, lundi au Mechouar Stinia-Sahrij Souani à Meknès, la cérémonie d'ouverture de la 18e édition du Salon International de l'Agriculture au Maroc (SIAM), organisée sous le Haut Patronage de Sa Majesté le Roi Mohammed VI, du 20 au 28 avril, sous le thème « Durabilité de la production animale et souveraineté alimentaire ».":
            'مكناس - ترأس صاحب السمو الملكي الأمير مولاي رشيد، يوم الإثنين بالمشور الستينية - صهريج السواني بمكناس، مراسيم افتتاح الدورة الثامنة عشرة للمعرض الدولي للفلاحة بالمغرب (سيام)، المنظم تحت الرعاية السامية لصاحب الجلالة الملك محمد السادس، من 20 إلى 28 أبريل، تحت شعار "استدامة الإنتاج الحيواني والسيادة الغذائية".',
        "L'ouverture par Son Altesse Royale de ce Salon illustre la Haute Sollicitude et Bienveillance portée par Sa Majesté le Roi, que Dieu L'assiste, au secteur agricole, et traduit l'engagement inébranlable du Royaume, sous le Leadership du Souverain, en faveur des enjeux et défis contemporains liés au développement durable, aux changements climatiques et à la sécurité alimentaire.":
            'ويجسد افتتاح صاحب السمو الملكي لهذا المعرض العناية السامية والرعاية الفائقة التي يوليها صاحب الجلالة الملك، نصره الله، للقطاع الفلاحي، ويعكس الالتزام الراسخ للمملكة، بقيادة جلالة الملك، تجاه الرهانات والتحديات الراهنة المرتبطة بالتنمية المستدامة والتغيرات المناخية والأمن الغذائي.',
        "A son arrivée au Salon, SAR le Prince Moulay Rachid a passé en revue une section des Forces Auxiliaires qui rendait les honneurs, avant d'être salué par SAR la Princesse Sara Bent Bandar Bin Abdelaziz Al Saoud, directrice exécutive du Conseil international des dattes (CID), le ministre de l'Agriculture, de la Pêche maritime, du Développement rural et des Eaux et Forêts, le wali de la région Fès-Meknès, le président du conseil de la région Fès-Meknès, le gouverneur de la préfecture de Meknès, le président du conseil préfectoral de Meknès, le président du conseil communal de Meknès, et le président de la commune Mechouar Stinia.":
            'وفور وصوله إلى المعرض، استعرض صاحب السمو الملكي الأمير مولاي رشيد فصيلة من القوات المساعدة كانت تؤدي التحية، قبل أن يحييه كل من صاحبة السمو الملكي الأميرة سارة بنت بندر بن عبد العزيز آل سعود، المديرة التنفيذية للمجلس الدولي للتمور، ووزير الفلاحة والصيد البحري والتنمية القروية والمياه والغابات، ووالي جهة فاس-مكناس، ورئيس مجلس جهة فاس-مكناس، وعامل عمالة مكناس، ورئيس المجلس الإقليمي لمكناس، ورئيس المجلس الجماعي لمكناس، ورئيس جماعة المشور الستينية.',
        "Son Altesse Royale a également été salué par le président de la Chambre régionale de l'agriculture Fès-Meknès, le Pacha du Mechouar Stinia, le président et les membres du Conseil d'Administration et les sponsors du SIAM, le président de la Fédération des Chambres de l'Agriculture, le président de la Confédération Marocaine de l'Agriculture et du Développement Rural (COMADER), et le commissaire général par intérim du Salon.":
            'كما حيا صاحب السمو الملكي كل من رئيس الغرفة الجهوية للفلاحة لجهة فاس-مكناس، وباشا المشور الستينية، ورئيس وأعضاء مجلس الإدارة ورعاة المعرض الدولي للفلاحة بالمغرب، ورئيس فيدرالية غرف الفلاحة، ورئيس الكونفدرالية المغربية للفلاحة والتنمية القروية (كوماضير)، والمفوض العام بالنيابة للمعرض.',
        "Au début de la cérémonie d'ouverture, SAR le Prince Moulay Rachid a procédé à la remise des signes distinctifs d'origine et de qualité à des présidents de coopératives et groupements agricoles.":
            'وفي مستهل مراسيم الافتتاح، سلم صاحب السمو الملكي الأمير مولاي رشيد علامات التميز المتعلقة بالمنشأ والجودة لرؤساء تعاونيات ومجموعات فلاحية.',
        "SAR le Prince Moulay Rachid a ainsi remis l'indication géographique “Amendes de Ghassate” à M. Mohamed Boussaksou, président de l'Union des coopératives Ougrour de la région Draa-Tafilalet, et l'appellation d'origine “cumin beldi d'Alnif” à M. Mohand Ihmadi, président du Groupement d'intérêt économique “Alnif Tafraouet Maaider”, de la région Draa-Tafilalet.":
            'وهكذا، سلم صاحب السمو الملكي الأمير مولاي رشيد شهادة المؤشر الجغرافي "لوز غساط" إلى السيد محمد بوسكسو، رئيس اتحاد تعاونيات أوكرور لجهة درعة-تافيلالت، وشهادة تسمية المنشأ "كمون بلدي ألنيف" إلى السيد محند احمدي، رئيس مجموعة ذات النفع الاقتصادي "ألنيف تفراوت مايدر" بجهة درعة-تافيلالت.',
        "Son Altesse Royale a aussi remis à M. Mohamed Haidach, président de la Coopérative agricole Haidach, de la région Béni-Mellal Khénifra, l'indication géographique “Piment doux Ouled Ali Fkih Ben Saleh”, et à M. Abderrahman Labiad, président de l'Association d'origine des produits oléicoles de Kelâa des Sraghna et ses entours, de la région Marrakech-Safi, l'indication géographique “Huile d'olive vierge-extra El Kelâa des Sraghna”.":
            'كما سلم صاحب السمو الملكي إلى السيد محمد هيداش، رئيس التعاونية الفلاحية هيداش بجهة بني ملال-خنيفرة، شهادة المؤشر الجغرافي "الفلفل الحلو لأولاد علي الفقيه بن صالح"، وإلى السيد عبد الرحمان لبياض، رئيس جمعية المنشأ للمنتوجات الزيتونية لقلعة السراغنة وضواحيها بجهة مراكش-آسفي، شهادة المؤشر الجغرافي "زيت الزيتون البكر الممتاز قلعة السراغنة".',

        /* ---------- Category page — heading & hero ---------- */
        'Toutes les actualités SPORT': 'جميع أخبار الرياضة',
        'Toutes les actualités POLITIQUE': 'جميع أخبار السياسة',
        'Toutes les actualités SOCIÉTÉ': 'جميع أخبار المجتمع',
        'Toutes les actualités ÉCONOMIE ET FINANCES': 'جميع أخبار الاقتصاد والمال',
        'Toutes les actualités ECONOMIE ET FINANCES': 'جميع أخبار الاقتصاد والمال',
        'Toutes les actualités CULTURE ET MÉDIAS': 'جميع أخبار الثقافة والإعلام',
        'Toutes les actualités CULTURE ET MEDIAS': 'جميع أخبار الثقافة والإعلام',
        'Toutes les actualités GRAND MAGHREB': 'جميع أخبار المغرب الكبير',
        'Toutes les actualités MONDE': 'جميع أخبار العالم',
        'Toutes les actualités ACTUALITÉS': 'جميع الأخبار',

        'Mardi, 14 Avril 2026': 'الثلاثاء 14 أبريل 2026',
        '16ème édition de la Course féminine de la Victoire : plus de 12.000 participantes':
            'الدورة الـ16 للسباق النسوي للنصر: أزيد من 12.000 مشاركة',
        "Rabat - La 16ème édition de la Course féminine de la Victoire, organisée dimanche à Rabat par l'Association « Femme, Réalisations et Valeurs » sous le Haut Patronage de SM le Roi Mohammed VI, a connu la participation de plus de 12.000 femmes de tous âges.":
            'الرباط - عرفت الدورة الـ16 للسباق النسوي للنصر، التي نظمتها يوم الأحد بالرباط جمعية "المرأة، إنجازات وقيم" تحت الرعاية السامية لصاحب الجلالة الملك محمد السادس، مشاركة أزيد من 12.000 امرأة من مختلف الأعمار.',

        /* ---------- Category page — news-by-category cards ---------- */
        "Guelmim: 256 athlètes au 14e Meeting fédéral d'athlétisme feu Hamoudi Bouhnana":
            'كلميم: 256 رياضيا في الملتقى الفيدرالي الـ14 لألعاب القوى المرحوم حمودي بوحنانة',
        "La 16ème édition de la Course féminine de la Victoire, organisée dimanche à Rabat par l'Association « Femme, Réalisations et Valeurs » sous le Haut Patronage de SM le Roi Mohammed VI, a connu la participation de plus de 12.000 femmes de tous âges.":
            'عرفت الدورة الـ16 للسباق النسوي للنصر، التي نظمتها يوم الأحد بالرباط جمعية "المرأة، إنجازات وقيم" تحت الرعاية السامية لصاحب الجلالة الملك محمد السادس، مشاركة أزيد من 12.000 امرأة من مختلف الأعمار.',

        'Al Haouz : Remise des prix aux vainqueurs de la 5e édition de la course "Sonasid High Atlas Ultra Trail"':
            'الحوز: تسليم الجوائز للفائزين في الدورة الخامسة لسباق "سوناسيد هاي أطلس ألترا تريل"',
        "La cérémonie de remise des prix aux vainqueurs de la 5e édition de la course \"Sonasid High Atlas Ultra Trail\" a eu lieu dimanche à la commune d'Ouirgane (province d'Al Haouz).":
            'احتضنت جماعة أوريكان (إقليم الحوز)، يوم الأحد، حفل تسليم الجوائز للفائزين في الدورة الخامسة لسباق "سوناسيد هاي أطلس ألترا تريل".',

        'Tanger: La 2e édition de la course "PRORUN TFZ" attire plus de 2.000 participants':
            'طنجة: الدورة الثانية لسباق "بروران تي إف زد" تستقطب أزيد من 2.000 مشارك',
        'La 2ème édition de la course de la zone franche de Tanger "PRORUN TFZ 2026", destinée aux cadres et employés des entreprises installées dans la zone franche, a attiré, dimanche, plus de 2.000 participants.':
            'استقطبت الدورة الثانية لسباق المنطقة الحرة بطنجة "بروران تي إف زد 2026"، الموجه لأطر ومستخدمي الشركات المتمركزة بالمنطقة الحرة، يوم الأحد، أزيد من 2.000 مشارك.',

        "M'diq: Clôture du Championnat national scolaire de volleyball":
            'المضيق: اختتام البطولة الوطنية المدرسية للكرة الطائرة',
        "La cérémonie de clôture du Championnat national scolaire de volleyball s'est tenue dans la ville de M'diq, marquant la fin d'une compétition qui a réuni les meilleures équipes scolaires du Royaume.":
            'احتضنت مدينة المضيق حفل اختتام البطولة الوطنية المدرسية للكرة الطائرة، إيذانا بنهاية منافسة جمعت أفضل الفرق المدرسية بالمملكة.',

        '"Sonasid High Atlas Ultra Trail" : Noureddine Bachqi (Hommes) et Aziza Raji (Dames) remportent l\'épreuve du 42 km':
            '"سوناسيد هاي أطلس ألترا تريل": نور الدين باشقي (ذكور) وعزيزة راجي (إناث) يفوزان بسباق 42 كلم',
        "Noureddine Bachqi chez les hommes et Aziza Raji chez les dames se sont adjugés l'épreuve reine du 42 km de la 5e édition du \"Sonasid High Atlas Ultra Trail\" disputée dans la commune d'Ouirgane.":
            'توج نور الدين باشقي في فئة الذكور وعزيزة راجي في فئة الإناث بسباق 42 كلم، السباق الرئيسي للدورة الخامسة من "سوناسيد هاي أطلس ألترا تريل" الذي جرت منافساته بجماعة أوريكان.',

        "Ligue des Champions: L'AS FAR se hisse en finale":
            'دوري أبطال إفريقيا: الجيش الملكي يبلغ النهائي',
        "Berkane – L'AS FAR a confirmé son grand retour sur la scène continentale en se qualifiant pour la finale de la Ligue des champions d'Afrique de football face à la Renaissance Berkane, malgré une défaite (0-1) au match retour disputé samedi soir au stade municipal de Berkane, profitant de sa victoire (2-0) à domicile lors […]":
            'بركان – أكد الجيش الملكي عودته القوية إلى الساحة القارية بتأهله إلى نهائي دوري أبطال إفريقيا لكرة القدم على حساب نهضة بركان، رغم هزيمته (0-1) في مباراة الإياب التي جرت مساء السبت بالملعب البلدي ببركان، مستفيدا من فوزه (2-0) عقر داره خلال […]',

        "Zakaria El Ouahdi : Jouer au Mondial serait l'aboutissement d'un rêve d'enfant":
            'زكرياء الوحدي: اللعب في المونديال سيكون تحقيقا لحلم الطفولة',
        "Le latéral droit du KRC Genk, Zakaria El Ouahdi, vise une place avec le Maroc au prochain Mondial, un objectif qu'il présente comme \"un rêve d'enfant\", malgré une concurrence particulièrement rude à son poste.":
            'يطمح الظهير الأيمن لفريق كي آر سي غينك، زكرياء الوحدي، إلى افتكاك مكانه ضمن المنتخب المغربي في المونديال المقبل، وهو هدف يعتبره "حلم طفولة"، رغم المنافسة الشديدة في مركزه.',

        "Fès : Une cinquantaine de participants à la 4e édition de l'Open Para-Karaté Kata":
            'فاس: حوالي خمسين مشاركا في الدورة الرابعة لكأس البارا-كراطي كاطا المفتوحة',
        "Quelque cinquante sportifs en situation de handicap ont participé, jeudi, à la 4e édition de l'Open Para-Karaté Kata, organisée à l'Université Euromed de Fès, à l'initiative de la Fondation Mohammed VI des Personnes en Situation de Handicap – Centre Fès (CNMH).":
            'شارك حوالي خمسين رياضيا في وضعية إعاقة، يوم الخميس، في الدورة الرابعة لكأس البارا-كراطي كاطا المفتوحة، التي نظمت بجامعة أورو-متوسطية بفاس، بمبادرة من مؤسسة محمد السادس للأشخاص في وضعية إعاقة - مركز فاس.',

        "Ouarzazate : Coup d'envoi de la 13è édition de l'Eco Trail Morocco":
            'ورزازات: انطلاق الدورة الـ13 لسباق "إيكو تريل المغرب"',
        "Le coup d'envoi de la 13ème édition de l'Eco Trail Morocco, une course à pied de 70 km répartie en trois étapes, a été donné, mercredi à Ouarzazate, avec la participation de plus de 300 coureurs.":
            'انطلقت يوم الأربعاء بورزازات الدورة الـ13 لسباق "إيكو تريل المغرب"، وهو سباق على الأقدام لمسافة 70 كلم موزعة على ثلاث مراحل، بمشاركة أزيد من 300 عداء.',

        /* ---------- Article details — body (Zakaria El Ouahdi) ---------- */
        "Bruxelles - Le latéral droit du KRC Genk, Zakaria El Ouahdi, vise une place avec le Maroc au prochain Mondial, un objectif qu'il présente comme “un rêve d'enfant”, malgré une concurrence particulièrement rude à son poste.":
            'بروكسل - يطمح الظهير الأيمن لفريق كي آر سي غينك، زكرياء الوحدي، إلى افتكاك مكانه ضمن المنتخب المغربي في المونديال المقبل، وهو هدف يقدمه على أنه "حلم طفولة"، رغم المنافسة الشديدة في مركزه.',
        "“Jouer une Coupe du monde avec le Maroc serait l'aboutissement d'un rêve d'enfant”, a confié Zakaria El Ouahdi dans un entretien publié samedi par le quotidien belge “HBVL”, reconnaissant dans le même temps que la concurrence pour une place en sélection reste “extrêmement forte”.":
            'وقال زكرياء الوحدي في حوار نشرته يوم السبت اليومية البلجيكية "إتش بي في إل": "اللعب في كأس العالم رفقة المنتخب المغربي سيكون تحقيقا لحلم الطفولة"، معترفا في الوقت ذاته بأن المنافسة على مكان داخل المنتخب الوطني تظل "قوية للغاية".',
        "“Achraf Hakimi est le meilleur latéral droit du monde, Noussair Mazraoui joue à Manchester United, et Omar El Hilali de l'Espanyol est aussi un joueur de très haut niveau”, a-t-il expliqué, notant que le sélectionneur national Mohamed Ouahbi dispose également de plusieurs options sur le flanc gauche, avec Salah-Eddine du PSV et El Karouani d'Utrecht.":
            'وأوضح: "أشرف حكيمي هو أفضل ظهير أيمن في العالم، ونصير مزراوي يلعب في صفوف مانشستر يونايتد، وعمر الهلالي لاعب إسبانيول هو الآخر من المستوى الرفيع"، مشيرا إلى أن الناخب الوطني محمد وهبي يتوفر كذلك على عدة خيارات في الجهة اليسرى، مع صلاح الدين لاعب بي إس في والقرواني لاعب أوتريخت.',
        "Appelé récemment en sélection A, Zakaria El Ouahdi (23 ans) a fait une première apparition en match amical face au Paraguay fin mars, espérant avoir “laissé une bonne impression”.":
            'وكان زكرياء الوحدي (23 سنة)، الذي تم استدعاؤه مؤخرا إلى المنتخب الأول، قد خاض أول ظهور له في مباراة ودية أمام الباراغواي في نهاية مارس، أملا في أن يكون قد "ترك انطباعا جيدا".',
        "Passé par les sélections de jeunes, il avait remporté la Coupe d'Afrique des nations U23 sous les ordres d'Issame Charaï, une expérience qu'il décrit comme déterminante dans son parcours international et dans le renforcement de son attachement au maillot marocain.":
            'وقد سبق له أن مر عبر المنتخبات الشابة، وتوج بكأس إفريقيا للأمم لأقل من 23 سنة تحت قيادة عصام الشرعي، وهي تجربة يصفها بأنها كانت حاسمة في مساره الدولي وفي تعزيز تعلقه بقميص المنتخب المغربي.',
        "A l'approche des prochaines échéances, le défenseur insiste sur la nécessité de continuer à progresser et de “prouver qu'il est en forme” malgré une saison exceptionnelle avec KRC Genk, marquée par 11 buts et 3 passes décisives en 37 matchs.":
            'ومع اقتراب الاستحقاقات المقبلة، يشدد المدافع على ضرورة مواصلة التطور و"إثبات أنه في حالة جيدة"، رغم موسم استثنائي مع كي آر سي غينك سجل خلاله 11 هدفا و3 تمريرات حاسمة في 37 مباراة.',
        "Zakaria El Ouahdi a été nommé Lion Belge 2025, une distinction qui récompense le meilleur joueur d'origine maghrébine évoluant dans le championnat de Belgique de première division.":
            'وقد تم اختيار زكرياء الوحدي ضمن "الأسد البلجيكي 2025"، وهي جائزة تُمنح لأفضل لاعب من أصول مغاربية يلعب في الدوري البلجيكي للقسم الأول.',

        /* ---------- Discover-more (generic article details) ---------- */
        'samedi, 18 avril, 2026 à 15:23': 'السبت 18 أبريل 2026 على الساعة 15:23',
        'samedi, 18 avril, 2026 à 11:07': 'السبت 18 أبريل 2026 على الساعة 11:07',
        'samedi, 18 avril, 2026 à 10:45': 'السبت 18 أبريل 2026 على الساعة 10:45',
        "Le Chef du gouvernement présente le bilan d'étape devant le Parlement":
            'رئيس الحكومة يقدم الحصيلة المرحلية أمام البرلمان',
        "Dialogue social : La revalorisation des salaires et l'amélioration du pouvoir d'achat en tête des revendications des centrales syndicales":
            'الحوار الاجتماعي: الزيادة في الأجور وتحسين القدرة الشرائية على رأس مطالب المركزيات النقابية',
        'Prévisions météorologiques pour le samedi 18 avril 2026':
            'النشرة الجوية ليوم السبت 18 أبريل 2026',

        /* ---------- Press releases ---------- */
        'Vendredi, 24 avril, 2026': 'الجمعة 24 أبريل 2026',

        "L'ONG Tibu Africa mobilise l'écosystème autour de l'emploi des jeunes par le sport":
            'منظمة "تيبو أفريقيا" غير الحكومية تعبئ المنظومة حول تشغيل الشباب عبر الرياضة',
        "La CNDP signe une convention DATA-TIKA avec l'Ordre des Experts comptables":
            'اللجنة الوطنية لمراقبة حماية المعطيات الشخصية توقع اتفاقية "داتا-تيكا" مع هيئة الخبراء المحاسبين',
        'Lancement de l’Association des Praticiens du Droit du Numérique et de la Data pour structurer le droit du numérique et des données au Maroc':
            'إطلاق جمعية ممارسي القانون الرقمي والمعطيات لهيكلة قانون الرقمي والمعطيات بالمغرب',
        "Lancement de l'Association des Praticiens du Droit du Numérique et de la Data pour structurer le droit du numérique et des données au Maroc":
            'إطلاق جمعية ممارسي القانون الرقمي والمعطيات لهيكلة قانون الرقمي والمعطيات بالمغرب',
        '5éme édition du Festival National des Arts Populaires Du Nord au Sahara marocain, les plus précieux émissaires en fête':
            'الدورة الخامسة للمهرجان الوطني للفنون الشعبية: من شمال المغرب إلى الصحراء المغربية، أنفس السفراء في حفل احتفالي',
        'GITEX Africa Morocco : Les priorités numériques du continent au cœur des débats':
            '"جيتكس أفريقيا المغرب": الأولويات الرقمية للقارة في صلب النقاشات'
    };

    /* Build NFC-normalised lookup */
    var T_NFC = {};
    Object.keys(T).forEach(function (k) {
        T_NFC[norm(k)] = T[k];
    });

    /* Case-insensitive lookup for short keys (≤ 40 chars) */
    var T_CI = {};
    Object.keys(T).forEach(function (k) {
        if (k.length <= 40) T_CI[norm(k).toLowerCase()] = T[k];
    });

    /* =========================================================
     * 3.4 Arabic content pools (fallback for untranslated long text)
     * ========================================================= */
    var AR_HEADLINES = [
        'برج محمد السادس: واجهة لتجدد العمارة بالمغرب، حسب وسيلة إعلام برازيلية',
        'المملكة المغربية تدين الهجوم المسلح الذي استهدف حفل استقبال بواشنطن، بحضور الرئيس الأمريكي دونالد ترامب',
        'المغرب والنمسا يوقعان مذكرة تفاهم لإرساء حوار استراتيجي',
        'الدورة الخامسة لتكوين الملاحظين الانتخابيين: الاتحاد الإفريقي يعترف بريادة المغرب في دعم الحكامة الديمقراطية بإفريقيا',
        'إطلاق دورة تكوين الملاحظين الانتخابيين للاتحاد الإفريقي: نصف عقد من الشراكة مع الاتحاد الإفريقي من أجل إفريقيا ديمقراطية ومزدهرة',
        'السياسة العمومية للأسرة في صلب الالتزام بحماية الأطفال من التسول والاستغلال (السيدة بن يحيى)',
        'تسجيل أزيد من 764 شكاية بالمنصة الرقمية “شكاية” الصحة خلال أربعة أيام من إطلاقها (السيد التهراوي)',
        'السيد أخنوش: الحصيلة الحكومية تتجاوز “10 التزامات” وتعكس إنجازات مدعومة بالأرقام والواقع الملموس',
        'طنجة .. متحف دار النيابة يعرض أعمال ماريانو فورتوني إي مارسال، أحد كبار نحاتي القرن التاسع عشر',
        'متحف القارة المستقبلي بالرباط في صلب زيارة السيد قطبي إلى بلجيكا',
        'بودشارت يبدع مع جمهور البيضاء بأصوات متناغمة ولباس أبيض موحد في عرض كورالي مبهر بمركب محمد الخامس',
        'المعرض الجهوي للكتاب في دورته التاسعة بزاكورة.. فرصة لتعزيز صلة القراء بعوالم النشر والإبداع',
        'يستعد المنتخب الوطني لكرة القدم لمباراته الودية المقبلة في الدار البيضاء.',
        'بطولة إفريقيا لألعاب القوى: المغرب يحرز ميدالية ذهبية جديدة',
        'التنس: المغربي الشاب رضا العمراني يتأهل إلى ربع نهائي بطولة مراكش.',
        'ولاية أمن سطات تنفي مزاعم تعرض فتاة لمحاولة للاستدراج والاختطاف من طرف سيدة بمدينة برشيد',
        'ولاية جهة طنجة -تطوان -الحسيمة تنفي قيام السلطات المحلية بمدينة طنجة بإجراء إحصاء لساكنة مدينة القصر الكبير المتواجدين حاليا بطنجة',
        'خبر زائف: مقاطع فيديو عن فيضانات في مدينة القصر الكبير (زائفة)'
    ];

    var AR_EXCERPTS = [
        'خبراء مغاربة وأجانب يقاربون بالرباط الدينامية التنموية متعددة الأبعاد بالأقاليم الجنوبية',
        'السيد البواري يشرف على إطلاق عدد من المشاريع المهيكلة بتطوان',
        'البنية التحتية القضائية بسلا تتعزز بقسم جديد لقضاء الأسرة',
        'رقمنة المنظومة الصحية يجب أن تنبني على منطق الإنصاف والولوج الشامل والسيادة الصحية في إفريقيا (السيد بجيجو)',
        'الدار البيضاء.. انطلاق فعاليات الدورة الأولى من “جيتكس مستقبل الصحة بإفريقيا – المغرب”',
        'الدورة الـ22 من “ربيع موسيقى الأليزي” بالصويرة، محطة استثنائية ستظل راسخة في الذاكرة (شهادات)',
        'ليبروفيل: السيد ولد الرشيد يمثل جلالة الملك في حفل الافتتاح الرسمي لقصر المؤتمرات “عمر بونغو أونديمبا”',
        'موسيقى الحجرة في موطنها بمدينة الرياح أو “السحر الصويري” متجسدا على أرض الواقع'
    ];
    var hlIdx = 0, exIdx = 0;

    /* =========================================================
     * 3.5 Core tryTranslate
     * ========================================================= */
    function tryTranslate(text) {
        if (!text) return null;
        var raw = text;
        var n = norm(raw);
        if (!n) return null;

        /* 1. Exact (normalised) */
        if (T_NFC.hasOwnProperty(n)) return T_NFC[n];

        /* 2. Case-insensitive for short strings */
        if (n.length <= 40) {
            var lower = n.toLowerCase();
            if (T_CI.hasOwnProperty(lower)) return T_CI[lower];
        }

        /* 3. Partial / substring match — restricted to avoid noise */
        var fullShort = n.length <= 80;
        var keys = Object.keys(T_NFC);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (k.length < 30 && !fullShort) continue;
            if (k.length < 4) continue;
            if (n.indexOf(k) !== -1) {
                return n.split(k).join(T_NFC[k]);
            }
        }

        /* 4. Month-name fallback */
        var monthed = translateMonths(raw);
        if (monthed !== raw) return monthed;

        return null;
    }

    /* =========================================================
     * 3.6 fillArabicContent — pool fill for long untranslated blocks
     * ========================================================= */
    function isUntranslated(text) {
        var t = (text || '').trim();
        return t.length > 25 && !/[؀-ۿ]/.test(t);
    }

    function setOnlyText(el, text) {
        /* Replace only the first text node to preserve <i> icons / nested elements */
        for (var n = el.firstChild; n; n = n.nextSibling) {
            if (n.nodeType === 3 && n.textContent.trim().length) {
                n.textContent = text;
                return;
            }
        }
        el.textContent = text;
    }

    function nextHeadline() {
        var v = AR_HEADLINES[hlIdx % AR_HEADLINES.length];
        hlIdx++;
        return v;
    }
    function nextExcerpt() {
        var v = AR_EXCERPTS[exIdx % AR_EXCERPTS.length];
        exIdx++;
        return v;
    }

    /* Try the dictionary first; only fall back to a pool excerpt
       if no dictionary entry matches. */
    function fillOrTranslate(el, poolFn) {
        if (el.children.length !== 0) return;
        if (!isUntranslated(el.textContent)) return;
        var dict = tryTranslate(el.textContent);
        if (dict !== null) {
            el.textContent = dict;
        } else {
            el.textContent = poolFn();
        }
    }

    function fillArabicContent(root) {
        if (!root || root.nodeType !== 1) return;

        /* Headings — only when they contain pure text (no nested elements) */
        root.querySelectorAll('h1, h2, h3').forEach(function (el) {
            fillOrTranslate(el, nextHeadline);
        });

        /* Heading > anchor (e.g. <h3><a>headline</a></h3>) */
        root.querySelectorAll('h1 > a, h2 > a, h3 > a').forEach(function (el) {
            fillOrTranslate(el, nextHeadline);
        });

        /* Paragraphs */
        root.querySelectorAll('p').forEach(function (el) {
            fillOrTranslate(el, nextExcerpt);
        });

        /* List items (ticker, latest news) */
        root.querySelectorAll('li').forEach(function (el) {
            fillOrTranslate(el, nextHeadline);
        });
    }

    /* =========================================================
     * 3.7 walkTree — dictionary pass over text nodes + placeholders
     * ========================================================= */
    function walkTree(root) {
        if (!root) return;
        if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;

        /* Text nodes */
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                var p = node.parentNode;
                if (!p) return NodeFilter.FILTER_REJECT;
                var tag = p.nodeName;
                if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        var node;
        var batch = [];
        while ((node = walker.nextNode())) batch.push(node);
        for (var i = 0; i < batch.length; i++) {
            var n = batch[i];
            var result = tryTranslate(n.textContent);
            if (result !== null) n.textContent = result;
        }

        /* Placeholders */
        var placeholders = root.querySelectorAll ? root.querySelectorAll('[placeholder]') : [];
        placeholders.forEach(function (el) {
            var v = el.getAttribute('placeholder');
            var r = tryTranslate(v);
            if (r !== null) el.setAttribute('placeholder', r);
        });
    }

    /* =========================================================
     * 3.8 MutationObserver — catches data-include async content
     *     and Alpine x-text reactive updates.
     * ========================================================= */
    var rafId = null;
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
            m.addedNodes.forEach(function (node) {
                if (node.nodeType === 1) {
                    fillArabicContent(node);
                    walkTree(node);
                } else if (node.nodeType === 3) {
                    var result = tryTranslate(node.textContent);
                    if (result !== null) {
                        node.textContent = result;
                    } else if (isUntranslated(node.textContent) && node.parentElement) {
                        var tag = node.parentElement.tagName;
                        if (tag === 'H1' || tag === 'H2' || tag === 'H3') {
                            node.textContent = nextHeadline();
                        } else if (tag === 'P') {
                            node.textContent = nextExcerpt();
                        }
                    }
                }
            });
            /* Handle character-data changes (Alpine x-text re-evaluations on the same node) */
            if (m.type === 'characterData' && m.target && m.target.nodeType === 3) {
                var r = tryTranslate(m.target.textContent);
                if (r !== null && r !== m.target.textContent) {
                    m.target.textContent = r;
                }
            }
        });
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(wireLangSwitcher);
    });

    /* =========================================================
     * 3.9 persistLang — keep ?lang=ar on every internal link
     * ========================================================= */
    function persistLang() {
        document.addEventListener('click', function (e) {
            var a = e.target;
            while (a && a.nodeName !== 'A') a = a.parentNode;
            if (!a || a.nodeName !== 'A') return;
            var href = a.getAttribute('href');
            if (!href) return;
            if (a.target === '_blank') return;
            if (/^(https?:)?\/\//i.test(href)) return;
            if (href.charAt(0) === '#') return;
            if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
            if (/[?&]lang=ar(\b|$)/.test(href)) return;

            e.preventDefault();
            var sep = href.indexOf('?') !== -1 ? '&' : '?';
            window.location.href = href + sep + 'lang=ar';
        }, true);
    }

    /* =========================================================
     * 3.10 PAGE_TITLES — translate <title> per page
     * ========================================================= */
    var PAGE_TITLES = {
        'Accueil | MAP Express': 'الرئيسية | ماب إكسبريس',
        'Catégorie | MAP Express': 'تصنيف | ماب إكسبريس',
        'Article Details | Map Express': 'تفاصيل المقال | ماب إكسبريس',
        'Article Princière Details | Map Express': 'تفاصيل المقال الأميري | ماب إكسبريس',
        'Article Royale Details | Map Express': 'تفاصيل المقال الملكي | ماب إكسبريس',
        'Activités Royales | MAP Express': 'الأنشطة الملكية | ماب إكسبريس',
        'Activités Princières | MAP Express': 'الأنشطة الأميرية | ماب إكسبريس',
        'MAP Live | MAP Express': 'ماب لايف | ماب إكسبريس',
        'MAP TV | MAP Express': 'ماب تي في | ماب إكسبريس',
        'MAP TV Details | Map Express': 'تفاصيل ماب تي في | ماب إكسبريس',
        'Communiqués de presse | MAP Express': 'بيانات صحفية | ماب إكسبريس',
        'Communiqués de presse détail | MAP Express': 'تفاصيل بلاغ صحفي | ماب إكسبريس'
    };

    /* =========================================================
     * 3.11 wireLangSwitcher — make the Arabe / Français links work
     *      Idempotent: safe to call repeatedly.
     * ========================================================= */
    function wireLangSwitcher() {
        var anchors = document.querySelectorAll('a');
        var pathname = window.location.pathname;
        var search = window.location.search;
        var baseURL = pathname + search.replace(/([?&])lang=ar(&|$)/, function (_, p, q) {
            if (p === '?' && q === '&') return '?';
            if (p === '&') return '';
            return '';
        }).replace(/\?$/, '');
        var arURL = pathname + (search ? (search.indexOf('lang=ar') !== -1 ? search : search + '&lang=ar') : '?lang=ar');

        anchors.forEach(function (a) {
            var t = (a.textContent || '').trim();
            /* Arabic switch link */
            if (t === 'العربية' || t === 'Arabe' || t === 'AR') {
                a.setAttribute('href', arURL);
            }
            /* French/Other switch link */
            if (t === 'Français' || t === 'الفرنسية' || t === 'FR') {
                a.setAttribute('href', baseURL || pathname);
            }
        });

        /* Globe-button label inside language switcher */
        var btns = document.querySelectorAll('.lang-switcher-btn span, button span');
        btns.forEach(function (s) {
            var v = (s.textContent || '').trim();
            if (v === 'Français') s.textContent = 'العربية';
        });
    }

    /* =========================================================
     * 3.12 init
     * ========================================================= */
    function init() {
        /* 1. <title> */
        try {
            var t = document.title;
            Object.keys(PAGE_TITLES).forEach(function (k) {
                if (t.indexOf(k) !== -1) {
                    document.title = PAGE_TITLES[k];
                }
            });
        } catch (e) {}

        /* 2. Persist ?lang=ar on internal nav */
        persistLang();

        /* 3. Observe future DOM (data-include async, Alpine reactivity) */
        try {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        } catch (e) {}

        /* 4. Pool fill long untranslated content first */
        fillArabicContent(document.body);

        /* 5. Dictionary pass */
        walkTree(document.body);

        /* 6. Wire the language switcher */
        wireLangSwitcher();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
