function addTimes(times = []) {
    const z = n => (n < 10 ? '0' : '') + n;
    let hour = 0;
    let minute = 0;
    let second = 0;
    for (const time of times) {
      const splited = time.split(':');
      hour += parseInt(splited[0]);
      minute += parseInt(splited[1]);
      second += parseInt(splited[2]);
    }
    const minutes = parseInt(minute % 60) + parseInt(second / 60);
    const hours = hour + parseInt(minute / 60);
    let r_hr = hours > 23 ? hours - 24 : hours;
    let d_n = r_hr > 12 ? 'PM' : 'AM';
    r_hr = r_hr > 12 ? r_hr - 12 : r_hr;
    return z(r_hr) + ':' + z(minutes) + ' ' + d_n;
  }
  
  export default addTimes;