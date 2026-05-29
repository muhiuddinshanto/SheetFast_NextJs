const fs = require('fs');
const path = 'f:/Mohiuddin/Programimg hero/Whatsapp Automation/final/SheetFast+nextjs/pages/index.jsx';
let text = fs.readFileSync(path, 'utf8');
let lines = text.split(/\r?\n/);
const idx = lines.findIndex((line) => line.includes('Invoice Logo (ঐচ্ছিক)'));
if (idx === -1) {
  console.error('Invoice Logo block not found');
  process.exit(1);
}
let start = idx - 1;
while (start > 0 && !lines[start].trim().startsWith('<div')) {
  start -= 1;
}
let end = idx + 1;
while (end < lines.length && !lines[end].trim().startsWith('</div>')) {
  end += 1;
}
if (end >= lines.length) {
  console.error('End of logo input block not found');
  process.exit(1);
}
lines.splice(start, end - start + 1, '                    <img ref={logoRef} src="/customer_logo.svg" alt="Company Logo" className="hidden" />');
fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('upload field removed');
