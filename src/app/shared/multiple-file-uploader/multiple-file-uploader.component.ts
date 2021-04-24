import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { extensions } from 'src/app/utils/constants';

@Component({
  selector: 'app-multiple-file-uploader',
  templateUrl: './multiple-file-uploader.component.html',
  styleUrls: ['./multiple-file-uploader.component.less'],
})
export class MultipleFileUploaderComponent {
  public files: UploadFile[] | null | undefined;
  @ViewChild('inputFileContainer') private inputFileContainer: ElementRef<HTMLDivElement>;
  @Output() public download: EventEmitter<any> = new EventEmitter();
  @Output() public remove: EventEmitter<UploadFile> = new EventEmitter();
  public disabled: boolean;

  private onChange: (value?: any) => {};
  private onTouched: () => {};

  // eslint-disable-next-line complexity
  public getFileIconClass(fileName: string) {
    const extension = this.getFileExtension(fileName);
    if (extensions.word.indexOf(extension) > -1) {
      return 'fas fa-file-word text-primary';
    }
    if (extensions.excel.indexOf(extension) > -1) {
      return 'fas fa-file-excel text-success';
    }
    if (extensions.pdf.indexOf(extension) > -1) {
      return 'fas fa-file-pdf text-danger';
    }
    if (extensions.audio.indexOf(extension) > -1) {
      return 'fas fa-file-audio text-info';
    }
    if (extensions.video.indexOf(extension) > -1) {
      return 'fas fa-file-video text-info';
    }
    if (extensions.archive.indexOf(extension) > -1) {
      return 'fas fa-file-archive text-secondary';
    }
    if (extensions.powerpoint.indexOf(extension) > -1) {
      return 'fas fa-file-powervoint text-warning';
    }
    return 'fas fa-file text-secondary';
  }

  public downloadFile(file) {
    this.download.emit(file);
  }

  public isImage(fileUrl: string): boolean {
    return !!fileUrl.match(/\.png|\.jpg|\.jpeg$/);
  }
  public removeFile(index) {
    if (!this.files) {
      return;
    }
    this.remove.emit(this.files[index]);
    this.files?.splice(index, 1);
  }
  public uploadFiles(event: MouseEvent): void {
    event.preventDefault();
    const fileInput = this.createUploadFileInput();
    this.inputFileContainer.nativeElement.append(fileInput);

    fileInput.addEventListener('change', () => {
      if (!fileInput.files?.length) {
        fileInput.remove();
        return;
      }
      this.readMultiFiles(Array.from(fileInput.files));

      fileInput.remove();
    });
    fileInput.click();
  }

  private readMultiFiles(files: File[]) {
    const result: UploadFile[] = [];
    const reader = new FileReader();
    const readFile = (index) => {
      if (index >= files.length) {
        if (this.files) {
          result.unshift(...this.files);
        }
        this.updateValue(result);
        return;
      }
      const file = files[index];
      reader.onload = (e) => {
        result.push({
          name: file.name,
          url: e.target?.result?.toString() || '',
          file,
        });

        readFile(index + 1);
      };
      reader.readAsDataURL(file);
    };
    readFile(0);
  }

  private createUploadFileInput(): HTMLInputElement {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <input hidden name="images" type="file" multiple>
    `;

    return wrapper.firstElementChild as HTMLInputElement;
  }

  private getFileExtension(fileName: string) {
    const result = fileName.match(/\.\w+$/);

    if (result) {
      return result[0];
    }

    return '';
  }

  /*
    Value Accessor
  */
  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public writeValue(out: UploadFile[] | null | undefined) {
    this.files = out;
  }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public updateValue(value: UploadFile[] | null | undefined) {
    this.files = value;
    if (this.onChange) {
      this.onChange(value);
    }

    if (this.onTouched) {
      this.onTouched();
    }
  }
}

export interface UploadFile {
  name: string;
  url: string;
  file?: File;
}
