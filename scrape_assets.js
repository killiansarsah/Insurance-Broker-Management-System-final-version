const fs = require('fs');
const path = require('path');
const https = require('https');

const FILES = [
    { name: 'life.html', type: 'life' },
    { name: 'nonlife.html', type: 'non-life' },
    { name: 'reinsurers.html', type: 'reinsurer' }
];

const OUT_DIR = path.join(__dirname, 'public', 'images', 'carriers');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`Status ${res.statusCode}`));
            }
            const stream = fs.createWriteStream(filepath);
            res.pipe(stream);
            stream.on('finish', () => {
                stream.close();
                resolve();
            });
            stream.on('error', reject);
        }).on('error', reject);
    });
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function run() {
    const assets = [];

    for (const file of FILES) {
        if (!fs.existsSync(path.join(__dirname, file.name))) {
            console.log(`Skipping ${file.name} (not found)`);
            continue;
        }

        const content = fs.readFileSync(path.join(__dirname, file.name), 'utf8');
        // Structure: <div class="logo-img"> ... <a href="..."> <img ... src="..."> ...

        // We can split by "logo-img" to iterate chunks
        const chunks = content.split('class="logo-img"');
        chunks.shift(); // remove first chunk before first logo

        console.log(`Processing ${file.name}: found ${chunks.length} potential items`);

        for (const chunk of chunks) {
            // Cut parsing at next </div> or reasonable limit to avoid grabbing wrong links
            // The structure is nested <div><a><img></a></div> so we are safe looking ahead a bit
            const snippet = chunk.substring(0, 1000);

            // Extract href
            let hrefMatch = snippet.match(/href="([^"]+)"/);
            // Extract src
            let srcMatch = snippet.match(/src="([^"]+)"/);
            // Extract title or alt (prefer title)
            let nameMatch = snippet.match(/title="([^"]+)"/) || snippet.match(/alt="([^"]+)"/);

            if (srcMatch && nameMatch) {
                const url = srcMatch[1];
                const cleanUrl = url.replace(/&amp;/g, '&');
                let name = nameMatch[1].replace(/&amp;/g, '&');
                const website = hrefMatch ? hrefMatch[1] : '';

                // Clean name (remove " Ltd", " Ghana", etc if desired, but better keep full)
                const slug = slugify(name);
                // Detect extension
                let ext = path.extname(cleanUrl).split('?')[0] || '.png';
                if (ext.length > 5) ext = '.png'; // safety

                const filename = `${slug}${ext}`;
                const filepath = path.join(OUT_DIR, filename);

                // Check for duplicate slugs
                let finalFilename = filename;
                let counter = 1;
                while (assets.find(a => path.basename(a.logoPath) === finalFilename)) {
                    finalFilename = `${slug}-${counter}${ext}`;
                    counter++;
                }

                try {
                    // console.log(`Downloading ${name} -> ${finalFilename}`);
                    await downloadImage(cleanUrl, path.join(OUT_DIR, finalFilename));
                    assets.push({
                        name,
                        slug: slug, // we might want to map this to existing mock slugs later
                        type: file.type,
                        website,
                        logoPath: `/images/carriers/${finalFilename}`,
                        originalUrl: cleanUrl
                    });
                } catch (err) {
                    console.error(`Failed to download ${name}: ${err.message}`);
                }
            }
        }
    }

    fs.writeFileSync(path.join(__dirname, 'carrier_assets.json'), JSON.stringify(assets, null, 2));
    console.log(`Saved ${assets.length} assets info to carrier_assets.json`);
}

run();
