const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');
const templatePath = path.join(srcDir, 'index.html');
const outputPath = path.join(__dirname, 'index.html');

function build() {
    console.log('Compiling components...');
    try {
        if (!fs.existsSync(templatePath)) {
            console.error('Source template index.html not found!');
            return;
        }
        let html = fs.readFileSync(templatePath, 'utf8');
        
        // Find all tags: <!-- @inject filename -->
        const injectRegex = /<!--\s*@inject\s+([\w-]+)\s*-->/g;
        html = html.replace(injectRegex, (match, componentName) => {
            const componentPath = path.join(componentsDir, `${componentName}.html`);
            if (fs.existsSync(componentPath)) {
                return fs.readFileSync(componentPath, 'utf8');
            } else {
                console.warn(`Warning: Component file not found at ${componentPath}`);
                return `<!-- Component ${componentName} not found -->`;
            }
        });
        
        fs.writeFileSync(outputPath, html, 'utf8');
        console.log(`Successfully compiled to ${outputPath}`);
    } catch (err) {
        console.error('Error during build:', err);
    }
}

// Check arguments for watch mode
if (process.argv.includes('--watch')) {
    console.log('Watching for changes in src/...');
    build(); // initial build
    
    // Watch recursively using native node
    fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
        if (filename) {
            console.log(`File change detected: ${filename}`);
            build();
        }
    });
} else {
    build();
}
