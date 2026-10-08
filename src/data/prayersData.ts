import { PrayerItem } from '../types/christianPrayer';

export const INITIAL_PRAYERS: PrayerItem[] = [
  // 1. Arrow Prayers (صلاة يسوع والصلوات السهمية)
  {
    id: 'arrow-1',
    category: 'arrow',
    sourceType: 'prayer',
    textAr: 'يا ربي يسوع المسيح ابن الله الحي صَيِّرني إنساناً جديداً',
    textEn: 'Lord Jesus Christ, Son of the Living God, make me a new creation.',
    referenceAr: 'صلاة سهمية مأثورة',
    referenceEn: 'Traditional Arrow Prayer'
  },
  {
    id: 'arrow-2',
    category: 'arrow',
    sourceType: 'prayer',
    textAr: 'يا ربي يسوع المسيح، ارحمني أنا الخاطئ',
    textEn: 'Lord Jesus Christ, have mercy on me, a sinner.',
    referenceAr: 'صلاة يسوع (Hesychasm)',
    referenceEn: 'The Jesus Prayer'
  },
  {
    id: 'arrow-3',
    category: 'arrow',
    sourceType: 'prayer',
    textAr: 'يا ربي يسوع المسيح، أعني واحفظني في رضاك',
    textEn: 'Lord Jesus Christ, help me and preserve me in Your grace.',
    referenceAr: 'صلاة سهمية',
    referenceEn: 'Arrow Prayer'
  },
  {
    id: 'arrow-4',
    category: 'arrow',
    sourceType: 'prayer',
    textAr: 'يا يسوع الحبيب، نَقِّ قلبي وثبّت فكري فيك',
    textEn: 'Beloved Jesus, purify my heart and fix my mind on You.',
    referenceAr: 'صلاة سهمية',
    referenceEn: 'Arrow Prayer'
  },
  {
    id: 'arrow-5',
    category: 'arrow',
    sourceType: 'patristic',
    fatherNameAr: 'يوحنا ذهبي الفم',
    fatherNameEn: 'St. John Chrysostom',
    textAr: 'اسم يسوع المسيح سلاح غالب لكل حزن، فالصلاة باسمه تملأ القلب سلاماً وفرحاً حقيقياً',
    textEn: 'The name of Jesus Christ is a victorious weapon against all sorrow; prayer in His name fills the heart with true joy.',
    referenceAr: 'أقوال الأب يوحنا ذهبي الفم',
    referenceEn: 'Sayings of St. John Chrysostom'
  },
  {
    id: 'arrow-6',
    category: 'arrow',
    sourceType: 'patristic',
    fatherNameAr: 'أنطونيوس الكبير',
    fatherNameEn: 'St. Anthony the Great',
    textAr: 'داوم على ذكر الرب يسوع، فإن ذكره يحرس الذهن ويطرد كل اضطراب ويملأ النفس حلاوة',
    textEn: 'Persist in remembering the Lord Jesus, for remembering Him guards the mind and fills the soul with divine sweetness.',
    referenceAr: 'أقوال الأب أنطونيوس الكبير',
    referenceEn: 'Sayings of St. Anthony the Great'
  },
  {
    id: 'arrow-7',
    category: 'arrow',
    sourceType: 'prayer',
    textAr: 'يا ربي يسوع، نورك يشرق في ظلمتي ويملأني سلاماً',
    textEn: 'Lord Jesus, let Your light shine in my darkness and fill me with peace.',
    referenceAr: 'صلاة سهمية',
    referenceEn: 'Arrow Prayer'
  },
  {
    id: 'arrow-8',
    category: 'arrow',
    sourceType: 'patristic',
    fatherNameAr: 'إسحق السرياني',
    fatherNameEn: 'St. Isaac the Syrian',
    textAr: 'كلما التصقت النفس باسم الرب يسوع في هدوء، استنارت بنعمة الروح القدس وهربت عنها الظلمة',
    textEn: 'The more the soul clings to the name of the Lord Jesus in quietness, the more it is enlightened by the Holy Spirit.',
    referenceAr: 'أقوال الأب إسحق السرياني',
    referenceEn: 'Sayings of St. Isaac the Syrian'
  },

  // 2. Prayers for Mercy & Repentance (صلوات المراحم والتوبة)
  {
    id: 'rep-1',
    category: 'repentance',
    sourceType: 'verse',
    textAr: 'ارحمني يا الله كعظيم رحمتك، ومثل كثرة رأفتك امحُ إثمي',
    textEn: 'Have mercy on me, O God, according to Your unfailing love; blot out my transgressions.',
    referenceAr: 'مزمور ٥١ : ١',
    referenceEn: 'Psalm 51:1'
  },
  {
    id: 'rep-2',
    category: 'repentance',
    sourceType: 'verse',
    textAr: 'قلباً نقيّاً اخلق فيّ يا الله، وروحاً مستقيماً جدّد في أحشائي',
    textEn: 'Create in me a pure heart, O God, and renew a steadfast spirit within me.',
    referenceAr: 'مزمور ٥١ : ١٠',
    referenceEn: 'Psalm 51:10'
  },
  {
    id: 'rep-3',
    category: 'repentance',
    sourceType: 'verse',
    textAr: 'يا رب لا تبكتني بغضبك ولا تؤدبني بغيظك، ارحمني يا رب فإني ضعيف',
    textEn: 'Lord, do not rebuke me in Your anger or discipline me in Your wrath. Have mercy, Lord, for I am faint.',
    referenceAr: 'مزمور ٦ : ١-٢',
    referenceEn: 'Psalm 6:1-2'
  },
  {
    id: 'rep-4',
    category: 'repentance',
    sourceType: 'verse',
    textAr: 'اللهم التفت إلى معونتي، يا رب أسرع وأعنّي',
    textEn: 'O God, come to my assistance; O Lord, make haste to help me.',
    referenceAr: 'مزمور ٧٠ : ١',
    referenceEn: 'Psalm 70:1'
  },
  {
    id: 'rep-5',
    category: 'repentance',
    sourceType: 'patristic',
    fatherNameAr: 'متى المسكين',
    fatherNameEn: 'Father Matta El Meskeen',
    textAr: 'التوبة ليست مجرد حزن على الخطية، بل هي الارتماء الكامل في أحضان محبة المسيح الغافرة',
    textEn: 'Repentance is not merely sorrow over sin, but casting oneself wholly into the forgiving embrace of Christ’s love.',
    referenceAr: 'أقوال الأب متى المسكين',
    referenceEn: 'Sayings of Father Matta El Meskeen'
  },
  {
    id: 'rep-6',
    category: 'repentance',
    sourceType: 'prayer',
    textAr: 'أيها الصالح محب البشر، اغفر لي ذنوبي التي ارتكبتها بمعرفة وبغير معرفة',
    textEn: 'O Good Lover of mankind, forgive my sins, both known and unknown.',
    referenceAr: 'طلبة من صلوات الأجبية',
    referenceEn: 'Agpeya Supplication'
  },

  // 3. Prayers for Blessing & Strength (صلوات البركة والمعونة والقوة)
  {
    id: 'bless-1',
    category: 'blessing',
    sourceType: 'verse',
    textAr: 'الرب نوري وخلاصي ممن أخاف، الرب حصن حياتي ممن أرتعب',
    textEn: 'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life.',
    referenceAr: 'مزمور ٢٧ : ١',
    referenceEn: 'Psalm 27:1'
  },
  {
    id: 'bless-2',
    category: 'blessing',
    sourceType: 'verse',
    textAr: 'أستطيع كل شيء في المسيح الذي يقويني',
    textEn: 'I can do all things through Christ who strengthens me.',
    referenceAr: 'فيلبي ٤ : ١٣',
    referenceEn: 'Philippians 4:13'
  },
  {
    id: 'bless-3',
    category: 'blessing',
    sourceType: 'verse',
    textAr: 'سلاماً أترك لكم، سلامي أعطيكم، لا تضطرب قلوبكم ولا ترهب',
    textEn: 'Peace I leave with you; my peace I give you. Do not let your hearts be troubled and do not be afraid.',
    referenceAr: 'يوحنا ١٤ : ٢٧',
    referenceEn: 'John 14:27'
  },
  {
    id: 'bless-4',
    category: 'blessing',
    sourceType: 'verse',
    textAr: 'الرب راعيّ فلا يعوزني شيء، في مراعٍ خضر يربضني، وإلى مياه الراحة يوردني',
    textEn: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, He leads me beside quiet waters.',
    referenceAr: 'مزمور ٢٣ : ١-٢',
    referenceEn: 'Psalm 23:1-2'
  },
  {
    id: 'bless-5',
    category: 'blessing',
    sourceType: 'patristic',
    fatherNameAr: 'أغسطينوس',
    fatherNameEn: 'St. Augustine',
    textAr: 'جلستُ على قمة العالم حينما أحسستُ في نفسي أني لا أشتهي شيئاً ولا أخاف شيئاً إلا المسيح',
    textEn: 'I stood on the pinnacle of the world when I felt within myself that I desired nothing and feared nothing but Christ.',
    referenceAr: 'أقوال الأب أغسطينوس',
    referenceEn: 'Sayings of St. Augustine'
  },
  {
    id: 'bless-6',
    category: 'blessing',
    sourceType: 'prayer',
    textAr: 'يا رب بارك يومي، واجعل عمل يديّ لمجد اسمك القدوس، واملأ بيتي وأحبائي بنعمتك',
    textEn: 'Lord, bless my day, let the work of my hands glorify Your holy name, and fill my home with Your grace.',
    referenceAr: 'صلاة معونة وبركة',
    referenceEn: 'Prayer of Blessing'
  }
];

export const CATEGORY_LABELS = {
  ar: {
    arrow: 'الصلاة السهمية',
    repentance: 'المراحم والتوبة',
    blessing: 'البركة والقوة والمعونة',
    personal: 'طلبات وصلوات شخصية',
    all: 'جميع الصلوات'
  },
  en: {
    arrow: 'Arrow Prayer (Jesus Prayer)',
    repentance: 'Mercy & Repentance',
    blessing: 'Blessing & Strength',
    personal: 'Personal Prayers',
    all: 'All Prayers'
  }
};
