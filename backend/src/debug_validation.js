const Joi = require('joi');
const { updateRoadmapSchema } = require('./validators/roadmap.validator');
require('dotenv').config({ path: '../.env' });
const prisma = require('./lib/prisma');

async function main() {
  const roadmapId = 'cmqxy271c0001bjp5djeac4o1';
  
  const roadmap = await prisma.learningPath.findFirst({
    where: { id: roadmapId, isDeleted: false },
    include: {
      subject: true,
      nodes: {
        where: { isDeleted: false },
        orderBy: { orderIndex: 'asc' },
        include: {
          checklists: { where: { isDeleted: false } },
          materials: { where: { isDeleted: false } },
          quizzes: {
            where: { isDeleted: false },
            include: {
              questions: {
                where: { isDeleted: false },
                include: {
                  options: { where: { isDeleted: false } }
                }
              }
            }
          },
          tips: {
            where: { isDeleted: false, contributorId: null }
          }
        }
      }
    }
  });

  if (!roadmap) {
    console.error('Roadmap not found in database!');
    return;
  }

  console.log('Roadmap retrieved successfully.');

  // Construct the payload matching the frontend's buildPayload()
  const payload = {
    title: roadmap.title,
    description: "Mô tả chi tiết lộ trình học tập...", // They edited description
    studyTips: roadmap.studyTips,
    subjectId: roadmap.subjectId,
    thumbnail: roadmap.thumbnail,
    status: 'DRAFT',
    nodes: roadmap.nodes.map((n, i) => ({
      id: typeof n.id === 'string' && n.id.length > 20 ? n.id : undefined,
      title: n.title,
      description: n.description,
      duration: '',
      studyTips: n.tips?.[0]?.content || '',
      orderIndex: i,
      checklists: n.checklists,
      materials: n.materials,
      quizzes: n.quizzes
    }))
  };

  console.log('Running Joi validation...');
  const { value, error } = updateRoadmapSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    console.error('Validation FAILED!');
    console.error(JSON.stringify(error.details, null, 2));
  } else {
    console.log('Validation SUCCEEDED!');
    console.log(value);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
