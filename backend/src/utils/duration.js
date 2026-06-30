const normalizeDurationParts = (value) => {
  if (!value) {
    return { months: 0, weeks: 0, days: 0 };
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return {
      months: Number(value.months) || 0,
      weeks: Number(value.weeks) || 0,
      days: Number(value.days) || 0,
    };
  }

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (!normalized) {
      return { months: 0, weeks: 0, days: 0 };
    }

    const monthsMatch = normalized.match(/(\d+)\s*(tháng|month|months|m)/i);
    const weeksMatch = normalized.match(/(\d+)\s*(tuần|week|weeks|w)/i);
    const daysMatch = normalized.match(/(\d+)\s*(ngày|day|days|d)/i);

    return {
      months: monthsMatch ? Number(monthsMatch[1]) : 0,
      weeks: weeksMatch ? Number(weeksMatch[1]) : 0,
      days: daysMatch ? Number(daysMatch[1]) : 0,
    };
  }

  return { months: 0, weeks: 0, days: 0 };
};

const serializeDuration = (value) => {
  const { months, weeks, days } = normalizeDurationParts(value);
  const parts = [];

  if (months) parts.push(`${months} tháng`);
  if (weeks) parts.push(`${weeks} tuần`);
  if (days) parts.push(`${days} ngày`);

  return parts.join(' • ');
};

const sumDurationParts = (items = []) => {
  return items.reduce(
    (acc, item) => {
      const parts = normalizeDurationParts(item);
      acc.months += parts.months;
      acc.weeks += parts.weeks;
      acc.days += parts.days;
      return acc;
    },
    { months: 0, weeks: 0, days: 0 }
  );
};

const summarizeDuration = (items = []) => {
  const total = sumDurationParts(items);
  return serializeDuration(total);
};

module.exports = {
  normalizeDurationParts,
  serializeDuration,
  summarizeDuration,
};
