/**
 * ============================================================
 * DETECTIVE DE DATOS - SISTEMA DE CERTIFICADOS
 * Generación de certificados dinámicos con HTML5 Canvas
 * ============================================================
 */

class CertificateGenerator {
    constructor() {
        this.canvas = document.getElementById('certificateCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.modal = document.getElementById('certificateModal');
        this.initListeners();
    }

    initListeners() {
        document.getElementById('btnCloseCertificate')?.addEventListener('click', () => this.close());
        document.getElementById('btnCloseCertificateAction')?.addEventListener('click', () => this.close());
        document.getElementById('btnDownloadCertificate')?.addEventListener('click', () => this.download());
    }

    generate(playerName, rankName, completionDate) {
        if (!this.canvas) return;

        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Fondo y Borde
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Borde doble
        this.ctx.strokeStyle = "#1a365d"; // Azul oscuro
        this.ctx.lineWidth = 10;
        this.ctx.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);

        this.ctx.strokeStyle = "#c5a017"; // Dorado
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(35, 35, this.canvas.width - 70, this.canvas.height - 70);

        // Logo
        this.ctx.font = "bold 40px 'Poppins', sans-serif";
        this.ctx.fillStyle = "#1a365d";
        this.ctx.textAlign = "center";
        this.ctx.fillText("DETECTIVE DE DATOS", this.canvas.width / 2, 100);

        // Título Certificado
        this.ctx.font = "italic 30px 'serif'";
        this.ctx.fillStyle = "#4a5568";
        this.ctx.fillText("Certificado de Excelencia", this.canvas.width / 2, 160);

        // Cuerpo
        this.ctx.font = "20px 'Poppins', sans-serif";
        this.ctx.fillStyle = "#2d3748";
        this.ctx.fillText("Se otorga el presente reconocimiento a:", this.canvas.width / 2, 220);

        // Nombre del Jugador
        this.ctx.font = "bold 60px 'serif'";
        this.ctx.fillStyle = "#1a365d";
        this.ctx.fillText(playerName, this.canvas.width / 2, 300);

        // Rango
        this.ctx.font = "24px 'Poppins', sans-serif";
        this.ctx.fillStyle = "#2d3748";
        this.ctx.fillText(`Por haber alcanzado el rango de:`, this.canvas.width / 2, 360);

        this.ctx.font = "bold 36px 'Poppins', sans-serif";
        this.ctx.fillStyle = "#c5a017";
        this.ctx.fillText(rankName, this.canvas.width / 2, 410);

        // Fecha
        this.ctx.font = "18px 'Poppins', sans-serif";
        this.ctx.fillStyle = "#718096";
        this.ctx.fillText(`Completado el: ${completionDate}`, this.canvas.width / 2, 480);

        // Firmas y Sellos
        this.drawSeal(150, 500);
        this.drawSignature("ChainMart Inc.", 650, 500);

        this.show();
    }

    drawSeal(x, y) {
        this.ctx.save();
        this.ctx.translate(x, y);

        // Círculo exterior
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 50, 0, Math.PI * 2);
        this.ctx.strokeStyle = "#c5a017";
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Texto sello
        this.ctx.font = "10px sans-serif";
        this.ctx.fillStyle = "#c5a017";
        this.ctx.fillText("DATA VERIFIED", -35, 5);

        this.ctx.restore();
    }

    drawSignature(text, x, y) {
        this.ctx.save();
        this.ctx.font = "italic 24px 'Brush Script MT', cursive";
        this.ctx.fillStyle = "#2d3748";
        this.ctx.fillText(text, x - 100, y);
        this.ctx.beginPath();
        this.ctx.moveTo(x - 110, y + 5);
        this.ctx.lineTo(x + 50, y + 5);
        this.ctx.strokeStyle = "#2d3748";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.restore();
    }

    show() {
        this.modal.classList.add('active');
    }

    close() {
        this.modal.classList.remove('active');
    }

    download() {
        const link = document.createElement('a');
        link.download = 'certificado-detective-datos.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

// Instancia global
const certificateSystem = new CertificateGenerator();
