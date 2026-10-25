import ts from 'typescript';

export function hasUnfinishedComment(text, filename = 'source.tsx') {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, filename.endsWith('.tsx') ? ts.LanguageVariant.JSX : ts.LanguageVariant.Standard, text);
  for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
    if ([ts.SyntaxKind.SingleLineCommentTrivia, ts.SyntaxKind.MultiLineCommentTrivia].includes(token) && /\b(?:TODO|FIXME)\b/.test(scanner.getTokenText())) return true;
  }
  return false;
}
