import { PrayerItem } from '../types/christianPrayer';

export const INITIAL_PRAYERS: PrayerItem[] = [
  // 1. Arrow Prayers (صلاة يسوع والصلوات السهمية)
  {
    id: 'arrow-1',
    category: 'arrow',
    textAr: 'يا ربي يسوع المسيح ابن الله الحي صَيِّرني إنساناً جديداً',
    textEn: 'Lord Jesus Christ, Son of the Living God, make me a new creation.',
    referenceAr: 'صلاة سهمية مأثورة',
    referenceEn: 'Traditional Arrow Prayer'
  },
  {
    id: 'arrow-2',
    category: 'arrow',
    textAr: 'يا ربي يسوع المسيح، ارحمني أنا الخاطئ',
    textEn: 'Lord Jesus Christ, have mercy on me, a sinner.',
    referenceAr: 'صلاة يسوع (Hesychasm)',
    referenceEn: 'The Jesus Prayer'
  },
  {
    id: 'arrow-3',
    category: 'arrow',
    textAr: 'يا ربي يسوع المسيح، أعني واحفظني في رضاك',
    textEn: 'Lord Jesus Christ, help me and preserve me in Your grace.',
    referenceAr: 'صلاة سهمية',
    referenceEn: 'Arrow Prayer'
  },
  {
    id: 'arrow-4',
    category: 'arrow',
    textAr: 'يا يسوع الحبيب، نَقِّ قلبي وثبّت فكري فيك',
    textEn: 'Beloved Jesus, purify my heart and fix my mind on You.',
    referenceAr: 'صلاة سهمية',
    referenceEn: 'Arrow Prayer'
  },
  {
    id: 'arrow-5',
    category: 'arrow',
    textAr: 'يا ربي يسوع، نورك يشرق في ظلمتي ويملأني سلاماً',
    textEn: 'Lord Jesus, let Your light shine in my darkness and fill me with peace.',
    referenceAr: 'صلاة سهمية',
    referenceEn: 'Arrow Prayer'
  },
  {
    id: 'arrow-6',
    category: 'arrow',
    textAr: 'يا ربي يسوع، أنت هو قوتي وسلامي ورجائي الوحيد',
    textEn: 'Lord Jesus, You are my strength, my peace, and my only hope.',
    referenceAr: 'صلاة سهمية',
    referenceEn: 'Arrow Prayer'
  },
  {
    id: 'arrow-7',
    category: 'arrow',
    textAr: 'يا ربي يسوع المسيح، لا تحرمني من شركتك القدوسة',
    textEn: 'Lord Jesus Christ, do not deprive me of Your holy fellowship.',
    referenceAr: 'صلاة سهمية',
    referenceEn: 'Arrow Prayer'
  },

  // 2. Prayers for Mercy & Repentance (صلوات المراحم والتوبة)
  {
    id: 'rep-1',
    category: 'repentance',
    textAr: 'ارحمني يا الله كعظيم رحمتك، ومثل كثرة رأفتك امحُ إثمي',
    textEn: 'Have mercy on me, O God, according to Your unfailing love; blot out my transgressions.',
    referenceAr: 'مزمور ٥٠ (٥١)',
    referenceEn: 'Psalm 51:1'
  },
  {
    id: 'rep-2',
    category: 'repentance',
    textAr: 'قلباً نقيّاً اخلق فيّ يا الله، وروحاً مستقيماً جدّد في أحشائي',
    textEn: 'Create in me a pure heart, O God, and renew a steadfast spirit within me.',
    referenceAr: 'مزمور ٥٠ : ١٠',
    referenceEn: 'Psalm 51:10'
  },
  {
    id: 'rep-3',
    category: 'repentance',
    textAr: 'يا رب لا تبكتني بغضبك ولا تؤدبني بغيظك، ارحمني يا رب فإني ضعيف',
    textEn: 'Lord, do not rebuke me in Your anger or discipline me in Your wrath. Have mercy, Lord, for I am faint.',
    referenceAr: 'مزمور ٦ : ١-٢',
    referenceEn: 'Psalm 6:1-2'
  },
  {
    id: 'rep-4',
    category: 'repentance',
    textAr: 'اللهم التفت إلى معونتي، يا رب أسرع وأعنّي',
    textEn: 'O God, come to my assistance; O Lord, make haste to help me.',
    referenceAr: 'مزمور ٦٩ (٧٠) : ١',
    referenceEn: 'Psalm 70:1'
  },
  {
    id: 'rep-5',
    category: 'repentance',
    textAr: 'أيها الصالح محب البشر، اغفر لي ذنوبي التي ارتكبتها بمعرفة وبغير معرفة',
    textEn: 'O Good Lover of mankind, forgive my sins, both known and unknown.',
    referenceAr: 'طلبة من صلوات الأجبية',
    referenceEn: 'Agpeya Supplication'
  },

  // 3. Prayers for Blessing & Strength (صلوات البركة والمعونة والقوة)
  {
    id: 'bless-1',
    category: 'blessing',
    textAr: 'الرب نوري وخلاصي ممن أخاف، الرب حصن حياتي ممن أرتعب',
    textEn: 'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life.',
    referenceAr: 'مزمور ٢٧ : ١',
    referenceEn: 'Psalm 27:1'
  },
  {
    id: 'bless-2',
    category: 'blessing',
    textAr: 'أستطيع كل شيء في المسيح الذي يقويني',
    textEn: 'I can do all things through Christ who strengthens me.',
    referenceAr: 'فيلبي ٤ : ١٣',
    referenceEn: 'Philippians 4:13'
  },
  {
    id: 'bless-3',
    category: 'blessing',
    textAr: 'سلاماً أترك لكم، سلامي أعطيكم، لا تضطرب قلوبكم ولا ترهب',
    textEn: 'Peace I leave with you; my peace I give you. Do not let your hearts be troubled and do not be afraid.',
    referenceAr: 'يوحنا ١٤ : ٢٧',
    referenceEn: 'John 14:27'
  },
  {
    id: 'bless-4',
    category: 'blessing',
    textAr: 'الرب راعيّ فلا يعوزني شيء، في مراعٍ خضر يربضني، وإلى مياه الراحة يوردني',
    textEn: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, He leads me beside quiet waters.',
    referenceAr: 'مزمور ٢٣ : ١-٢',
    referenceEn: 'Psalm 23:1-2'
  },
  {
    id: 'bless-5',
    category: 'blessing',
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
