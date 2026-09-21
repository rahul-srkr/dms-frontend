import { zipSync } from 'fflate';

self.onmessage = (event: MessageEvent) => {
    const { files } = event.data;

    try {
        const zipData: Record<string, Uint8Array> = {};
        for (const file of files) {
            let name = file.name;
            let counter = 1;
            while (zipData[name]) {
                const parts = file.name.split('.');
                const ext = parts.length > 1 ? `.${parts.pop()}` : '';
                const base = parts.join('.');
                name = `${base} (${counter})${ext}`;
                counter++;
            }
            zipData[name] = new Uint8Array(file.data);
        }

        const zipped = zipSync(zipData);

        self.postMessage({ type: 'done', data: zipped.buffer });
    } catch (error: any) {
        self.postMessage({ type: 'error', error: error.message });
    }
};
