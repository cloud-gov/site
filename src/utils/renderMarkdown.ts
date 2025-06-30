import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: false,     // Disallow raw HTML
  linkify: false,   // Auto-link URLs
  breaks: true     // Convert line breaks into <br>
});

export function renderMarkdown(text: string, inline = false): string {
  return inline ? md.renderInline(text) : md.render(text);
}
