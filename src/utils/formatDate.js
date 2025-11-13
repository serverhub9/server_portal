import moment from 'moment';
import 'moment/locale/en-gb';

export function formatDate(inputDate) {
    return moment(inputDate).format('DD MMM YYYY');
  }
  export const calculateSubscriptionEndDate = (startDate, packageType) => {
    const duration = packageType === 'month' ? 30 : 12 * 30; // duration in days
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    return formatDate(endDate);
  };