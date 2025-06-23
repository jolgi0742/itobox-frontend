const fs = require('fs');
const path = require('path');

// Función para encontrar archivos recursivamente
function findFiles(dir, extension) {
  const files = [];
  
  function scan(directory) {
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && item !== 'node_modules' && item !== '.git') {
        scan(fullPath);
      } else if (stat.isFile() && item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

// Función para corregir imports en un archivo
function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // 1. Corregir useNavigationContext → useNavigation
  if (content.includes('useNavigationContext')) {
    content = content.replace(/useNavigationContext/g, 'useNavigation');
    changed = true;
    console.log(`✅ Fixed useNavigationContext in: ${filePath}`);
  }
  
  // 2. Corregir imports de Badge, Button, Modal (named → default)
  if (content.includes('import { Badge }')) {
    content = content.replace(/import { Badge }/g, 'import Badge');
    changed = true;
    console.log(`✅ Fixed Badge import in: ${filePath}`);
  }
  
  if (content.includes('import { Button }')) {
    content = content.replace(/import { Button }/g, 'import Button');
    changed = true;
    console.log(`✅ Fixed Button import in: ${filePath}`);
  }
  
  if (content.includes('import { Modal }')) {
    content = content.replace(/import { Modal }/g, 'import Modal');
    changed = true;
    console.log(`✅ Fixed Modal import in: ${filePath}`);
  }
  
  // 3. Corregir imports mixtos (Badge, Button, Modal junto a otros)
  content = content.replace(
    /import { ([^}]*), Badge, ([^}]*) } from/g,
    'import { $1, $2 } from'
  );
  content = content.replace(
    /import { Badge, ([^}]*) } from ([^;]+);/g,
    'import { $1 } from $2;\nimport Badge from'
  );
  
  // 4. Agregar import de Badge si se usa pero no está importado
  if (content.includes('<Badge') && !content.includes('import Badge')) {
    const firstImport = content.indexOf('import');
    if (firstImport !== -1) {
      const importLine = "import Badge from '../../../components/ui/Badge';\n";
      content = content.slice(0, firstImport) + importLine + content.slice(firstImport);
      changed = true;
      console.log(`✅ Added Badge import in: ${filePath}`);
    }
  }
  
  // 5. Corregir Motorcycle → Bike
  if (content.includes('Motorcycle')) {
    content = content.replace(/Motorcycle/g, 'Bike');
    changed = true;
    console.log(`✅ Fixed Motorcycle → Bike in: ${filePath}`);
  }
  
  // Guardar solo si hubo cambios
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`💾 Saved changes to: ${filePath}`);
  }
}

// Ejecutar correcciones
console.log('🔧 Iniciando corrección masiva de imports...\n');

const srcDir = path.join(process.cwd(), 'src');
const tsxFiles = findFiles(srcDir, '.tsx');
const tsFiles = findFiles(srcDir, '.ts');

const allFiles = [...tsxFiles, ...tsFiles];

console.log(`📁 Encontrados ${allFiles.length} archivos para revisar\n`);

allFiles.forEach(file => {
  try {
    fixImportsInFile(file);
  } catch (error) {
    console.error(`❌ Error procesando ${file}:`, error.message);
  }
});

console.log('\n✨ Corrección masiva completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Ejecuta: npm start');
console.log('2. Verifica que compila sin errores');
console.log('3. Si quedan errores, corrígelos manualmente');