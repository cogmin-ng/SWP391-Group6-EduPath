export const parseDurationValue = (value) => {
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

export const formatDurationLabel = (value) => {
  const { months, weeks, days } = parseDurationValue(value);
  const parts = [];

  if (months) parts.push(`${months} tháng`);
  if (weeks) parts.push(`${weeks} tuần`);
  if (days) parts.push(`${days} ngày`);

  return parts.join(' • ') || 'Không có';
};

export const serializeDurationValue = (value) => {
  const { months, weeks, days } = parseDurationValue(value);
  const parts = [];

  if (months) parts.push(`${months} tháng`);
  if (weeks) parts.push(`${weeks} tuần`);
  if (days) parts.push(`${days} ngày`);

  return parts.join(' • ');
};
