export interface DashboardResponse {
  message: string;
  status: number;
  lang: string;
  data: DashboardData;
}

export interface DashboardData {
  stats: Stats;
  sessionsPerDay: SessionPerDay[];
  upcomingSessions: UpcomingSession[];
  activityFeed: SubscriptionsToExpire[];
  activeUsers: ActiveUsers;
  subscriptionsStatus: subscriptionsStatus;  
}

export interface Stats {
  totalStudents: number;
  totalTeachers: number;
  pendingRequests: number;
  totalFeedbacks: number;
  todaySessions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalViolations: number;
  subscriptionRequests:number;
  completedSessions:number;
  transactionRequests:number;
}

export interface SessionPerDay {
  date: string;
  count: number;
}

export interface UpcomingSession {
  id: string;
  title: string;
  subject: string;
  time: string;
  teacher: string;
  student: string;
}

export interface SubscriptionsToExpire {
  id: string;
  type: string;
  title: string;
  time: string;
  user: string;
  avatar: string | null;
}

export interface ActiveUsers {
  students: number;
  instructors: number;
  admins:number;
  parents:number;
}

export interface subscriptionsStatus {
  active: number;
  expiringSoon: number;
  expired: number;
}

export interface ActivityLogUser {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  confirmAt: string;
  roleId: string;
  code_country: string;
  status: 'active' | 'inactive' | 'blocked';
  googleId: string | null;
  provider: 'local' | 'google';
  timezone: string;
}

export interface ActivityLogItem {
  id: string;
  userId: string;
  action: string;
  role: string;
  createdAt: string;
  user: ActivityLogUser;
}

export interface ActivityLogsResponse {
  message: string;
  status: number;
  lang: 'ltr' | 'rtl';
  data: ActivityLogItem[];
}