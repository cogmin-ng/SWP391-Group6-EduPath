const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const { updateRoadmapSchema } = require('d:/EduPath-SWP/SWP391-Group6-EduPath/backend/src/validators/roadmap.validator.js');
require('dotenv').config({ path: 'd:/EduPath-SWP/SWP391-Group6-EduPath/backend/.env' });

const prisma = new PrismaClient();

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
      id: n.id,
      title: n.title,
      description: n.description,
      duration: '', // or whatever duration
      studyTips: n.tips?.[0]?.content || '',
      orderIndex: i,
      checklists: n.checklists.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        orderIndex: c.orderIndex,
        xpReward: c.xpReward,
      })),
      materials: n.materials.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        url: m.url,
        type: m.type,
      })),
      quizzes: n.quizzes.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description || '',
        passingScore: q.passingScore,
        xpReward: q.xpReward,
        questions: q.questions.map(qu => ({
          id: qu.id,
          question: qu.question,
          explanation: qu.explanation || '',
          options: qu.options.map(o => ({
            id: o.id,
            content: o.content,
            isCorrect: o.isCorrect
          }))
        }))
      }))
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
