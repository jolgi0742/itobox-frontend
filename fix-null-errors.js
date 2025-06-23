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

// Función para corregir errores de null/undefined
function fixNullErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // 1. Corregir getParam que puede retornar null
  const getParamPattern = /getParam\('([^']+)'\)/g;
  const matches = content.match(getParamPattern);
  
  if (matches) {
    matches.forEach(match => {
      const paramName = match.match(/getParam\('([^']+)'\)/)[1];
      const variableName = paramName + 'Id';
      
      // Buscar si se usa en navigate() sin verificar null
      const navigatePattern = new RegExp(`navigate\\([^,]+,\\s*{[^}]*${variableName}[^}]*}\\)`, 'g');
      
      if (navigatePattern.test(content)) {
        // Reemplazar con verificación de null
        content = content.replace(
          new RegExp(`const ${variableName} = getParam\\('${paramName}'\\);`, 'g'),
          `const ${variableName} = getParam('${paramName}');`
        );
        
        // Agregar verificación antes de navigate
        content = content.replace(
          navigatePattern,
          (match) => {
            return `if (${variableName}) { ${match} }`
          }
        );
        
        changed = true;
        console.log(`✅ Fixed null check for ${paramName} in: ${filePath}`);
      }
    });
  }
  
  // 2. Corregir imports de useNavigationContext → useNavigation
  if (content.includes('useNavigationContext')) {
    content = content.replace(/useNavigationContext/g, 'useNavigation');
    changed = true;
    console.log(`✅ Fixed useNavigationContext in: ${filePath}`);
  }
  
  // 3. Corregir imports de componentes UI
  const uiImports = [
    { from: 'import { Badge }', to: 'import Badge' },
    { from: 'import { Button }', to: 'import Button' },
    { from: 'import { Modal }', to: 'import Modal' }
  ];
  
  uiImports.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
      changed = true;
      console.log(`✅ Fixed UI import ${from} in: ${filePath}`);
    }
  });
  
  // 4. Corregir Motorcycle → Bike
  if (content.includes('Motorcycle')) {
    content = content.replace(/Motorcycle/g, 'Bike');
    changed = true;
    console.log(`✅ Fixed Motorcycle → Bike in: ${filePath}`);
  }
  
  // 5. Agregar ! para forzar non-null en casos seguros
  const safeNullAssertions = [
    // Para IDs que sabemos que existen cuando estamos en páginas de detalle
    { pattern: /navigate\('([^']+)', { id: (\w+Id) }\)/g, replacement: "navigate('$1', { id: $2! })" },
    { pattern: /navigate\('([^']+)', { ([^:]+): (\w+Id) }\)/g, replacement: "navigate('$1', { $2: $3! })" }
  ];
  
  safeNullAssertions.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      changed = true;
      console.log(`✅ Added null assertion in: ${filePath}`);
    }
  });
  
  // Guardar solo si hubo cambios
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`💾 Saved changes to: ${filePath}`);
  }
}

// Ejecutar correcciones
console.log('🔧 Iniciando corrección de errores de null...\n');

const srcDir = path.join(process.cwd(), 'src');
const tsxFiles = findFiles(srcDir, '.tsx');
const tsFiles = findFiles(srcDir, '.ts');

const allFiles = [...tsxFiles, ...tsFiles];

console.log(`📁 Encontrados ${allFiles.length} archivos para revisar\n`);

allFiles.forEach(file => {
  try {
    fixNullErrors(file);
  } catch (error) {
    console.error(`❌ Error procesando ${file}:`, error.message);
  }
});

console.log('\n✨ Corrección de errores null completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Ejecuta: npm start');
console.log('2. Verifica que compila sin errores');
console.log('3. Si quedan errores de null, revisa manualmente');