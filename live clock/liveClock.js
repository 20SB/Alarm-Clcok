setInterval(() => {
  d = new Date(); //object of date()
  hr = d.getHours();
  min = d.getMinutes();
  sec = d.getSeconds();
  hr_rotation = 30 * hr + min / 2; //converting current time
  min_rotation = 6 * min;
  sec_rotation = 6 * sec;

  clk_hour.style.transform = `rotate(${hr_rotation}deg)`;
  clk_minute.style.transform = `rotate(${min_rotation}deg)`;
  clk_second.style.transform = `rotate(${sec_rotation}deg)`;
}, 1000);
