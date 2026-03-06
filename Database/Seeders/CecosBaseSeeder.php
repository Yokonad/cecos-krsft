<?php

namespace Modulos_ERP\CecosKrsft\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CecosBaseSeeder extends Seeder
{
    /**
     * Seed the application's database with base CECOs.
     */
    public function run(): void
    {
        $baseCecos = [
            ['codigo' => '0101', 'nombre' => 'MQ'],
            ['codigo' => '0102', 'nombre' => 'MODIFICACIONES'],
            ['codigo' => '0103', 'nombre' => 'KAM'],
            ['codigo' => '0104', 'nombre' => 'GABINETE'],
            ['codigo' => '0105', 'nombre' => 'OTROS CLIENTES'],
            ['codigo' => '0106', 'nombre' => 'RED INTERNA'],
            ['codigo' => '0107', 'nombre' => 'SOLGAS'],
            ['codigo' => '108', 'nombre' => 'PROYECTOS SUR'],
            ['codigo' => '109', 'nombre' => 'CEYA'],
        ];

        foreach ($baseCecos as $ceco) {
            DB::table('cecos')->updateOrInsert(
                ['codigo' => $ceco['codigo']],
                [
                    'nombre' => $ceco['nombre'],
                    'tipo_cliente' => $ceco['codigo'],
                    'nivel' => 0,
                    'parent_id' => null,
                    'tipo_subcuenta' => null,
                    'estado' => true,
                    'razon_social' => null,
                    'descripcion' => 'CECO Base - ' . $ceco['nombre'],
                    'updated_at' => now(),
                ]
            );
            $this->command->info("✓ CECO {$ceco['codigo']} - {$ceco['nombre']} sincronizado");
        }

        // ── MQ (0101) ──
        $this->seedClienteConSubcuentas('0101', '010101', 'QUIMPAC');
        $this->seedClienteConSubcuentas('0101', '010102', 'OTROS');
        $this->seedClienteConSubcuentas('0101', '010103', 'BIMBO');
        $this->seedClienteConSubcuentas('0101', '010104', 'MOLITALIA - VENEZUELA');
        $this->seedClienteConSubcuentas('0101', '010105', 'MOLITALIA - AVENA');
        $this->seedClienteConSubcuentas('0101', '010106', 'PROQUINSA - MQ');
        $this->seedClienteConSubcuentas('0101', '010107', 'FABRICA PERUANA ETERNIT');
        $this->seedClienteConSubcuentas('0101', '010108', 'VITREOUS SANITARIA');
        $this->seedClienteConSubcuentas('0101', '010109', 'FORSAC PERU');
        $this->seedClienteConSubcuentas('0101', '010110', 'HOSPITAL MILITAR');
        $this->seedClienteConSubcuentas('0101', '010111', 'MAXON PERU');
        $this->seedClienteConSubcuentas('0101', '010112', 'INDUPARK');
        $this->seedClienteConSubcuentas('0101', '010113', 'PACKAGING');
        $this->seedClienteConSubcuentas('0101', '010114', 'CONSORCIO E INVERSIONES TC');
        $this->seedClienteConSubcuentas('0101', '010115', 'INVERSIONES ALMET S.A.C');
        $this->seedClienteConSubcuentas('0101', '010116', 'TINTORERIA PERU COLOR SAC');
        $this->seedClienteConSubcuentas('0101', '010117', 'INMOBILIARIA KANPU S.A');
        $this->seedClienteConSubcuentas('0101', '010118', 'GRUPO TEXTIL YADAH S.A.C');
        $this->seedClienteConSubcuentas('0101', '010119', 'CHOCOLATES DEL PERU');
        $this->seedClienteConSubcuentas('0101', '010120', 'DOÑA ISABEL');
        $this->seedClienteConSubcuentas('0101', '010121', 'AJINOMOTO');
        $this->seedClienteConSubcuentas('0101', '010122', 'INVERSIONES MICE S.A.C');
        $this->seedClienteConSubcuentas('0101', '010123', 'CORPORACION LINDEY');
        $this->seedClienteConSubcuentas('0101', '010124', 'CLARIANT PERU SA');
        $this->seedClienteConSubcuentas('0101', '010125', 'LA TERCER - PREVENTIVO');
        $this->seedClienteConSubcuentas('0101', '010126', 'DALKA - ROTOPLAS');
        $this->seedClienteConSubcuentas('0101', '010127', 'CORPORACION ESTRELLA');
        $this->seedClienteConSubcuentas('0101', '010128', 'TEXTIL DAMARIS');
        $this->seedClienteConSubcuentas('0101', '010129', 'UNIQUE');
        $this->seedClienteConSubcuentas('0101', '010130', 'ROKYS - SAN LUIS');
        $this->seedClienteConSubcuentas('0101', '010131', 'HEINZ GLASS');
        $this->seedClienteConSubcuentas('0101', '010132', 'TEXTIL OCEANO');
        $this->seedClienteConSubcuentas('0101', '010133', 'ALIMENTOS CIELO - LURIN');
        $this->seedClienteConSubcuentas('0101', '010134', 'SNACKS AMERICA LATINA - PEPSICO');
        $this->seedClienteConSubcuentas('0101', '010135', 'NEGOCIOS H Y D S.A.C');
        $this->seedClienteConSubcuentas('0101', '010136', 'GELAFURT');
        $this->seedClienteConSubcuentas('0101', '010137', 'ALIMENTOS CIELO - HUACHIPA');
        $this->seedClienteConSubcuentas('0101', '010138', 'TEXTIL INTEGRAL GROUP');
        $this->seedClienteConSubcuentas('0101', '010139', 'MEDIFARMA S.A.');
        $this->seedClienteConSubcuentas('0101', '010140', 'PERUVIAN NATURE SYS SAC');
        $this->seedClienteConSubcuentas('0101', '010141', 'MANUFACTURAS TERROT S.A.C');
        $this->seedClienteConSubcuentas('0101', '010142', 'TRUPAL S.A. (EVITAMIENTO)');
        $this->seedClienteConSubcuentas('0101', '010143', 'TRUPAL S.A. (LURIGANCHO)');
        $this->seedClienteConSubcuentas('0101', '010144', 'LATERCER SAC');
        $this->seedClienteConSubcuentas('0101', '010145', 'COMPAÑIA GOODYEAR DEL PERU S.A');
        $this->seedClienteConSubcuentas('0101', '010146', 'CONFECCIONES LANCASTER S.A.');
        $this->seedClienteConSubcuentas('0101', '010147', 'GANADERA SANTA ELENA S.A.');
        $this->seedClienteConSubcuentas('0101', '010148', 'COMPAÑIA MOLINERA DEL CENTRO SA');
        $this->seedClienteConSubcuentas('0101', '010149', 'MEDROCK CORPORATION S.A.C');
        $this->seedClienteConSubcuentas('0101', '010150', 'DESPENSA PERUANA S.A.');
        $this->seedClienteConSubcuentas('0101', '010151', 'PRODUCTOS DE ACERO CASSADO S.A.');
        $this->seedClienteConSubcuentas('0101', '010152', 'MARROQUINERA VALENCIA S.A.C.');

        // ── MODIFICACIONES (0102) ──
        $this->seedClienteConSubcuentas('0102', '010201', 'OWEN');
        $this->seedClienteConSubcuentas('0102', '010202', 'OTROS');
        $this->seedClienteConSubcuentas('0102', '010203', 'QUMPAQ I');
        $this->seedClienteConSubcuentas('0102', '010204', 'COMPAÑIA MINERA LUREN');
        $this->seedClienteConSubcuentas('0102', '010207', 'IEGA - AMPLIACION');
        $this->seedClienteConSubcuentas('0102', '010208', 'INKA MICUNA');
        $this->seedClienteConSubcuentas('0102', '010209', 'TEXTILES RENACER');
        $this->seedClienteConSubcuentas('0102', '010210', 'CERAMICA SAN LORENZO');
        $this->seedClienteConSubcuentas('0102', '010211', 'REDUCCION QUMPAQ I');
        $this->seedClienteConSubcuentas('0102', '010212', 'INDUSTRIAS FLOMAR SAC');
        $this->seedClienteConSubcuentas('0102', '010213', 'PROQUINA - AMP');
        $this->seedClienteConSubcuentas('0102', '010214', 'INDUSTRIAS DEL ENVASE');
        $this->seedClienteConSubcuentas('0102', '010215', 'PAPELERA INDUSTRIAL Y COMERC');
        $this->seedClienteConSubcuentas('0102', '010216', 'PANIFICADORA A&A');
        $this->seedClienteConSubcuentas('0102', '010217', 'T & C ASOCIADOS');
        $this->seedClienteConSubcuentas('0102', '010218', 'INDUSTRIAS DEL RIO');
        $this->seedClienteConSubcuentas('0102', '010219', 'LIMA GOLF CLUB');
        $this->seedClienteConSubcuentas('0102', '010220', 'FABRICA DE ENVASES');
        $this->seedClienteConSubcuentas('0102', '010221', 'SHMAYA');
        $this->seedClienteConSubcuentas('0102', '010222', 'LAVADOS UNIDOS MUNDO SA');
        $this->seedClienteConSubcuentas('0102', '010223', 'INDUSTRIAL NUEVO MUNDO SA');
        $this->seedClienteConSubcuentas('0102', '010224', 'SANT GOBIAN');
        $this->seedClienteConSubcuentas('0102', '010225', 'RAMI TEXTILES');
        $this->seedClienteConSubcuentas('0102', '010226', 'LAM');
        $this->seedClienteConSubcuentas('0102', '010227', 'WHO ROLLING PIN S.R.L.');
        $this->seedClienteConSubcuentas('0102', '010228', 'WHITE');
        $this->seedClienteConSubcuentas('0102', '010229', 'NK MANAGEMENT');
        $this->seedClienteConSubcuentas('0102', '010230', 'INVERSIONES DUVAL SAC');
        $this->seedClienteConSubcuentas('0102', '010231', 'FUNDICION VENTANILLA S.A.');
        $this->seedClienteConSubcuentas('0102', '010232', 'PERUANA DE MOLDEADOS S.A.');
        $this->seedClienteConSubcuentas('0102', '010233', 'INVERSIONES LIBER S.A.');
        $this->seedClienteConSubcuentas('0102', '010234', 'APL TEXTIL S.A.C.');
        $this->seedClienteConSubcuentas('0102', '010235', 'PEYSA AUTO PARTS S.A.C.');
        $this->seedClienteConSubcuentas('0102', '010236', 'CPNE EMR-16281 BRAEDT S.');
        $this->seedClienteConSubcuentas('0102', '010237', 'CAMAL CONCHUCOS S.A.');
        $this->seedClienteConSubcuentas('0102', '010238', 'IMPORTADORA Y EXPORTADORA DO');
        $this->seedClienteConSubcuentas('0102', '010239', 'OWENS ILLINOIS, VALLE Y ANTIS');
        $this->seedClienteConSubcuentas('0102', '010240', 'FAST EYE S.A.C.');

        // ── KAM (0103) ──
        $this->seedClienteConSubcuentas('0103', '010301', 'CENCOSUD');
        $this->seedClienteConSubcuentas('0103', '010302', 'OTROS');
        $this->seedClienteConSubcuentas('0103', '010303', 'COUNTRY CLUB CHORRILLOS');
        $this->seedClienteConSubcuentas('0103', '010304', 'CLINICA SANNA');
        $this->seedClienteConSubcuentas('0103', '010305', 'UNMSM - GENERACION');
        $this->seedClienteConSubcuentas('0103', '010306', 'PARQUE LA AMISTAD - GENERACION');
        $this->seedClienteConSubcuentas('0103', '010307', 'COLEGIO ANTONIO RAIMONDI G10');
        $this->seedClienteConSubcuentas('0103', '010308', 'COLEGIO ANTONIO RAIMONDI G25');
        $this->seedClienteConSubcuentas('0103', '010309', 'REST. MELT - BEGONIAS');
        $this->seedClienteConSubcuentas('0103', '010310', 'CASA JARANA - BEGONIAS');
        $this->seedClienteConSubcuentas('0103', '010311', 'PARK AMISTAD - KAM');
        $this->seedClienteConSubcuentas('0103', '010312', 'MALBEC BACO Y BACA');
        $this->seedClienteConSubcuentas('0103', '010313', 'SMART FIT - BIO RITMO');
        $this->seedClienteConSubcuentas('0103', '010314', 'IND ALIMENTICIAS JORGE ALFONSO');
        $this->seedClienteConSubcuentas('0103', '010315', 'CLINICA ANGLOAMERICANA');
        $this->seedClienteConSubcuentas('0103', '010316', 'RUSTICA REAL PLAZA PURUCHUCO');
        $this->seedClienteConSubcuentas('0103', '010317', 'BEMBOS - AV LARCO');
        $this->seedClienteConSubcuentas('0103', '010318', 'EDO SUSHI BAR');
        $this->seedClienteConSubcuentas('0103', '010319', "FRIDAY's (REAL PLAZA PRIMAVERA)");
        $this->seedClienteConSubcuentas('0103', '010320', 'MASTER KONG');
        $this->seedClienteConSubcuentas('0103', '010321', 'HOTEL NOBILITY - ANGAMOS OESTE');
        $this->seedClienteConSubcuentas('0103', '010322', 'EDIFICIO SANTA LUISA');
        $this->seedClienteConSubcuentas('0103', '010323', 'BODEGA LA TRATTORIA');
        $this->seedClienteConSubcuentas('0103', '010324', 'IDEAS Y MAS IDEAS (KAU XIN)');
        $this->seedClienteConSubcuentas('0103', '010325', 'SGS');
        $this->seedClienteConSubcuentas('0103', '010326', 'KFC-CARABAYLLO');
        $this->seedClienteConSubcuentas('0103', '010327', 'HOTEL BEST WESTERM (SANTA ANITA)');
        $this->seedClienteConSubcuentas('0103', '010328', 'HOTEL SANTA CRUZ (TECNOCASA-SA) MIRAFLORES');
        $this->seedClienteConSubcuentas('0103', '010329', 'CAMPO DE MARTE / FEDERACION DEPOR. PERUANA DE NATACION');
        $this->seedClienteConSubcuentas('0103', '010330', 'HOTEL NOBILITY - REPUBLICA DE PANAMA');
        $this->seedClienteConSubcuentas('0103', '010331', 'RESTAURANTE SAN TEMPLO - REAL CLUB DE LIMA');
        $this->seedClienteConSubcuentas('0103', '010332', 'PIZZERIA ZARELLE EL POLLO');
        $this->seedClienteConSubcuentas('0103', '010333', 'MADAN TUSAN - 5145158');
        $this->seedClienteConSubcuentas('0103', '010334', 'INDECI G40');
        $this->seedClienteConSubcuentas('0103', '010335', 'AF CONCEPT');
        $this->seedClienteConSubcuentas('0103', '010336', 'PARDOS CHICKEN RP PRIMAVERA');
        $this->seedClienteConSubcuentas('0103', '010337', 'CIRCULO MILITAR - JM');
        $this->seedClienteConSubcuentas('0103', '010338', 'EE.RR SONG - PARQUE ARAUJO');
        $this->seedClienteConSubcuentas('0103', '010339', 'INVERSIONES MELT');
        $this->seedClienteConSubcuentas('0103', '010340', 'UP BURGUER');
        $this->seedClienteConSubcuentas('0103', '010341', 'HOSPITAL LIMA ESTE VITARTE');
        $this->seedClienteConSubcuentas('0103', '010342', 'UNMSM - AMP ANTIGUA FIQ');
        $this->seedClienteConSubcuentas('0103', '010343', 'UNMSM - PLANTA PILOTO');
        $this->seedClienteConSubcuentas('0103', '010344', 'KFC CHORRILLOS');
        $this->seedClienteConSubcuentas('0103', '010345', 'PIZZA HUT CHORRILLOS');
        $this->seedClienteConSubcuentas('0103', '010346', 'MTTO MALL COMAS');
        $this->seedClienteConSubcuentas('0103', '010347', 'MARRIOT MIRAFLORES');
        $this->seedClienteConSubcuentas('0103', '010348', 'MADAM TUSAN - jockey plaza');
        $this->seedClienteConSubcuentas('0103', '010349', 'CUCA');

        // ── GABINETE (0104) ──
        $this->seedClienteConSubcuentas('0104', '010401', '');

        // ── OTROS CLIENTES (0105) ──
        $this->seedClienteConSubcuentas('0105', '010501', 'OTROS');
        $this->seedClienteConSubcuentas('0105', '010502', 'OWENS QANTU / AMPLIACION II');
        $this->seedClienteConSubcuentas('0105', '010503', 'AGROMAR CIENEGUILLO');
        $this->seedClienteConSubcuentas('0105', '010505', 'MINERA TITAN - FV');
        $this->seedClienteConSubcuentas('0105', '010506', 'HOSPITAL CAYETANO HEREDIA');
        $this->seedClienteConSubcuentas('0105', '010507', 'AQUAPRO');
        $this->seedClienteConSubcuentas('0105', '010508', 'HOSPITAL HERNANDEZ ICA');
        $this->seedClienteConSubcuentas('0105', '010509', 'HOSPITAL RENE TOCCE GROPPO CHINCHA');
        $this->seedClienteConSubcuentas('0105', '010510', 'TALLER PROTOTIPO');

        // ── RED INTERNA (0106) ──
        $this->seedClienteConSubcuentas('0106', '010601', 'COESTI VILLA EL SALVADOR');
        $this->seedClienteConSubcuentas('0106', '010602', 'CORPORACIÓN PUNTO ELASTIC S.A.C');

        // ── SOLGAS: GRIFO PECSA WARI ──
        $this->seedClienteConSubcuentas('0107', '010701', 'GRIFO PECSA WARI');

        // ── PROYECTOS SUR: actualizar 0108 → 108 + GASTOS ADMINISTRATIVOS ──
        $proyectosSur = DB::table('cecos')->where('codigo', '0108')->first();
        if ($proyectosSur) {
            DB::table('cecos')->where('id', $proyectosSur->id)->update([
                'codigo' => '108', 'tipo_cliente' => '108', 'updated_at' => now(),
            ]);
            $this->command->info("✓ PROYECTOS SUR actualizado a 108");
        }
        $this->seedClienteConSubcuentas('108', '10801', 'GASTOS ADMINISTRATIVOS');

        // CEYA: Actualizar si existe como 0109, o buscar/crear como 109
        $ceya = DB::table('cecos')->where('codigo', '0109')->first();
        
        if ($ceya) {
            // Actualizar 0109 a 109
            DB::table('cecos')
                ->where('id', $ceya->id)
                ->update([
                    'codigo' => '109',
                    'nombre' => 'CEYA',
                    'tipo_cliente' => '109',
                    'nivel' => 0,
                    'parent_id' => null,
                    'tipo_subcuenta' => null,
                    'estado' => true,
                    'descripcion' => 'CECO Base - CEYA',
                    'updated_at' => now(),
                ]);
            
            $this->command->info("✓ CECO 0109 actualizado a 109 - CEYA");
            $ceyaId = $ceya->id;
        } else {
            // Buscar si ya existe como 109
            $ceyaExists = DB::table('cecos')->where('codigo', '109')->first();
            
            if ($ceyaExists) {
                // Ya existe, solo usar su id
                $ceyaId = $ceyaExists->id;
                $this->command->info("✓ CECO 109 - CEYA ya existe");
            } else {
                // Crear nuevo CEYA con código 109
                $ceyaId = DB::table('cecos')->insertGetId([
                    'codigo' => '109',
                    'nombre' => 'CEYA',
                    'tipo_cliente' => '109',
                    'nivel' => 0,
                    'parent_id' => null,
                    'tipo_subcuenta' => null,
                    'estado' => true,
                    'razon_social' => null,
                    'descripcion' => 'CECO Base - CEYA',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                
                $this->command->info("✓ CECO 109 - CEYA creado");
            }
        }

        // Agregar subcuentas para CEYA
        // Estructura: 10901 = LEITECORP S.A.C. (nivel 1, sin parent)
        //             1090101/02/03 = subcuentas MO/GD/GI (nivel 2, parent = LEITECORP)
        $leitecorp = DB::table('cecos')->where('codigo', '10901')->first();

        if (!$leitecorp) {
            $leitecorpId = DB::table('cecos')->insertGetId([
                'codigo' => '10901',
                'nombre' => 'LEITECORP S.A.C.',
                'razon_social' => 'LEITECORP S.A.C.',
                'tipo_cliente' => '109',
                'nivel' => 1,
                'parent_id' => null,
                'tipo_subcuenta' => null,
                'estado' => true,
                'descripcion' => 'CLIENTE CEYA - LEITECORP S.A.C.',
                'codigo_auto_generado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $this->command->info("✓ CLIENTE 10901 - LEITECORP S.A.C. creado");
        } else {
            $leitecorpId = $leitecorp->id;
            $this->command->warn("⊘ CLIENTE 10901 ya existe, saltando...");
        }

        $ceyaSubcuentas = [
            ['codigo' => '1090101', 'nombre' => 'LEITECORP S.A.C. - MO (Mano de Obra)', 'tipo' => '01'],
            ['codigo' => '1090102', 'nombre' => 'LEITECORP S.A.C. - Gastos Directos', 'tipo' => '02'],
            ['codigo' => '1090103', 'nombre' => 'LEITECORP S.A.C. - Gastos Indirectos', 'tipo' => '03'],
        ];

        foreach ($ceyaSubcuentas as $subcuenta) {
            $exists = DB::table('cecos')->where('codigo', $subcuenta['codigo'])->exists();

            if (!$exists) {
                DB::table('cecos')->insert([
                    'codigo' => $subcuenta['codigo'],
                    'nombre' => $subcuenta['nombre'],
                    'razon_social' => 'LEITECORP S.A.C.',
                    'tipo_cliente' => '109',
                    'nivel' => 2,
                    'parent_id' => $leitecorpId,
                    'tipo_subcuenta' => $subcuenta['tipo'],
                    'estado' => true,
                    'descripcion' => $subcuenta['nombre'],
                    'codigo_auto_generado' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $this->command->info("✓ SUBCUENTA {$subcuenta['codigo']} - {$subcuenta['nombre']} creada");
            } else {
                $this->command->warn("⊘ SUBCUENTA {$subcuenta['codigo']} ya existe, saltando...");
            }
        }

        $this->command->info("\n✓ Seeders de CECOs base completado");
    }

    private function seedClienteConSubcuentas(string $grupoCodigo, string $clienteCodigo, string $clienteNombre): void
    {
        $cliente = DB::table('cecos')->where('codigo', $clienteCodigo)->first();

        if (!$cliente) {
            $clienteId = DB::table('cecos')->insertGetId([
                'codigo'               => $clienteCodigo,
                'nombre'               => $clienteNombre,
                'razon_social'         => $clienteNombre,
                'tipo_cliente'         => $grupoCodigo,
                'nivel'                => 1,
                'parent_id'            => null,
                'tipo_subcuenta'       => null,
                'estado'               => true,
                'descripcion'          => 'CLIENTE ' . $grupoCodigo . ' - ' . $clienteNombre,
                'codigo_auto_generado' => true,
                'created_at'           => now(),
                'updated_at'           => now(),
            ]);
            $this->command->info("✓ CLIENTE {$clienteCodigo} - {$clienteNombre} creado");
        } else {
            $clienteId = $cliente->id;
            $this->command->warn("⊘ CLIENTE {$clienteCodigo} ya existe, saltando...");
        }

        $sufijos = [
            ['tipo' => '01', 'nombre' => 'MO (Mano de Obra)'],
            ['tipo' => '02', 'nombre' => 'Gastos Directos'],
            ['tipo' => '03', 'nombre' => 'Gastos Indirectos'],
        ];

        foreach ($sufijos as $sufijo) {
            $codigoSub = $clienteCodigo . $sufijo['tipo'];
            if (!DB::table('cecos')->where('codigo', $codigoSub)->exists()) {
                DB::table('cecos')->insert([
                    'codigo'               => $codigoSub,
                    'nombre'               => $clienteNombre . ' - ' . $sufijo['nombre'],
                    'razon_social'         => $clienteNombre,
                    'tipo_cliente'         => $grupoCodigo,
                    'nivel'                => 2,
                    'parent_id'            => $clienteId,
                    'tipo_subcuenta'       => $sufijo['tipo'],
                    'estado'               => true,
                    'descripcion'          => $sufijo['nombre'],
                    'codigo_auto_generado' => true,
                    'created_at'           => now(),
                    'updated_at'           => now(),
                ]);
                $this->command->info("✓ SUBCUENTA {$codigoSub} creada");
            } else {
                $this->command->warn("⊘ SUBCUENTA {$codigoSub} ya existe, saltando...");
            }
        }
    }
}
