const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const config = require('./config');
require('dotenv').config({ path: '../.env' });

const prisma = new PrismaClient();

async function main() {
  const roadmapId = 'cmqxy271c0001bjp5djeac4o1';
  
  console.log('Fetching roadmap and mentor from database...');
  const roadmap = await prisma.learningPath.findFirst({
    where: { id: roadmapId, isDeleted: false },
    include: {
      mentor: {
        include: {
          role: true
        }
      },
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

  console.log('Generating JWT token for mentor:', roadmap.mentor.email);
  const roles = roadmap.mentor.role ? [roadmap.mentor.role.name] : ['MENTOR'];
  const token = jwt.sign(
    { sub: roadmap.mentor.id, email: roadmap.mentor.email, roles },
    config.jwt.accessSecret,
    { expiresIn: '15m' }
  );

  const headers = { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Construct payload exactly matching the frontend 
  const payload = {
    title: roadmap.title,
    description: 'Mô tả chi tiết lộ trình học tập...', // Added description
    studyTips: roadmap.studyTips || '',
    subjectId: roadmap.subjectId,
    thumbnail: roadmap.thumbnail,
    status: 'DRAFT',
    nodes: (roadmap.nodes || []).map((n, i) => ({
      id: typeof n.id === 'string' && n.id.length > 20 ? n.id : undefined,
      title: n.title,
      description: n.description,
      duration: n.duration || '',
      studyTips: n.studyTips || '',
      orderIndex: i,
      checklists: n.checklists || [],
      materials: n.materials || [],
      quizzes: n.quizzes || []
    }))
  };

  console.log('Sending PUT request...');
  const putRes = await fetch(`http://localhost:4000/api/roadmaps/${roadmapId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload)
  });

  const putData = await putRes.json();
  if (putRes.status === 200) {
    console.log('PUT Succeeded!', putData);
  } else {
    console.error('PUT Failed with status:', putRes.status);
    console.error('Error body:', JSON.stringify(putData, null, 2));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
