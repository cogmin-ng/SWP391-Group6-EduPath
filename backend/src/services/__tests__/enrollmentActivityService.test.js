jest.mock('../../lib/prisma', () => ({
  enrollment: { updateMany: jest.fn() },
}));

const prisma = require('../../lib/prisma');
const enrollmentActivityService = require('../enrollmentActivityService');

describe('enrollmentActivityService.touch', () => {
  it('updates only an active, non-deleted enrollment', async () => {
    const occurredAt = new Date('2026-07-19T05:00:00Z');
    prisma.enrollment.updateMany.mockResolvedValue({ count: 1 });

    await enrollmentActivityService.touch(
      'learner-1',
      'path-1',
      prisma,
      occurredAt
    );

    expect(prisma.enrollment.updateMany).toHaveBeenCalledWith({
      where: {
        userId: 'learner-1',
        learningPathId: 'path-1',
        isDeleted: false,
        status: { not: 'DROPPED' },
      },
      data: { lastActivityAt: occurredAt },
    });
  });
});
