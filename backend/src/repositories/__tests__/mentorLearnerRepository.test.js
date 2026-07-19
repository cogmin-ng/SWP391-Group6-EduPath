jest.mock('../../lib/prisma', () => ({
  enrollment: {
    findMany: jest.fn(),
    count: jest.fn(),
    findFirst: jest.fn(),
  },
  learningPath: { findMany: jest.fn() },
}));

const prisma = require('../../lib/prisma');
const mentorLearnerRepository = require('../mentorLearnerRepository');

describe('mentorLearnerRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  it('scopes search, status and pagination to the current mentor', async () => {
    prisma.enrollment.findMany.mockResolvedValue([]);
    prisma.enrollment.count.mockResolvedValue(0);

    await mentorLearnerRepository.findPage('mentor-1', {
      skip: 10,
      take: 10,
      search: 'lan',
      status: 'ACTIVE',
    });

    expect(prisma.enrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isDeleted: false,
          status: 'ACTIVE',
          learningPath: { mentorId: 'mentor-1', isDeleted: false },
          user: {
            isDeleted: false,
            OR: [
              { name: { contains: 'lan', mode: 'insensitive' } },
              { email: { contains: 'lan', mode: 'insensitive' } },
            ],
          },
        }),
        skip: 10,
        take: 10,
      })
    );
  });

  it('does not resolve a dropped, deleted or foreign enrollment for reminders', async () => {
    prisma.enrollment.findFirst.mockResolvedValue(null);

    await mentorLearnerRepository.findOwnedEnrollment(
      'enrollment-1',
      'mentor-1'
    );

    expect(prisma.enrollment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'enrollment-1',
          isDeleted: false,
          status: { not: 'DROPPED' },
          learningPath: { mentorId: 'mentor-1', isDeleted: false },
          user: { isDeleted: false },
        },
      })
    );
  });
});
