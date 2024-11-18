class Scanner {
    targetElement = null;
    videoElement = document.querySelector('video');
    isScanning = false;
    worker = new Worker('js/scannerWorker.js', { type: "module" });
    stream = null;

    constructor() {
        document.getElementById('videoToggle').addEventListener('change', this.handleVideoToggle);
        this.worker.onmessage = this.handleBarcodeResponse;
    }

    handleVideoToggle = e => {
        if (e.currentTarget.checked) {
            return this.startScanning(e);
        }

        this.stopScanning();
    }

    startScanning = async(e) => {
        this.targetElement = e.currentTarget;
        this.stream = await navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment' }, audio: false});
        this.videoElement.srcObject = this.stream;
        this.videoElement.onloadedmetadata = () => {
            this.videoElement.play();
            this.isScanning = true;
            this.postImages();
        }
    }

    stopScanning = () => {
        this.stream.getTracks().forEach(track => track.stop());
        this.isScanning = false;
        document.getElementById('videoToggle').checked = false;
    }

    postImages = async() => {
        const frame = await createImageBitmap(this.videoElement);
        this.worker.postMessage(frame);

        if (this.isScanning) {
            requestAnimationFrame(this.postImages);
        }
    }

    handleBarcodeResponse = e => {
        if (e.data?.event !== 'detection') {
            return;
        }

        document.querySelector('input[name="isa-code"]').value = e.data.barcodes.join(', ');
        this.stopScanning();
    }
}

const scanner = new Scanner();