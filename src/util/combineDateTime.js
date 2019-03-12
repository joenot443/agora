import moment from 'moment';

export default (dateMoment, timeMoment) =>
  moment(`${dateMoment} ${timeMoment}`, 'DD/MM/YYYY HH:mm');
