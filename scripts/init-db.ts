import { initializeDatabase } from '@/lib/db';

async function main() {
  console.log('🚀 Inicializando base de datos PampaPro...');
  
  try {
    const db = await initializeDatabase();
    console.log('✅ Base de datos inicializada correctamente');
    
    // Verificar datos
    const userCount = await db.select().from(users).execute();
    console.log(`📊 Usuarios en sistema: ${userCount.length}`);
    
    const serviceCount = await db.select().from(services).execute();
    console.log(`📊 Servicios en sistema: ${serviceCount.length}`);
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  }
}

main();