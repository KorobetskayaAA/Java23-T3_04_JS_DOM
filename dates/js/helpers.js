function toISODate(datetime) {
  return datetime.toISOString().substring(0, 10);
}

function getRusEnding(value, wordSingle, wordFew, wordMany) {
  value = +value;
  if (isNaN(value)) return wordMany;
  const lastDigit = value % 10;
  const lastTwoDigits = value % 100;
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return wordSingle;
  }
  if (between(lastDigit, 2, 4) && !between(lastTwoDigits, 12, 14)) {
    return wordFew;
  }
  return wordMany;
}

function getRusDays(value) {
  return getRusEnding(value, "день", "дня", "дней");
}

function getRusWeeks(value) {
  return getRusEnding(value, "неделя", "недели", "недель");
}

function getRusMonths(value) {
  return getRusEnding(value, "месяц", "месяца", "месяцев");
}

function getRusYears(value) {
  return getRusEnding(value, "год", "года", "лет");
}

function getRusWeekDay(date) {
  return new Date(date).toLocaleString("ru-RU", { weekday: "long" });
}

function getPeriodsBetweenDates(startDate, endDate, includeEndDate) {
  if (!(startDate instanceof Date)) {
    startDate = new Date(startDate);
  }
  if (!(endDate instanceof Date)) {
    endDate = new Date(endDate);
  }
  if (!endDate || !startDate) {
    console.error(
      "getPeriodsBetweenDates: Входные данные не сводятся к датам."
    );
    return;
  }
  startDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  endDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate() + !!includeEndDate
  );

  const fullDays = getFullDaysBetween(endDate, startDate);
  const fullMonths = getFullMonthsBetween(endDate, startDate);
  const monthDays = getFullDaysBetween(
    endDate,
    startDate.setMonth(startDate.getMonth() + fullMonths)
  );

  return {
    days: fullDays,
    weeks: { weeks: Math.trunc(fullDays / 7), days: fullDays % 7 },
    months: { months: fullMonths, days: monthDays },
    years: {
      years: Math.trunc(fullMonths / 12),
      months: fullMonths % 12,
      days: monthDays,
    },
  };
}

function getFullDaysBetween(endDate, startDate) {
  const ms = endDate - startDate;
  return Math.trunc(ms / (24 * 60 * 60 * 1000));
}

function getFullMonthsBetween(endDate, startDate) {
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  return yearsDiff * 12 + monthDiff;
}

function between(value, min, max) {
  return min <= value && max >= value;
}
