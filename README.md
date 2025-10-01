# HTML to PDF/DOCX/PNG API

A free, self-hosted API service to convert HTML to PDF, DOCX, or PNG images using Puppeteer and html-to-docx.

## Features

- ✅ Convert HTML to **PDF**
- ✅ Convert HTML to **DOCX** (Word documents)
- ✅ Convert HTML to **PNG** images
- ✅ Convert URLs to any format
- ✅ Customizable options for each format
- ✅ CORS enabled for easy integration
- ✅ 100% Free to deploy and use

## Quick Start

### 1. Deploy to Render (Recommended - Free)

1. Create a free account at [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: html-converter-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Click "Create Web Service"
6. Your API will be live at `https://your-service.onrender.com`

### 2. Deploy to Railway

1. Create account at [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects settings
5. Deploy! Your API will be live.

## API Endpoints

### Health Check
```bash
GET /
```

Returns available formats and endpoints.

### Convert HTML to PDF/DOCX/PNG
```bash
POST /convert
Content-Type: application/json

{
  "html": "<html><body><h1>Hello World</h1></body></html>",
  "format": "pdf",
  "options": {
    "format": "A4",
    "printBackground": true
  }
}
```

### Convert URL to PDF/DOCX/PNG
```bash
POST /convert-url
Content-Type: application/json

{
  "url": "https://example.com",
  "format": "png",
  "options": {
    "fullPage": true
  }
}
```

## Format Options

### PDF Options
```json
{
  "html": "...",
  "format": "pdf",
  "options": {
    "format": "A4",
    "printBackground": true,
    "landscape": false,
    "margin": {
      "top": "20px",
      "right": "20px",
      "bottom": "20px",
      "left": "20px"
    },
    "scale": 1
  }
}
```

**Available page formats**: Letter, Legal, Tabloid, Ledger, A0-A6

### DOCX Options
```json
{
  "html": "...",
  "format": "docx",
  "options": {
    "pageNumber": true,
    "footer": true
  }
}
```

**Note**: DOCX conversion preserves most HTML formatting including:
- Headers (h1-h6)
- Paragraphs
- Tables
- Bold, italic, underline
- Lists (ordered and unordered)
- Basic styling

### PNG Options
```json
{
  "html": "...",
  "format": "png",
  "options": {
    "fullPage": true,
    "width": 1200,
    "height": 800,
    "clip": {
      "x": 0,
      "y": 0,
      "width": 800,
      "height": 600
    }
  }
}
```

## Usage Examples

### JavaScript - Convert to PDF
```javascript
const response = await fetch('https://your-api.onrender.com/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    html: '<html><body><h1>My Document</h1></body></html>',
    format: 'pdf',
    options: {
      format: 'A4',
      printBackground: true
    }
  })
});

const pdfBlob = await response.blob();
const url = URL.createObjectURL(pdfBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'document.pdf';
a.click();
```

### JavaScript - Convert to DOCX
```javascript
const response = await fetch('https://your-api.onrender.com/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    html: '<html><body><h1>My Document</h1></body></html>',
    format: 'docx'
  })
});

const docxBlob = await response.blob();
// Download or use the DOCX file
```

### JavaScript - Convert to PNG
```javascript
const response = await fetch('https://your-api.onrender.com/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    html: '<html><body><h1>My Image</h1></body></html>',
    format: 'png',
    options: {
      fullPage: true,
      width: 1920,
      height: 1080
    }
  })
});

const imageBlob = await response.blob();
```

### Python - Convert to PDF
```python
import requests

response = requests.post(
    'https://your-api.onrender.com/convert',
    json={
        'html': '<html><body><h1>My PDF</h1></body></html>',
        'format': 'pdf',
        'options': {
            'format': 'A4',
            'printBackground': True
        }
    }
)

with open('output.pdf', 'wb') as f:
    f.write(response.content)
```

### Python - Convert to DOCX
```python
import requests

response = requests.post(
    'https://your-api.onrender.com/convert',
    json={
        'html': '<html><body><h1>My Word Doc</h1></body></html>',
        'format': 'docx'
    }
)

with open('output.docx', 'wb') as f:
    f.write(response.content)
```

### cURL - Convert to PNG
```bash
curl -X POST https://your-api.onrender.com/convert \
  -H "Content-Type: application/json" \
  -d '{
    "html":"<html><body><h1>Hello</h1></body></html>",
    "format":"png",
    "options":{"fullPage":true}
  }' \
  --output output.png
```

### Make.com Integration

**Module: HTTP - Make a Request**

**For PDF:**
```json
{
  "html": "{{1.html}}",
  "format": "pdf",
  "options": {
    "format": "A4",
    "printBackground": true
  }
}
```

**For DOCX:**
```json
{
  "html": "{{1.html}}",
  "format": "docx"
}
```

**For PNG:**
```json
{
  "html": "{{1.html}}",
  "format": "png",
  "options": {
    "fullPage": true,
    "width": 1200
  }
}
```

## Format Comparison

| Feature | PDF | DOCX | PNG |
|---------|-----|------|-----|
| Editable | ❌ | ✅ | ❌ |
| File Size | Small | Medium | Large |
| Quality | High | High | Perfect |
| Tables | ✅ | ✅ | ✅ |
| Images | ✅ | ✅ | ✅ |
| Formatting | Perfect | Good | Perfect |
| Best For | Reports, invoices | Editable docs | Social media, previews |

## Local Development

```bash
# Clone your repo
git clone https://github.com/yourusername/html-converter-api
cd html-converter-api

# Install dependencies
npm install

# Run locally
npm start

# API available at http://localhost:3000
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## Common Use Cases

### 1. Generate Invoices (PDF)
```javascript
const invoice = `
  <html>
    <style>
      body { font-family: Arial; padding: 40px; }
      .header { border-bottom: 2px solid #333; }
    </style>
    <body>
      <div class="header">
        <h1>Invoice #1234</h1>
      </div>
      <!-- invoice content -->
    </body>
  </html>
`;

// Convert to PDF
```

### 2. Generate Reports (DOCX)
```javascript
// Convert HTML report to editable Word document
// Perfect for reports that need further editing
```

### 3. Social Media Images (PNG)
```javascript
// Convert HTML to PNG for Instagram, Twitter, etc.
// Full control over dimensions and quality
```

### 4. Email Templates (PDF)
```javascript
// Convert HTML email to PDF attachment
```

## Troubleshooting

### "Failed to convert" error
- Check your HTML is valid
- Ensure HTML is properly formatted
- Verify your API URL is correct

### DOCX formatting issues
- Use simple HTML tags (h1-h6, p, table, ul, ol)
- Avoid complex CSS
- Test with simple HTML first

### PNG is cropped
- Set `fullPage: true` in options
- Adjust viewport width/height
- Use `clip` option for specific area

### Large file sizes
- Optimize images in HTML
- Reduce PNG dimensions
- Use appropriate format (PDF for documents, PNG for images)

## Rate Limits

Render free tier:
- 750 hours/month runtime
- Automatic sleep after 15min inactivity
- Perfect for moderate use

For high volume, upgrade to paid tier.

## Cost

- **Render**: Free tier (750 hours/month)
- **Railway**: $5 free credit monthly
- **Vercel**: Free but limited for Puppeteer

## Security

- No data is stored
- All conversions happen in memory
- Files are not saved on server
- HTTPS encryption (when deployed)

## License

MIT

## Contributing

Pull requests welcome! Feel free to add features like:
- JPEG support
- SVG support
- Additional DOCX options
- Batch conversion
- Webhooks
