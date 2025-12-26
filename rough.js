// rgbled.js - Single RGB LED control via SPI on Raspberry Pi
// WS2812 LEDs use GRB color order!

const SPI = require('spi-device');

// Configuration
const STEP_TIME = 1000; // milliseconds between colors
const SPI_SPEED = 6400000; // 6.4 MHz for WS2812

// Open SPI device
const spi = SPI.openSync(0, 0);

// Convert a single GRB color to SPI bit pattern
// WS2812 expects: HIGH bit = 1110, LOW bit = 1000 (at 800kHz)
function colorToSPI(g, r, b) {
    const buffer = Buffer.alloc(24); // 8 bits × 3 colors = 24 bytes
    const colors = [g, r, b]; // GRB order!
    let pos = 0;

    for (let color of colors) {
        for (let bit = 7; bit >= 0; bit--) {
            // If bit is 1: send 0b11111100, if bit is 0: send 0b11000000
            buffer[pos++] = (color & (1 << bit)) ? 0b11111100 : 0b11000000;
        }
    }

    return buffer;
}

// Write color to LED
function setColor(r, g, b) {
    const buffer = colorToSPI(g, r, b);
    spi.transferSync([{
        sendBuffer: buffer,
        byteLength: buffer.length,
        speedHz: SPI_SPEED
    }]);
}

// Helper for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main demo loop
async function main() {
    console.log("Starting RGB LED demo...");
    console.log("Press Ctrl+C to exit\n");

    // Turn off LED on start
    setColor(0, 0, 0);
    await sleep(500);

    while (true) {
        console.log("RED");
        setColor(255, 0, 0);
        await sleep(STEP_TIME);

        setColor(0, 0, 0);
        await sleep(200);

        console.log("GREEN");
        setColor(0, 255, 0);
        await sleep(STEP_TIME);

        setColor(0, 0, 0);
        await sleep(200);

        console.log("BLUE");
        setColor(0, 0, 255);
        await sleep(STEP_TIME);

        setColor(0, 0, 0);
        await sleep(200);

        console.log("WHITE");
        setColor(255, 255, 255);
        await sleep(STEP_TIME);

        setColor(0, 0, 0);
        await sleep(200);

        console.log("YELLOW");
        setColor(255, 255, 0);
        await sleep(STEP_TIME);

        setColor(0, 0, 0);
        await sleep(200);

        console.log("CYAN");
        setColor(0, 255, 255);
        await sleep(STEP_TIME);

        setColor(0, 0, 0);
        await sleep(200);

        console.log("MAGENTA");
        setColor(255, 0, 255);
        await sleep(STEP_TIME);

        setColor(0, 0, 0);
        await sleep(1000);

        console.log("---\n");
    }
}

// Clean up on exit
process.on('SIGINT', () => {
    console.log("\nCleaning up...");
    setColor(0, 0, 0);
    spi.closeSync();
    process.exit(0);
});

// Start
main().catch(err => {
    console.error("Error:", err);
    setColor(0, 0, 0);
    spi.closeSync();
    process.exit(1);
});