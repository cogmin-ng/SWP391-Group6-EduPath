const prisma = require('../lib/prisma');

const XP_EVENT_TYPES = Object.freeze({
  NODE_COMPLETED: 'NODE_COMPLETED',
  ROADMAP_COMPLETED: 'ROADMAP_COMPLETED',
  TIP_APPROVED: 'TIP_APPROVED',
  BADGE_UNLOCKED: 'BADGE_UNLOCKED',
});

const XP_REWARDS = Object.freeze({
  NODE_COMPLETED: 20,
  ROADMAP_COMPLETED: 100,
  TIP_APPROVED: 30,
});

async function runAwardTransaction(db, payload) {
  const existing = await db.userXpEvent.findUnique({
    where: { eventKey: payload.eventKey },
  });

  if (existing) {
    return {
      awarded: false,
      event: existing,
      user: null,
    };
  }

  const event = await db.userXpEvent.create({
    data: {
      userId: payload.userId,
      type: payload.type,
      sourceType: payload.sourceType || null,
      sourceId: payload.sourceId || null,
      eventKey: payload.eventKey,
      xpAmount: payload.xpAmount,
    },
  });

  const user = await db.user.update({
    where: { id: payload.userId },
    data: {
      xp: {
        increment: payload.xpAmount,
      },
    },
    select: {
      id: true,
      xp: true,
    },
  });

  return {
    awarded: true,
    event,
    user,
  };
}

exports.XP_EVENT_TYPES = XP_EVENT_TYPES;
exports.XP_REWARDS = XP_REWARDS;

exports.awardXp = async (payload, tx = null) => {
  if (!payload?.userId) {
    throw new Error('userId is required to award XP');
  }

  if (!payload?.type) {
    throw new Error('type is required to award XP');
  }

  if (!payload?.eventKey) {
    throw new Error('eventKey is required to award XP');
  }

  if (!Number.isInteger(payload.xpAmount) || payload.xpAmount <= 0) {
    throw new Error('xpAmount must be a positive integer');
  }

  try {
    if (tx) {
      return await runAwardTransaction(tx, payload);
    }

    return await prisma.$transaction((db) => runAwardTransaction(db, payload));
  } catch (error) {
    if (error?.code === 'P2002') {
      const existing = await prisma.userXpEvent.findUnique({
        where: { eventKey: payload.eventKey },
      });

      return {
        awarded: false,
        event: existing,
        user: null,
      };
    }

    throw error;
  }
};

exports.buildEventKey = ({ type, userId, sourceId }) => {
  if (!type || !userId || !sourceId) {
    throw new Error('type, userId, and sourceId are required to build eventKey');
  }

  return `${type}:${userId}:${sourceId}`;
};
