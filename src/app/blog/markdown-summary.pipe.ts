import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'markdownSummary'
})
export class MarkdownSummaryPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value
      .replace(new RegExp('\\[.*]\\(.*\\)', 'g'), '')
      .replace(new RegExp('[*#>`-]', 'g'), '');
  }

}
