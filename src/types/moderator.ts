import { Pagination } from './api';

export interface ModeratorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  password?: string;
  code_country?: string;
  roleId?: string;
}

export interface ModeratorStudent {
  id: string;
  user_id: string;
  birth_date: string;
  gender: 'male' | 'female' | string;
  active: boolean;
  planId: string | null;
  country: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  sessions: number;
  sessions_attended: number;
  sessions_remaining: number;
  points: number;
  avgRating: number;
  totalReviews: number;
  paid: string;
  rankId: string | null;
  user?: ModeratorUser;
}

export interface StudentModerator {
  id: string;
  studentId: string;
  moderatorId: string;
  createdAt: string;
  updatedAt: string;
  student: ModeratorStudent;
}

export interface Moderator {
  id: string;
  userId: string;
  gender: 'male' | 'female' | string;
  status: 'active' | 'inactive' | string;
  createdAt: string;
  updatedAt: string;
  user: ModeratorUser;
  salary:number;
  studentModerators: StudentModerator[];
}

export type ModeratorOrderBy = 'createdAt' | 'active';
export type SortOrder = 'asc' | 'desc';

export interface GetModeratorsParams {
  page?: number;
  limit?: number;
  search?: string;
  order?: SortOrder;
  orderBy?: ModeratorOrderBy;
}

export interface ModeratorsResponse {
  message: string;
  status: number;
  lang?: string;
  data: {
    items: Moderator[];
    pagination: Pagination;
  };
}

export interface CreateModeratorInput {
  name: string;
  email: string;
  codeCountry: string;
  password?: string;
  phone: string;
  age?: number | string;
  gender: 'male' | 'female' | string;
  salary:number;
  studentIds?: string[];
}

export interface UpdateModeratorInput {
  name?: string;
  email?: string;
  codeCountry?: string;
  password?: string;
  phone?: string;
  age?: number | string;
  gender?: 'male' | 'female' | string;
  studentIds?: string[];
  salary:number;
  status?: 'active' | 'inactive' | string;
}

export interface ChangeModeratorStatusInput {
  id: string;
  status: 'active' | 'inactive' | string;
}


export interface redisData{
  user_id:string;
  gender:string;
  expectedSalary:number;
}
export interface SingleModeratorResponse {
  message: string;
  status: number;
  data: Moderator;
}

export type ModeratorsFetchResponse = ModeratorsResponse;
export type ModeratorsData = ModeratorsResponse['data'];

export interface ModeratorRequestAdditionalData {
  notes?: string;
  birthDate: string;
  governorate: string;
  hasCurrentJob: boolean;
  maritalStatus: string;
  qualification: string;
  whatsappNumber: string;
  hasPersonalLaptop: boolean;
  dailyFreeTimeHours: string;
  hasFreeTimeFrom3To8: boolean;
  agreedToWorkConditions: boolean;
}

export interface ModeratorRequestModerator {
  id: string;
  userId: string;
  gender: 'male' | 'female' | string;
  salary?: number;
  status: 'pending' | 'active' | 'inactive' | string;
  createdAt: string;
  updatedAt: string;
  studentModerators: StudentModerator[];
}

export interface ModeratorRequest {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  confirmAt: string | null;
  roleId: string | null;
  code_country: string;
  status: 'pending' | 'active' | 'inactive' | string;
  googleId: string | null;
  provider: 'local' | 'google' | string;
  timezone: string;
  country: string;
  nationality: string;
  fcmToken: string;
  age: number;
  city: string;
  additionalData: ModeratorRequestAdditionalData;
  moderator: ModeratorRequestModerator;
  redisData: redisData | null;
}

export interface ModeratorRequestsResponse {
  message: string;
  status: number;
  lang?: string;
  data: {
    allRedisData?: ModeratorRequest[];
    requests?: ModeratorRequest[];
    pagination: Pagination;
  };
}



