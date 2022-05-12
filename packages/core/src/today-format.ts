import date from 'date-and-time';

export const todayFormat = () => date.format(new Date(), 'YYYY-MM-DD-HH_mm_ss');
