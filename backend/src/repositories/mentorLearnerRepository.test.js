jest.mock('../lib/prisma', () => ({
  enrollment: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
}));

const prisma = require('../lib/prisma');
const mentorLearnerRepository = require('./mentorLearnerRepository');

describe('mentorLearnerRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.enrollment.findMany.mockResolvedValue([]);
    prisma.enrollment.count.mockResolvedValue(0);
  });

  it('only returns users who still have the MENTEE role', async () => {
    await mentorLearnerRepository.findPage('mentor-1', {
      skip: 0,
      take: 10,
    });

    expect(prisma.enrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          user: {
            isDeleted: false,
            role: { name: 'MENTEE' },
          },
        }),
      })
    );
  });

  it('keeps the MENTEE-role filter when searching learners', async () => {
    await mentorLearnerRepository.findPage('mentor-1', {
      skip: 0,
      take: 10,
      search: 'An',
    });

    expect(prisma.enrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          user: expect.objectContaining({
            role: { name: 'MENTEE' },
          }),
        }),
      })
    );
  });
});
