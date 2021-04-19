export class Time {
  public hour: number;
  public minute: number;
  public second: number;

  constructor(hour?: number, minute?: number, second?: number) {
    this.hour = +(hour || 0);
    this.minute = +(minute || 0);
    this.second = +(second || 0);
  }

  public changeHour(step = 1) {
    this.updateHour(this.hour + step);
  }

  public updateHour(hour: number) {
    this.hour = (hour < 0 ? 24 + hour : hour) % 24;
  }

  public changeMinute(step = 1) {
    this.updateMinute(this.minute + step);
  }

  public updateMinute(minute: number) {
    this.minute = minute % 60 < 0 ? 60 + (minute % 60) : minute % 60;
    this.changeHour(Math.floor(minute / 60));
  }

  public changeSecond(step = 1) {
    this.updateSecond(this.second + step);
  }

  public updateSecond(second: number) {
    this.second = second < 0 ? 60 + (second % 60) : second % 60;
    this.changeMinute(Math.floor(second / 60));
  }

  public toString() {
    return `${this.getNumString(this.minute)}:${this.getNumString(this.second)}`;
  }

  private getNumString(num: number) {
    if (!num) {
      return '00';
    }
    return num > 9 ? num.toString() : `0${num}`;
  }
}
