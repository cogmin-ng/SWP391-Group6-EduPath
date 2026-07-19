jest.mock('../../repositories/mentorLearnerRepository');
jest.mock('../notificationService');

const mentorLearnerRepository = require('../../repositories/mentorLearnerRepository');
const notificationService = require('../notificationService');
const mentorLearnerService = require('../mentorLearnerService');

describe('mentorLearnerService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps enrollment-specific progress and counts distinct passed quizzes', async () => {
    const enrollment = {
      id: 'enrollment-1',
      progressPercent: 50,
      status: 'ACTIVE',
      enrolledAt: new Date('2026-01-01T00:00:00Z'),
      lastActivityAt: new Date('2026-01-02T00:00:00Z'),
      user: {
        id: 'learner-1',
        name: 'Lan',
        email: 'lan@example.com',
        avatar: null,
      },
      learningPath: { id: 'path-1', title: 'SQL căn bản' },
    };
    mentorLearnerRepository.findPage.mockResolvedValue({
      enrollments: [enrollment],
      total: 1,
    });
    mentorLearnerRepository.findStatsRows.mockResolvedValue([
      { userId: 'learner-1', status: 'ACTIVE' },
      { userId: 'learner-1', status: 'COMPLETED' },
      { userId: 'learner-2', status: 'ACTIVE' },
    ]);
    mentorLearnerRepository.findLearningDetails.mockResolvedValue([
      {
        id: 'path-1',
        nodes: [
          {
            id: 'node-1',
            title: 'Node đã học',
            orderIndex: 1,
            nodeProgresses: [{ userId: 'learner-1', completed: true }],
            quizzes: [
              {
                id: 'quiz-1',
                attempts: [{ userId: 'learner-1' }, { userId: 'learner-1' }],
              },
            ],
          },
          {
            id: 'node-2',
            title: 'Node hiện tại',
            orderIndex: 2,
            nodeProgresses: [],
            quizzes: [{ id: 'quiz-2', attempts: [] }],
          },
        ],
        certificates: [
          {
            id: 'certificate-1',
            userId: 'learner-1',
            issuedAt: new Date('2026-01-03T00:00:00Z'),
          },
        ],
      },
    ]);

    const result = await mentorLearnerService.getLearners('mentor-1', {
      page: 1,
      limit: 10,
      search: '',
      status: undefined,
    });

    expect(result.learners[0]).toMatchObject({
      enrollmentId: 'enrollment-1',
      currentNode: { id: 'node-2', title: 'Node hiện tại' },
      quizzes: { completed: 1, total: 2 },
      certificate: { status: 'ISSUED', id: 'certificate-1' },
    });
    expect(result.stats).toEqual({
      totalLearners: 2,
      completedLearners: 1,
    });
    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
  });

  it('returns the last node when every node is completed', async () => {
    mentorLearnerRepository.findPage.mockResolvedValue({
      enrollments: [
        {
          id: 'enrollment-1',
          progressPercent: 100,
          status: 'COMPLETED',
          enrolledAt: new Date(),
          lastActivityAt: new Date(),
          user: { id: 'learner-1', name: 'Lan', email: 'lan@example.com' },
          learningPath: { id: 'path-1', title: 'SQL' },
        },
      ],
      total: 1,
    });
    mentorLearnerRepository.findStatsRows.mockResolvedValue([]);
    mentorLearnerRepository.findLearningDetails.mockResolvedValue([
      {
        id: 'path-1',
        nodes: [
          {
            id: 'node-1',
            title: 'Cuối',
            orderIndex: 1,
            nodeProgresses: [{ userId: 'learner-1', completed: true }],
            quizzes: [],
          },
        ],
        certificates: [],
      },
    ]);

    const result = await mentorLearnerService.getLearners('mentor-1', {
      page: 1,
      limit: 10,
      search: '',
    });

    expect(result.learners[0].currentNode.id).toBe('node-1');
    expect(result.learners[0].certificate.status).toBe('NOT_ISSUED');
  });

  it('creates a roadmap notification for the enrollment learner', async () => {
    mentorLearnerRepository.findOwnedEnrollment.mockResolvedValue({
      id: 'enrollment-1',
      userId: 'learner-1',
      user: { id: 'learner-1', name: 'Lan' },
      learningPath: { id: 'path-1', title: 'SQL' },
    });
    notificationService.createNotification.mockResolvedValue({
      id: 'notice-1',
    });

    await mentorLearnerService.sendReminder('mentor-1', 'enrollment-1', {
      title: 'Tiếp tục học',
      content: 'Bạn hãy hoàn thành node tiếp theo.',
    });

    expect(notificationService.createNotification).toHaveBeenCalledWith(
      'learner-1',
      {
        type: 'ROADMAP',
        title: 'Tiếp tục học',
        content: 'Bạn hãy hoàn thành node tiếp theo.',
      }
    );
  });

  it('hides an enrollment that is missing or belongs to another mentor', async () => {
    mentorLearnerRepository.findOwnedEnrollment.mockResolvedValue(null);

    await expect(
      mentorLearnerService.sendReminder('mentor-1', 'foreign-enrollment', {
        title: 'Nhắc học',
        content: 'Nội dung',
      })
    ).rejects.toMatchObject({ statusCode: 404 });
    expect(notificationService.createNotification).not.toHaveBeenCalled();
  });
});
