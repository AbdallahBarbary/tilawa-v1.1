export interface Teacher {
  id: string;
  name: string;
  nameAr: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specializations: string[];
  languages: string[];
  experience: string;
  bio: string;
  pricePerSession: string;
  isVerified: boolean;
  isOnline: boolean;
  totalStudents: number;
  sessionsCompleted: number;
  nextAvailable: string;
  country: string;
}

export interface Session {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'tajweed' | 'hifz' | 'tafseer' | 'recitation';
}

export interface Category {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  description: string;
  teacherCount: number;
  color: string;
}

export const categories: Category[] = [
  {
    id: '1',
    title: 'Tajweed',
    titleAr: 'تجويد',
    icon: 'tajweed',
    description: 'Master the rules of Quran recitation',
    teacherCount: 128,
    color: '#3A6B35',
  },
  {
    id: '2',
    title: 'Hifz',
    titleAr: 'حفظ',
    icon: 'hifz',
    description: 'Memorize the Holy Quran with guidance',
    teacherCount: 95,
    color: '#2D5A27',
  },
  {
    id: '3',
    title: 'Tafseer',
    titleAr: 'تفسير',
    icon: 'tafseer',
    description: 'Understand the deeper meanings',
    teacherCount: 67,
    color: '#C9A84C',
  },
  {
    id: '4',
    title: 'Recitation',
    titleAr: 'تلاوة',
    icon: 'recitation',
    description: 'Perfect your Quran reading',
    teacherCount: 156,
    color: '#1E4620',
  },
  {
    id: '5',
    title: 'Arabic',
    titleAr: 'عربية',
    icon: 'arabic',
    description: 'Learn Quranic Arabic language',
    teacherCount: 84,
    color: '#5B9A5F',
  },
  {
    id: '6',
    title: 'Kids',
    titleAr: 'أطفال',
    icon: 'kids',
    description: 'Specialized programs for children',
    teacherCount: 112,
    color: '#D4AF37',
  },
];

// randomuser.me portraits — mature, distinguished, professional scholars
export const featuredTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Sheikh Ahmad Al-Hasan',
    nameAr: 'الشيخ أحمد الحسن',
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    rating: 4.9,
    reviewCount: 234,
    specializations: ['Tajweed', 'Hifz', 'Recitation'],
    languages: ['Arabic', 'English'],
    experience: '15 years',
    bio: 'Graduated from Al-Azhar University with ijazah in the ten Qira\'at. Dedicated to teaching the Quran with proper tajweed and a strong foundation in classical Arabic sciences.',
    pricePerSession: '$25',
    isVerified: true,
    isOnline: true,
    totalStudents: 450,
    sessionsCompleted: 3200,
    nextAvailable: 'Today',
    country: 'Egypt',
  },
  {
    id: '2',
    name: 'Ustadha Maryam Khan',
    nameAr: 'الأستاذة مريم خان',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.8,
    reviewCount: 189,
    specializations: ['Tajweed', 'Kids', 'Arabic'],
    languages: ['Arabic', 'English', 'Urdu'],
    experience: '10 years',
    bio: 'Certified Quran teacher specializing in children\'s education with ijazah in Hafs. Creates a nurturing, engaging environment where young students thrive.',
    pricePerSession: '$20',
    isVerified: true,
    isOnline: false,
    totalStudents: 320,
    sessionsCompleted: 2100,
    nextAvailable: 'Tomorrow',
    country: 'Pakistan',
  },
  {
    id: '3',
    name: 'Sheikh Omar Farooq',
    nameAr: 'الشيخ عمر فاروق',
    avatar: 'https://randomuser.me/api/portraits/men/80.jpg',
    rating: 5.0,
    reviewCount: 312,
    specializations: ['Tafseer', 'Hifz', 'Arabic'],
    languages: ['Arabic', 'English', 'French'],
    experience: '20 years',
    bio: 'Senior scholar of Tafseer trained in the tradition of classical ulema. His teaching methodology weaves together linguistic depth and spiritual insight.',
    pricePerSession: '$30',
    isVerified: true,
    isOnline: true,
    totalStudents: 580,
    sessionsCompleted: 4500,
    nextAvailable: 'Today',
    country: 'Morocco',
  },
  {
    id: '4',
    name: 'Ustadh Ibrahim Yusuf',
    nameAr: 'الأستاذ إبراهيم يوسف',
    avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
    rating: 4.7,
    reviewCount: 156,
    specializations: ['Recitation', 'Tajweed'],
    languages: ['Arabic', 'English', 'Turkish'],
    experience: '8 years',
    bio: 'Award-winning Quran reciter trained under masters of maqamat. Focuses on helping students develop a melodious, spiritually moving recitation.',
    pricePerSession: '$22',
    isVerified: true,
    isOnline: true,
    totalStudents: 210,
    sessionsCompleted: 1400,
    nextAvailable: 'Today',
    country: 'Turkey',
  },
  {
    id: '5',
    name: 'Ustadha Fatima Al-Rashid',
    nameAr: 'الأستاذة فاطمة الراشد',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4.9,
    reviewCount: 278,
    specializations: ['Hifz', 'Tajweed', 'Kids'],
    languages: ['Arabic', 'English'],
    experience: '12 years',
    bio: 'Hafidha with ijazah in Hafs an Asim. Passionate about guiding women and children through the transformative journey of Quran memorization.',
    pricePerSession: '$18',
    isVerified: true,
    isOnline: false,
    totalStudents: 390,
    sessionsCompleted: 2800,
    nextAvailable: 'In 2 days',
    country: 'Saudi Arabia',
  },
];

export const upcomingSessions: Session[] = [
  {
    id: '1',
    teacherName: 'Sheikh Ahmad Al-Hasan',
    teacherAvatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    subject: 'Surah Al-Mulk — Tajweed Review',
    date: 'Today',
    time: '4:00 PM',
    duration: '45 min',
    status: 'upcoming',
    type: 'tajweed',
  },
  {
    id: '2',
    teacherName: 'Ustadha Maryam Khan',
    teacherAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    subject: 'Juz 28 — Hifz Session',
    date: 'Tomorrow',
    time: '10:00 AM',
    duration: '60 min',
    status: 'upcoming',
    type: 'hifz',
  },
  {
    id: '3',
    teacherName: 'Sheikh Omar Farooq',
    teacherAvatar: 'https://randomuser.me/api/portraits/men/80.jpg',
    subject: 'Tafseer of Surah Yusuf',
    date: 'May 12',
    time: '6:00 PM',
    duration: '50 min',
    status: 'upcoming',
    type: 'tafseer',
  },
];

export const completedSessions: Session[] = [
  {
    id: '4',
    teacherName: 'Sheikh Ahmad Al-Hasan',
    teacherAvatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    subject: 'Surah Al-Baqarah — Tajweed',
    date: 'May 8',
    time: '4:00 PM',
    duration: '45 min',
    status: 'completed',
    type: 'tajweed',
  },
  {
    id: '5',
    teacherName: 'Ustadha Fatima Al-Rashid',
    teacherAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    subject: 'Juz 27 — Hifz Review',
    date: 'May 7',
    time: '2:00 PM',
    duration: '60 min',
    status: 'completed',
    type: 'hifz',
  },
];

export const userStats = {
  sessionsCompleted: 47,
  hoursLearned: 35,
  currentStreak: 12,
  surahsMemorized: 8,
  juzCompleted: 3,
  tajweedScore: 85,
};
