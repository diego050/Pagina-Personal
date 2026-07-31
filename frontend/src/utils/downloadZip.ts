export interface ZipEntry {
    /** Public URL of the file to fetch, e.g. /certificates/coursera-marketing/foo.pdf */
    href: string;
    /** Name the file should have inside the .zip. Falls back to the basename of href. */
    filename?: string;
}

const basename = (href: string) => {
    const clean = href.split('?')[0].split('#')[0];
    return decodeURIComponent(clean.substring(clean.lastIndexOf('/') + 1)) || 'file';
};

/**
 * Fetches every entry, bundles them into a single .zip and triggers the browser download.
 * JSZip is imported dynamically so it only reaches the user's browser when they actually
 * click a grouped certificate.
 */
export async function downloadFilesAsZip(entries: ZipEntry[], zipName: string): Promise<void> {
    if (!entries.length) return;

    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    const files = await Promise.all(
        entries.map(async (entry) => {
            const res = await fetch(entry.href);
            if (!res.ok) throw new Error(`Failed to fetch ${entry.href} (${res.status})`);
            // ArrayBuffer rather than Blob: JSZip accepts it everywhere without type sniffing
            return { name: entry.filename || basename(entry.href), data: await res.arrayBuffer() };
        })
    );

    // Guard against duplicate names inside the archive
    const used = new Set<string>();
    files.forEach(({ name, data }) => {
        let finalName = name;
        if (used.has(finalName)) {
            const dot = name.lastIndexOf('.');
            const stem = dot > 0 ? name.slice(0, dot) : name;
            const ext = dot > 0 ? name.slice(dot) : '';
            let i = 2;
            while (used.has(`${stem}-${i}${ext}`)) i++;
            finalName = `${stem}-${i}${ext}`;
        }
        used.add(finalName);
        zip.file(finalName, data);
    });

    // PDFs are already compressed, so STORE keeps it fast without losing size
    const archive = await zip.generateAsync({ type: 'blob', compression: 'STORE' });

    const url = URL.createObjectURL(archive);
    const link = document.createElement('a');
    link.href = url;
    link.download = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
