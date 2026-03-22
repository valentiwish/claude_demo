import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than 1 minute
  if (diff < 60000) {
    return '刚刚';
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} 分钟前`;
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} 小时前`;
  }

  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} 天前`;
  }

  // Otherwise show date
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function countWords(content: string): number {
  try {
    const doc = JSON.parse(content);
    let text = '';

    function extractText(node: any) {
      if (node.text) {
        text += node.text + ' ';
      }
      if (node.content) {
        node.content.forEach(extractText);
      }
    }

    extractText(doc);
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
    const englishWords = text.match(/[a-zA-Z]+/g) || [];
    return chineseChars.length + englishWords.length;
  } catch {
    return 0;
  }
}

export function countCharacters(content: string): number {
  try {
    const doc = JSON.parse(content);
    let text = '';

    function extractText(node: any) {
      if (node.text) {
        text += node.text;
      }
      if (node.content) {
        node.content.forEach(extractText);
      }
    }

    extractText(doc);
    return text.length;
  } catch {
    return 0;
  }
}

export function getReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} 分钟阅读`;
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
