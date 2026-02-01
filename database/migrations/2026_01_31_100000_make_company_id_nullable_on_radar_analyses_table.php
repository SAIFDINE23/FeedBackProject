<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Allow global radar analyses where company_id is NULL.
        // Using raw SQL avoids requiring doctrine/dbal for column changes.
        DB::statement('ALTER TABLE radar_analyses DROP CONSTRAINT IF EXISTS radar_analyses_company_id_foreign');
        DB::statement('ALTER TABLE radar_analyses ALTER COLUMN company_id DROP NOT NULL');
        DB::statement('ALTER TABLE radar_analyses ADD CONSTRAINT radar_analyses_company_id_foreign FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE');
    }

    public function down(): void
    {
        // Drop global analyses first, otherwise NOT NULL will fail.
        DB::table('radar_analyses')->whereNull('company_id')->delete();

        DB::statement('ALTER TABLE radar_analyses DROP CONSTRAINT IF EXISTS radar_analyses_company_id_foreign');
        DB::statement('ALTER TABLE radar_analyses ALTER COLUMN company_id SET NOT NULL');
        DB::statement('ALTER TABLE radar_analyses ADD CONSTRAINT radar_analyses_company_id_foreign FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE');
    }
};
