/**
 * Mock data for Certificate feature.
 * Used as fallback when the backend API is not yet available.
 * Replace with real API calls in certificateService.js when ready.
 */

export const mockCertificates = [
  {
    id: 'cert-001',
    userId: 'user-001',
    learningPathId: 'lp-001',
    learningPathTitle: 'Frontend Developer Roadmap',
    mentorName: 'Sarah Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    certificateUrl: null,
    issuedAt: '2026-07-20T00:00:00.000Z',
    verificationId: 'CERT-2026-000123',
    verified: true,
  },
  {
    id: 'cert-002',
    userId: 'user-001',
    learningPathId: 'lp-002',
    learningPathTitle: 'Backend Developer Roadmap',
    mentorName: 'David Smith',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    certificateUrl: null,
    issuedAt: '2026-05-10T00:00:00.000Z',
    verificationId: 'CERT-2026-000456',
    verified: true,
  },
  {
    id: 'cert-003',
    userId: 'user-001',
    learningPathId: 'lp-003',
    learningPathTitle: 'Database Fundamentals Roadmap',
    mentorName: 'Michael Brown',
    thumbnail: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&q=80&w=800',
    certificateUrl: null,
    issuedAt: '2026-03-15T00:00:00.000Z',
    verificationId: 'CERT-2026-000789',
    verified: true,
  },
];
