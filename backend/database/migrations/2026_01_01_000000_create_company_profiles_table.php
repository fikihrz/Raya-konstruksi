<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('company_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('about');
            $table->text('vision');
            $table->text('mission');
            $table->text('history');
            $table->string('logo')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('company_profiles'); }
};
