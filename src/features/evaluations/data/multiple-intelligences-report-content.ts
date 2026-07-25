import type { MultipleIntelligencesCode } from './multiple-intelligences-codes'

export type MiReportDimensionContent = {
  title: string
  subtitle: string
  definition: string
  peakAge: string
  developmentTips: string[]
  careers: string[]
}

export type MiReportContent = {
  reportTitle: string
  parentGreeting: string
  intro: string
  top3Title: string
  top3Intro: string
  allDimensionsTitle: string
  scoreLabel: string
  definitionLabel: string
  peakAgeLabel: string
  developmentLabel: string
  careersLabel: string
  footerNote: string
  dimensions: Record<MultipleIntelligencesCode, MiReportDimensionContent>
}

const ar: MiReportContent = {
  reportTitle: 'تقرير مؤشر الذكاءات المتعددة',
  parentGreeting: 'عزيزي ولي الأمر،',
  intro:
    'نشكرك على مشاركتك في نتائج مؤشر الذكاءات المتعددة لطفلك، والتي تم استكمالها بناءً على إجاباتك على الأسئلة السابقة. نود أن نلفت انتباهك إلى أنه قد يكون للطفل ذكاء أو أكثر بارزاً على المستوى المعرفي. وبناءً على الإجابات، فإن الذكاءات البارزة لدى طفلك:',
  top3Title: 'الذكاءات البارزة لدى طفلك',
  top3Intro: 'هذه هي أعلى ثلاث ذكاءات بناءً على نتائج التقييم:',
  allDimensionsTitle: 'ملخص درجات جميع الذكاءات',
  scoreLabel: 'الدرجة',
  definitionLabel: 'التعريف',
  peakAgeLabel: 'الخصائص العمرية والبيولوجية',
  developmentLabel: 'كيف تُنمّي هذا الذكاء لدى طفلك',
  careersLabel: 'المهن والمجالات المحتملة',
  footerNote:
    'لا تنسَ أن تطلب فلترة الذكاءات الأخرى أيضاً. يمكنك الآلية استثمار وتنمية طفلك وفق الأنشطة والبرامج والألعاب الأقرب لذكاءاته البارزة.',
  dimensions: {
    linguistic: {
      title: 'الذكاء اللغوي',
      subtitle: 'Linguistic Intelligence',
      definition:
        'يتمتع الطفل بقدرة عالية على فهم واستخدام اللغة والمفردات والقواعد. يرتبط هذا الذكاء بـ «الكلام» وفهم المعاني والأصوات والتراكيب اللغوية. يتميز الطفل باستخدام اللغة بمهارة في القراءة أو الحديث أو السرد.',
      peakAge:
        'يظهر بوضوح في مرحلة الذروة (Peak) مع استمرار طبيعي منذ الرضاعة. يبدأ مع اللغة من سن 6 سنوات ويمكن أن يتحسن مع العمر والممارسة.',
      developmentTips: [
        'طرح الأسئلة والإجابة عليها',
        'المحادثة والحوار',
        'اقتناء كتب كبيرة مناسبة للعمر',
        'تعلم لغات جديدة بحماس',
        'الألعاب اللفظية والكلمات المتقاطعة',
        'القراءة والكتابة',
        'التعلم عبر الاستماع والقراءة والكتابة',
      ],
      careers: [
        'شاعر',
        'راوٍ',
        'مذيع',
        'صحفي',
        'محامٍ',
        'كاتب',
        'طبيب',
        'إعلامي',
        'استشارات نفسية',
        'كتابة إبداعية',
        'مجالات اجتماعية',
        'صحافة',
        'إعلام',
        'تعليم',
      ],
    },
    logical: {
      title: 'الذكاء المنطقي الرياضي',
      subtitle: 'Logical / Mathematical Intelligence',
      definition:
        'يتمتع الطفل بقدرة على اكتشاف الأنماط والعلاقات بين الظواهر وحل المشكلات والتفكير المنطقي والاستنتاجي. يرتبط بالتفكير التسلسلي والرياضيات والتجريب.',
      peakAge:
        'يظهر في مرحلة الذروة مع استمرار طبيعي. يتوقف نموه مؤقتاً في المراهقة (12–18 سنة) ثم يتحسن في مرحلة الشباب والجامعة.',
      developmentTips: [
        'حل الألغاز والألعاب المنطقية',
        'التعامل مع الأرقام والمقاييس',
        'فهم كيفية عمل الأشياء',
        'أنشطة تعتمد على قواعد محددة',
        'التجارب العملية',
        'تصنيف الأشياء',
        'تحويل المشكلات إلى معادلات',
        'تعلم التصنيف والأنماط والعلاقات والرسوم البيانية',
      ],
      careers: [
        'عالم رياضيات',
        'عالم',
        'اقتصادي',
        'مبرمج',
        'محاسب',
        'طبيب',
        'عالم أحياء',
        'مهندس',
        'محامٍ',
        'عالم فيزياء',
        'إحصائي',
        'بحث علمي',
        'هندسة',
        'طب',
      ],
    },
    spatial: {
      title: 'الذكاء البصري المكاني',
      subtitle: 'Visual / Spatial Intelligence',
      definition:
        'يتمتع الطفل بقدرة على إدراك الأشياء ثلاثية الأبعاد والتصور الذهني والتوازن وتكوين الصور. يلعب التفكير البصري والمكاني دوراً أساسياً في الرسم والتصميم والملاحة.',
      peakAge:
        'يظهر بوضوح في المرحلة المتوسطة (6–12 سنة). يتأثر بالصدمات النفسية وقد يتراجع مؤقتاً ثم يستقر.',
      developmentTips: [
        'الرسم والتلوين والتصميم',
        'حل الألغاز البصرية',
        'بناء وتصميم الأشياء',
        'إدراك العلاقات بين الأجزاء',
        'التعامل مع الأدوات والآلات',
        'تذكر الأماكن من خلال الصور',
        'تفسير الخرائط والرسوم',
        'التعلم عبر الرسم والتصوير والخرائط والصور',
      ],
      careers: [
        'مصمم داخلي',
        'رسام',
        'مصمم مواقع إلكترونية أو أماكن',
        'مهندس معماري',
        'مصور',
        'جرافيك',
        'مصمم أزياء',
        'رسام خرائط',
        'طيار',
        'مهندس',
      ],
    },
    bodily: {
      title: 'الذكاء الجسدي الحركي',
      subtitle: 'Bodily / Kinaesthetic Intelligence',
      definition:
        'يتمتع الطفل بقدرة على استخدام جسده بمهارة في الأنشطة الرياضية والفنية واليدوية والتعبير الحركي. يرتبط بالتنسيق الحركي والتحكم في الجسد.',
      peakAge:
        'يظهر في مرحلة الذروة. يتوقف مؤقتاً في المراهقة ثم يصل إلى ذروة جديدة مع استمرار التطور في مرحلة الشباب.',
      developmentTips: [
        'التوازن والرقص',
        'التنسيق والإيماءات الحركية',
        'الفهم عبر الجسد والحركة',
        'الزراعة والأنشطة الحركية البصرية',
        'التعامل مع الأشياء الصغيرة',
        'تنمية الأنشطة الجسدية مثل الرياضة والرقص والتمثيل',
        'التعلم عبر اللمس والحركة واللعب مع الحيوانات',
      ],
      careers: [
        'رياضي محترف',
        'راقص',
        'جراح',
        'ممثل',
        'نحات',
        'حرفي',
        'فني',
        'ميكانيكي',
        'رقص',
        'تمثيل',
        'رياضة',
      ],
    },
    musical: {
      title: 'الذكاء الموسيقي',
      subtitle: 'Musical Intelligence',
      definition:
        'يتمتع الطفل بقدرة على الإحساس بالإيقاع والنغمات والتعبير الموسيقي وتذكر الألحان. يرتبط بالحساسية للأصوات والتناغم.',
      peakAge:
        'يظهر جيداً في الرضاعة ويستمر من سن سنتين. يبقى قوياً ومستقراً حتى سن المراهقة.',
      developmentTips: [
        'الإحساس بالإيقاع والنغمات',
        'الغناء والترديد',
        'الاستماع لأصوات متنوعة',
        'الإحساس بالإيقاع المناسب',
        'تذكر الأناشيد والألحان',
        'تغيير الإيقاعات والألحان',
        'التعلم عبر الموسيقى والأناشيد والإيقاع',
      ],
      careers: [
        'ملحن',
        'مذيع',
        'مغني',
        'عازف',
        'موزع',
        'منتج موسيقي',
        'معلم موسيقى',
        'منشد',
        'فنان',
      ],
    },
    interpersonal: {
      title: 'الذكاء الاجتماعي',
      subtitle: 'Interpersonal Intelligence',
      definition:
        'يتمتع الطفل بقدرة على فهم الآخرين والتفاعل معهم والتعاطف والقيادة والعمل الجماعي. يرتبط بـ «قراءة» الناس والتأثير فيهم.',
      peakAge:
        'يظهر في المرحلة المتوسطة للمراهقة (14–17 سنة). يستمر التطور بعد المراهقة مع نضج التفاعل الاجتماعي.',
      developmentTips: [
        'التواصل والاتصال الفعّال مع الآخرين',
        'التعاون والمشاركة',
        'العمل الجماعي',
        'ملاحظة تعابير الوجه المختلفة',
        'الوقوف في موقف الآخرين',
        'التعاون مع الآخرين',
        'قيادة الأقران في اللعب',
        'التعلم بالمشاركة واللعب',
      ],
      careers: [
        'معلم',
        'مرشد اجتماعي',
        'موظف علاقات عامة',
        'سياسي',
        'رجل دين',
        'إداري',
        'ممرض',
        'مضيف',
        'مدير',
        'دبلوماسي',
        'أخصائي اجتماعي',
        'تعليم',
        'إدارة',
        'علاقات عامة',
      ],
    },
    intrapersonal: {
      title: 'الذكاء الذاتي',
      subtitle: 'Intrapersonal Intelligence',
      definition:
        'يتمتع الطفل بقدرة على فهم ذاته ومشاعره الداخلية ودوافعه ونقاط قوته. يُعد من أصعب الذكاءات قياساً ويرتبط بالوعي الذاتي والتأمل.',
      peakAge:
        'يظهر في مرحلة المراهقة المتوسطة (14–17 سنة). يستمر النمو بعد المراهقة مع نضج الهوية.',
      developmentTips: [
        'التأمل والتفكير العميق',
        'الوعي الذاتي العالي',
        'التركيز الذهني والوقت الهادئ',
        'التعبير عن المشاعر بدقة',
        'نقاط القوة والضعف',
        'تحديد الأهداف وتحقيقها',
        'التعلم الذاتي',
      ],
      careers: [
        'كاتب',
        'باحث',
        'مرشد نفسي',
        'فيلسوف',
        'رائد أعمال',
        'نفسي',
        'عالم',
        'كاتب يوميات',
        'استشارات',
      ],
    },
    naturalist: {
      title: 'الذكاء الطبيعي البيئي',
      subtitle: 'Naturalistic Intelligence',
      definition:
        'يتمتع الطفل بقدرة على إدراك الظواهر الطبيعية والكائنات الحية والبيئة والتصنيف والملاحظة الدقيقة للطبيعة.',
      peakAge:
        'يظهر في المرحلة المتوسطة (6–12 سنة). يتوقف مؤقتاً في المراهقة ثم يتطور مع الاهتمام المستمر بالبيئة.',
      developmentTips: [
        'الاهتمام بالكائنات الحية والبيئة',
        'البحث والتعلم عن الطبيعة والحيوانات والنباتات',
        'الاهتمام بالتغيرات في البيئة',
        'التصنيف الدقيق للأشياء',
        'استكشاف الطبيعة والزراعة',
        'الاهتمام بالمحافظة على البيئة',
        'الأنشطة التي تظهر عند الطفل',
        'برامج وثائقية عن الحياة الطبيعية',
        'كتابة مذكرات علمية',
        'تصنيف النباتات والحيوانات',
      ],
      careers: [
        'عالم أحياء',
        'عالم حيوانات',
        'عالم نباتات',
        'جيولوجي',
        'طبيب بيطري',
        'مزارع',
        'طبيب بيئي',
        'باحث بيئي',
      ],
    },
  },
}

const en: MiReportContent = {
  reportTitle: 'Multiple Intelligences Report',
  parentGreeting: 'Dear Parent,',
  intro:
    'Thank you for completing the multiple intelligences assessment for your child. Based on your answers, the following intelligences appear most prominent at the cognitive level:',
  top3Title: 'Your Child\'s Prominent Intelligences',
  top3Intro: 'These are the top three intelligences based on the assessment results:',
  allDimensionsTitle: 'All Intelligence Scores',
  scoreLabel: 'Score',
  definitionLabel: 'Definition',
  peakAgeLabel: 'Age & developmental characteristics',
  developmentLabel: 'How to develop this intelligence',
  careersLabel: 'Potential careers & fields',
  footerNote:
    'Remember to nurture other intelligences as well. Use activities, programs, and games aligned with your child\'s prominent intelligences.',
  dimensions: {
    linguistic: {
      title: 'Linguistic Intelligence',
      subtitle: 'Linguistic Intelligence',
      definition:
        'Strong ability to understand and use language, vocabulary, and grammar. Linked to speech, meaning, sounds, and linguistic structures.',
      peakAge:
        'Visible during the peak period from infancy; language skills grow from age 6 and can improve with practice.',
      developmentTips: [
        'Ask and answer questions',
        'Conversation and dialogue',
        'Age-appropriate books',
        'Learn new languages',
        'Word games and crosswords',
        'Reading and writing',
        'Learning through listening, reading, and writing',
      ],
      careers: ['Poet', 'Storyteller', 'Broadcaster', 'Journalist', 'Lawyer', 'Writer', 'Doctor', 'Media', 'Teaching'],
    },
    logical: {
      title: 'Logical-Mathematical Intelligence',
      subtitle: 'Logical / Mathematical Intelligence',
      definition:
        'Ability to detect patterns, relationships, solve problems, and think logically and inferentially.',
      peakAge: 'Peak in childhood; may plateau in adolescence (12–18) then develop further in young adulthood.',
      developmentTips: [
        'Puzzles and logic games',
        'Numbers and measurement',
        'Understanding how things work',
        'Rule-based activities',
        'Experiments',
        'Classification',
        'Turning problems into equations',
      ],
      careers: ['Mathematician', 'Scientist', 'Economist', 'Programmer', 'Accountant', 'Doctor', 'Engineer'],
    },
    spatial: {
      title: 'Visual-Spatial Intelligence',
      subtitle: 'Visual / Spatial Intelligence',
      definition:
        'Ability to perceive 3D objects, mental imagery, balance, and visual-spatial reasoning.',
      peakAge: 'Strong in middle childhood (6–12); may fluctuate then stabilize.',
      developmentTips: [
        'Drawing, coloring, design',
        'Visual puzzles',
        'Building and designing',
        'Maps and diagrams',
        'Learning through images and models',
      ],
      careers: ['Interior designer', 'Artist', 'Architect', 'Photographer', 'Pilot', 'Engineer'],
    },
    bodily: {
      title: 'Bodily-Kinesthetic Intelligence',
      subtitle: 'Bodily / Kinaesthetic Intelligence',
      definition:
        'Skillful use of the body in sports, crafts, dance, and physical expression.',
      peakAge: 'Peak in early childhood; another peak may emerge in adolescence and young adulthood.',
      developmentTips: [
        'Balance and dance',
        'Sports and movement',
        'Hands-on learning',
        'Crafts and building',
        'Acting and role-play',
      ],
      careers: ['Athlete', 'Dancer', 'Surgeon', 'Actor', 'Craftsperson', 'Mechanic'],
    },
    musical: {
      title: 'Musical Intelligence',
      subtitle: 'Musical Intelligence',
      definition:
        'Sensitivity to rhythm, pitch, melody, and musical expression.',
      peakAge: 'Emerges in infancy; remains strong through adolescence.',
      developmentTips: [
        'Rhythm and pitch awareness',
        'Singing and humming',
        'Listening to varied music',
        'Remembering songs and melodies',
      ],
      careers: ['Composer', 'Singer', 'Musician', 'Music teacher', 'Producer'],
    },
    interpersonal: {
      title: 'Interpersonal Intelligence',
      subtitle: 'Interpersonal Intelligence',
      definition:
        'Understanding others, empathy, leadership, and cooperative interaction.',
      peakAge: 'Develops prominently in mid-adolescence (14–17) and continues into adulthood.',
      developmentTips: [
        'Active communication',
        'Teamwork',
        'Reading social cues',
        'Perspective-taking',
        'Peer leadership in play',
      ],
      careers: ['Teacher', 'Counselor', 'Politician', 'Manager', 'Nurse', 'Diplomat'],
    },
    intrapersonal: {
      title: 'Intrapersonal Intelligence',
      subtitle: 'Intrapersonal Intelligence',
      definition:
        'Self-awareness of feelings, motives, strengths, and personal goals.',
      peakAge: 'Emerges in mid-adolescence (14–17) with identity development.',
      developmentTips: [
        'Reflection and quiet time',
        'Journaling',
        'Goal setting',
        'Emotional awareness',
        'Independent learning',
      ],
      careers: ['Writer', 'Researcher', 'Psychologist', 'Philosopher', 'Entrepreneur'],
    },
    naturalist: {
      title: 'Naturalistic Intelligence',
      subtitle: 'Naturalistic Intelligence',
      definition:
        'Observing, classifying, and understanding nature, living things, and the environment.',
      peakAge: 'Strong in middle childhood (6–12); can grow with sustained environmental interest.',
      developmentTips: [
        'Nature walks and gardening',
        'Learning about animals and plants',
        'Environmental care',
        'Classification activities',
        'Science documentaries',
      ],
      careers: ['Biologist', 'Veterinarian', 'Geologist', 'Farmer', 'Environmental scientist'],
    },
  },
}

export function getMultipleIntelligencesReportContent(locale: string): MiReportContent {
  return locale.startsWith('ar') ? ar : en
}
