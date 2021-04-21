import { Component, ElementRef, ViewChild, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface FileUploaderValue {
  file?: File;
  path?: string;
}

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true,
    },
  ],
})
export class FileUploaderComponent implements ControlValueAccessor {
  @ViewChild('inputFileContainer') private inputFileContainer: ElementRef<HTMLDivElement>;
  @Input() public imgClass: string;

  public value: FileUploaderValue | null | undefined;

  public disabled: boolean;

  private onChange: (value?: any) => {};
  private onTouched: () => {};

  /*
    Value Accessor
  */
  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public writeValue(out: FileUploaderValue | null | undefined) {
    this.value = out;
  }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public updateValue(value: FileUploaderValue | null | undefined) {
    this.value = value;
    if (this.onChange) {
      this.onChange(value);
    }

    if (this.onTouched) {
      this.onTouched();
    }
  }

  public onRemoveFileClick(event: MouseEvent): void {
    event.preventDefault();
    this.updateValue(null);
  }

  public onUploadFileClick(event: MouseEvent): void {
    event.preventDefault();
    const fileInput = this.createUploadFileInput();
    this.inputFileContainer.nativeElement.append(fileInput);

    fileInput.addEventListener('change', () => {
      if (!fileInput.files) {
        return;
      }
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = ({ target }) => {
        const path = target?.result?.toString();
        this.updateValue({ file, path });
      };

      reader.readAsDataURL(file);

      fileInput.remove();
    });

    fileInput.click();
  }

  private createUploadFileInput(): HTMLInputElement {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <input hidden name="images" type="file" accept="image/*">
    `;

    return wrapper.firstElementChild as HTMLInputElement;
  }
}
