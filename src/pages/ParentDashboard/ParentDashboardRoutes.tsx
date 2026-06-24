import { lazy, ReactNode } from 'react';
import {
  Play,
  FileText,
  ClipboardList,
  Users,
  AlertCircle
} from 'lucide-react';

export interface ParentRouteConfig {
  id: string;
  label: string;
  icon?: any;
  path: string;
  fullPath?: string;
  element?: ReactNode;
  subItems?: ParentRouteConfig[];
}

// --- Lazy Loading Page Components for Student from Features ---
const SessionsPage = lazy(() => import('../../features/parent/pages/Sessions'));
const ExamsPage = lazy(() => import('../../features/parent/pages/Exams'));
const AssignmentsPage = lazy(() => import('../../features/parent/pages/Assignments'));
const ChildrenPage = lazy(() => import('../../features/parent/pages/Children'));
const ChildDashboard = lazy(() => import('../../features/parent/pages/ChildDashboard'));
const NotificationsPage = lazy(() => import('../../features/admin/pages/Notifications'));

export const parentDashboardRoutes: ParentRouteConfig[] = [
      {
        id: 'parent-children',
        label: 'أبنائي',
        icon: Users,
        path: 'children',
        element: <ChildrenPage />,
      },
      {
        id: 'child-dashboard',
        label: 'لوحة الطالب',
        path: 'children/:studentId/:tab',
        element: <ChildDashboard />,
      },
      {
        id: 'student-sessions',
        label: 'sidebar_sessions',
        icon: Play,
        path: 'sessions',
        element: <SessionsPage />,
      },
      {
        id: 'student-exams',
        label: 'sidebar_exams',
        icon: FileText,
        path: 'exams',
        element: <ExamsPage />,
      },
      {
        id: 'student-assignments',
        label: 'sidebar_assignments',
        icon: ClipboardList,
        path: 'assignments',
        element: <AssignmentsPage />,
      },
      {
        id: 'notifications',
        label: 'الإشعارات',
        icon: AlertCircle,
        path: 'notifications',
        element: <NotificationsPage />,
      },
    ]
