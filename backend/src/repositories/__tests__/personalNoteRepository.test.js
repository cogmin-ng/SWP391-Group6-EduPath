jest.mock('../../lib/prisma', () => ({
  personalLearningNote: {
    upsert: jest.fn(),
  },
}));

const prisma = require('../../lib/prisma');
const personalNoteRepository = require('../personalNoteRepository');

describe('personalNoteRepository.upsert', () => {
  it('uses the user-node unique key and reactivates a soft-deleted note', async () => {
    prisma.personalLearningNote.upsert.mockResolvedValue({ id: 'note-1' });

    await personalNoteRepository.upsert({
      nodeId: 'node-1',
      userId: 'user-1',
      content: 'Nội dung mới',
    });

    expect(prisma.personalLearningNote.upsert).toHaveBeenCalledWith({
      where: {
        userId_nodeId: { userId: 'user-1', nodeId: 'node-1' },
      },
      create: {
        nodeId: 'node-1',
        userId: 'user-1',
        content: 'Nội dung mới',
      },
      update: {
        content: 'Nội dung mới',
        isDeleted: false,
      },
    });
  });
});
