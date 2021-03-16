/* eslint-disable no-param-reassign */
/* eslint-disable complexity */
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tags-input',
  templateUrl: './tags-input.component.html',
  styleUrls: ['./tags-input.component.less'],
})
export class TagsInputComponent {
  public tags: Tag[] = [];
  public disabled = false;
  @Input() public items: Tag[] = [];
  @Output() public search: EventEmitter<string> = new EventEmitter();

  constructor(public cdRef: ChangeDetectorRef) {}

  public setCursor(span: HTMLSpanElement, dropdown: NgbDropdown) {
    span.focus();
    dropdown.open();
  }

  public onKeyPress(value: string) {
    this.search.emit(value);
  }

  public addTag(item: any, input: HTMLSpanElement) {
    input.innerHTML = '';
    this.tags.push(item);
    this.updateValue(this.tags);
    input.click();
  }

  public remove(index: number) {
    this.tags.splice(index, 1);
  }

  /**
   * Value accessor
   */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (_value: any) => {};
  private onTouched = () => {};

  /*
    Value Accessor
  */
  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public writeValue(out: Tag[]) {
    this.tags = out || [];
  }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public updateValue(value: Tag[]) {
    this.tags = value;
    this.onChange(value);
    this.onTouched();
  }
}

export interface Tag {
  key: string;
  [value: string]: any;
}
