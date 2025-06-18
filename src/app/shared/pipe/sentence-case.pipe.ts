import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentenceCase'
})
export class SentenceCasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    // Chuyển từng câu (sau dấu chấm) thành viết hoa
    return value
      .split(/([.!?]\s*)/g) // Tách theo dấu kết thúc câu
      .map((part, i, arr) => {
        // Nếu là phần chứa câu (không phải dấu chấm)
        if (i % 2 === 0) {
          return part.trim().charAt(0).toUpperCase() + part.trim().slice(1);
        }
        return part; // phần dấu chấm, giữ nguyên
      })
      .join('');
  }
}
