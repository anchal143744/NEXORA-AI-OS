import ts from 'typescript';
export function hasDisallowedSourceMarkers(text){
  const scanner=ts.createScanner(ts.ScriptTarget.Latest,false,ts.LanguageVariant.JSX,text);
  for(let token=scanner.scan();token!==ts.SyntaxKind.EndOfFileToken;token=scanner.scan()){
    if((token===ts.SyntaxKind.SingleLineCommentTrivia||token===ts.SyntaxKind.MultiLineCommentTrivia)&&/\b(?:TODO|FIXME)\b/i.test(scanner.getTokenText()))return true;
  }
  const source=ts.createSourceFile('source.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  let debuggerFound=false;function visit(node){if(ts.isDebuggerStatement(node))debuggerFound=true;ts.forEachChild(node,visit);}visit(source);return debuggerFound;
}
