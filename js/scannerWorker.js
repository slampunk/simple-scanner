const barcodeDetector = new BarcodeDetector({
    formats: ['qr_code']
});

let isProcessing = false;

self.onmessage = async(event) => {
    if (isProcessing){
        return;
    }

    isProcessing = true;

    try {
        const barcodeDetections = await barcodeDetector.detect(event.data);
        const barcodes = barcodeDetections.map(barcodeDetection => barcodeDetection.rawValue);
        if (barcodes.length) {
            self.postMessage({ event: 'detection', barcodes });
        }
    } catch (err) {
        console.error('Barcode detection failed:', err);
    }

    setTimeout(() => {
        isProcessing = false;
    }, 500);
}
