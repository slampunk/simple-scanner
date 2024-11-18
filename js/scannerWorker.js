import jsQR from "./jsqr.js";

class Detector {
    builtinDetector = null;
    libDetector = null;
    constructor() {
        if (globalThis.BarcodeDetector) {
            this.builtinDetector = new BarcodeDetector({
                formats: ['qr_code']
            });   
        }
        else {
            this.libDetector = jsQR;
        }
    }

    /**
     * Detects qr codes in an image bitmap.
     * @param {ImageBitmap} image 
     * @returns {Promise<string[]>} Array of detected QR codes, or empty array if none found.
     */
    detect = async(image) => {
        if (this.builtinDetector) {
            const barcodeDetections = await this.builtinDetector.detect(image);
            const barcodes = barcodeDetections.map(barcodeDetection => barcodeDetection.rawValue);
            if (barcodes.length) {
                self.postMessage({ event: 'detection', barcodes });
            }
        }
        else {
            const imageData = this.imageToUint8ClampedArray(image);
            const code = this.libDetector(imageData, image.width, image.height);
            if (code) {
                self.postMessage({ event: 'detection', barcodes: [ code.data ] });
            }
        }
    }

    imageToUint8ClampedArray = (image) => {
        const canvas = new OffscreenCanvas(image.width, image.height);
        canvas.width = image.width;
        canvas.height  = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return imageData.data;
    }
}

const detector = new Detector();

let isProcessing = false;

self.onmessage = async(event) => {
    if (isProcessing){
        return;
    }

    isProcessing = true;

    try {
        await detector.detect(event.data);
    } catch(err) {
        console.error('Barcode detection failed:', err);
    }

    setTimeout(() => {
        isProcessing = false;
    }, 500);
}
