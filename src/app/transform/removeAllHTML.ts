import sanitizeHtml from 'sanitize-html';

export default function (content: string) {
  return sanitizeHtml(content, {allowedTags: [], allowedAttributes: {}}).trim();
}
