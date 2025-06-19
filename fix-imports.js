// fix-imports.js - Script para corregir todos los imports de NavigationContext
const fs = require('fs');
const path = require('path');

// Función para buscar archivos recursivamente
function findFiles(dir, extension, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules')) {
      findFiles(fullPath, extension, files);
    } else if (stat.isFile() && item.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Función para corregir imports en un archivo
function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Patrón para encontrar imports incorrectos
  const incorrectImportPattern = /import\s*{\s*NavigationContext\s*}\s*from\s*['"].*App['"];?/g;
  
  // Si encuentra el import incorrecto
  if (incorrectImportPattern.test(content)) {
    console.log(`📝 Corrigiendo: ${filePath}`);
    
    // Calcular la profundidad del archivo para el import relativo correcto
    const relativePath = path.relative('src', filePath);
    const depth = relativePath.split(path.sep).length - 1;
    const importPath = '../'.repeat(depth) + 'contexts/NavigationContext';
    
    // Reemplazar el import incorrecto
    const newContent = content.replace(
      incorrectImportPattern,
      `import { useNavigation } from '${importPath}';`
    );
    
    // También cambiar useContext(NavigationContext) por useNavigation()
    const finalContent = newContent.replace(
      /const\s*{\s*([^}]+)\s*}\s*=\s*useContext\(NavigationContext\);/g,
      'const { $1 } = useNavigation();'
    );
    
    fs.writeFileSync(filePath, finalContent, 'utf8');
    return true;
  }
  
  return false;
}

// Función principal
function main() {
  console.log('🔧 Iniciando corrección de imports...\n');
  
  const srcDir = path.join(__dirname, 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Directorio src/ no encontrado');
    return;
  }
  
  // Buscar todos los archivos TypeScript y TypeScript React
  const files = [
    ...findFiles(srcDir, '.ts'),
    ...findFiles(srcDir, '.tsx')
  ];
  
  console.log(`📂 Encontrados ${files.length} archivos para revisar\n`);
  
  let fixedCount = 0;
  
  for (const file of files) {
    if (fixImportsInFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n✅ Corrección completada!`);
  console.log(`📊 Archivos corregidos: ${fixedCount}`);
  console.log(`📊 Archivos revisados: ${files.length}`);
  
  if (fixedCount > 0) {
    console.log('\n🎯 Próximos pasos:');
    console.log('1. Verificar que no hay errores de compilación');
    console.log('2. Probar la navegación en el frontend');
    console.log('3. Verificar que el useNavigation hook funciona correctamente');
  }
}

main();