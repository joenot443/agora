import moment from 'moment';

export default (dateMoment, timeMoment) => {
  const date = dateMoment.format('DD/MM/YYYY')
  const time = timeMoment.format('HH:mm')

  return moment(`${date} ${time}`, 'DD/MM/YYYY HH:mm').toDate()
}
