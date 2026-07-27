export const normalizeDurationParts = ({ months = 0, weeks = 0, days = 0 } = {}) => {
  let totalDays = Math.max(0, Number(days) || 0);
  let totalWeeks = Math.max(0, Number(weeks) || 0);
  let totalMonths = Math.max(0, Number(months) || 0);

  // Convert days >= 7 to weeks
  if (totalDays >= 7) {
    totalWeeks += Math.floor(totalDays / 7);
    totalDays = totalDays % 7;
  }

  // Convert weeks >= 4 to months
  if (totalWeeks >= 4) {
    totalMonths += Math.floor(totalWeeks / 4);
    totalWeeks = totalWeeks % 4;
  }

  return {
    months: totalMonths,
    weeks: totalWeeks,
    days: totalDays,
  };
};

export const parseDurationValue = (value) => {
  if (!value) {
    return { months: 0, weeks: 0, days: 0 };
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return normalizeDurationParts({
      months: Number(value.months) || 0,
      weeks: Number(value.weeks) || 0,
      days: Number(value.days) || 0,
    });
  }

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (!normalized) {
      return { months: 0, weeks: 0, days: 0 };
    }

    const monthsMatch = normalized.match(/(\d+)\s*(tháng|month|months|m)/i);
    const weeksMatch = normalized.match(/(\d+)\s*(tuần|week|weeks|w)/i);
    const daysMatch = normalized.match(/(\d+)\s*(ngày|day|days|d)/i);

    return normalizeDurationParts({
      months: monthsMatch ? Number(monthsMatch[1]) : 0,
      weeks: weeksMatch ? Number(weeksMatch[1]) : 0,
      days: daysMatch ? Number(daysMatch[1]) : 0,
    });
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
