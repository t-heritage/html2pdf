// server.js
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const HTMLtoDOCX = require('html-to-docx');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.text({ limit: '50mb', type: 'text/html' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    version: '2.0.0',
    formats: ['pdf', 'docx', 'png'],
    endpoints: {
      health: 'GET /',
      convert: 'POST /convert',
      convertUrl: 'POST /convert-url'
    },
    usage: {
      convert: 'Send HTML in request body as JSON: { "html": "<html>...</html>", "format": "pdf|docx|png", "options": {...} }',
      convertUrl: 'Send URL in request body as JSON: { "url": "https://...", "format": "pdf|docx|png", "options": {...} }'
    }
  });
});

// Convert HTML to specified format
app.post('/convert', async (req, res) => {
  let browser;
  
  try {
    const { html, format = 'pdf', options = {} } = typeof req.body === 'string' 
      ? { html: req.body, format: 'pdf', options: {} }
      : req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    const validFormats = ['pdf', 'docx', 'png'];
    if (!validFormats.includes(format.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Invalid format', 
        message: `Format must be one of: ${validFormats.join(', ')}` 
      });
    }

    const formatLower = format.toLowerCase();

    // DOCX conversion (doesn't need Puppeteer)
    if (formatLower === 'docx') {
      const docxBuffer = await HTMLtoDOCX(html, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
        ...options
      });

      res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=document.docx');
      return res.send(docxBuffer);
    }

    // PDF and PNG need Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    if (formatLower === 'pdf') {
      const pdfOptions = {
        format: options.format || 'A4',
        printBackground: options.printBackground !== false,
        margin: options.margin || {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        ...options
      };

      const pdf = await page.pdf(pdfOptions);
      await browser.close();

      res.contentType('application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
      return res.send(pdf);
    }

    if (formatLower === 'png') {
      // Set viewport if specified
      if (options.width || options.height) {
        await page.setViewport({
          width: options.width || 1200,
          height: options.height || 800
        });
      }

      const screenshotOptions = {
        type: 'png',
        fullPage: options.fullPage !== false,
        ...options
      };

      const screenshot = await page.screenshot(screenshotOptions);
      await browser.close();

      res.contentType('image/png');
      res.setHeader('Content-Disposition', 'attachment; filename=document.png');
      return res.send(screenshot);
    }

  } catch (error) {
    if (browser) await browser.close();
    console.error('Error converting HTML:', error);
    res.status(500).json({ 
      error: 'Failed to convert HTML',
      message: error.message 
    });
  }
});

// Convert URL to specified format
app.post('/convert-url', async (req, res) => {
  let browser;
  
  try {
    const { url, format = 'pdf', options = {} } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const validFormats = ['pdf', 'docx', 'png'];
    if (!validFormats.includes(format.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Invalid format', 
        message: `Format must be one of: ${validFormats.join(', ')}` 
      });
    }

    const formatLower = format.toLowerCase();

    // DOCX from URL - fetch HTML first
    if (formatLower === 'docx') {
      const response = await fetch(url);
      const html = await response.text();
      
      const docxBuffer = await HTMLtoDOCX(html, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
        ...options
      });

      res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=document.docx');
      return res.send(docxBuffer);
    }

    // PDF and PNG need Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    if (formatLower === 'pdf') {
      const pdfOptions = {
        format: options.format || 'A4',
        printBackground: options.printBackground !== false,
        margin: options.margin || {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        ...options
      };

      const pdf = await page.pdf(pdfOptions);
      await browser.close();

      res.contentType('application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
      return res.send(pdf);
    }

    if (formatLower === 'png') {
      if (options.width || options.height) {
        await page.setViewport({
          width: options.width || 1200,
          height: options.height || 800
        });
      }

      const screenshotOptions = {
        type: 'png',
        fullPage: options.fullPage !== false,
        ...options
      };

      const screenshot = await page.screenshot(screenshotOptions);
      await browser.close();

      res.contentType('image/png');
      res.setHeader('Content-Disposition', 'attachment; filename=document.png');
      return res.send(screenshot);
    }

  } catch (error) {
    if (browser) await browser.close();
    console.error('Error converting URL:', error);
    res.status(500).json({ 
      error: 'Failed to convert URL',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`HTML Converter API running on port ${PORT}`);
  console.log(`Supported formats: PDF, DOCX, PNG`);
});
