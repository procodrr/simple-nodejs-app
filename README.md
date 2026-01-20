# HTTPS Server with Node.js and Let's Encrypt

This is a simple e-commerce application built with Node.js and Express.js that demonstrates how to create an HTTPS server using Node.js with Let's Encrypt SSL certificates.

The application automatically switches between HTTP (development) and HTTPS (production) modes based on environment configuration. In production mode, it uses Let's Encrypt certificates to serve secure HTTPS connections and includes an HTTP redirect server that automatically redirects all HTTP traffic to HTTPS.

## Project Structure

```
demo-node-app/
├── app.js                 # Main Express application
├── server.js              # Server entry point (handles HTTP/HTTPS based on environment)
├── controllers/           # Controller files
│   ├── productController.js
│   └── userController.js
├── routes/                # Route files
│   ├── productRoutes.js
│   └── userRoutes.js
├── data/                  # Mock data files
│   ├── products.json
│   └── users.json
└── public/                # Static files
    ├── index.html
    ├── cart.html
    ├── script.js
    └── cart.js
```

## Installation

Install dependencies:
```bash
npm install
```

## Production Server Configuration

The `server.js` file dynamically configures the server based on the `NODE_ENV` environment variable:

- **Development Mode** (default, when `NODE_ENV` is not set or not "production"):
  - Runs HTTP server only
  - Default port: `3000`
  - Accessible at `http://localhost:3000`
  - No `.env` file required

- **Production Mode** (`NODE_ENV=production`):
  - Runs HTTPS server on port `443`
  - Runs HTTP redirect server on port `80` (redirects to HTTPS)
  - Uses Let's Encrypt SSL certificates
  - Domain configured via `DOMAIN` env variable
  - **Requires `.env` file** with production settings

## Running the Application

### Development Mode

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Mode

1. Create a `.env` file in the root directory with production settings:
```env
NODE_ENV=production
DOMAIN=yourdomain.com
```

2. Start the server:
```bash
npm start
```

## SSL Certificate Setup (Let's Encrypt)

For production deployment with HTTPS, you need to generate SSL certificates using Let's Encrypt.

### Prerequisites

1. Update your system packages:
```bash
sudo apt update
sudo apt install -y certbot
```

2. **Important**: Make sure your server is **NOT running** before generating certificates.

### Generate Certificates

Run the following command to generate certificates for your domain (replace `yourdomain.com` with your actual domain):
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

If successful, certificates will be created here:
```
/etc/letsencrypt/live/yourdomain.com/
```

The certificate files include:
- `privkey.pem` - Private key
- `fullchain.pem` - Certificate chain

### Check Certificates

To verify your certificates are valid and check their expiration:
```bash
sudo certbot certificates
```

### Certificate Renewal

Let's Encrypt certificates expire after 90 days. To renew:
```bash
sudo certbot renew
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Browse products using the category filters
3. Click "Load Users" to view all registered users
4. Use the "Add to Cart" button on products (currently shows an alert)

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development  # Set to "production" for HTTPS mode
PORT=3000             # Port for development server (default: 3000)
DOMAIN=yourdomain.com # Domain name for production (used for SSL certificates)
```

## Notes

- All API routes are prefixed with `/api`
- Products are stored in `data/products.json`
- Users are stored in `data/users.json`
- The UI uses Tailwind CSS via CDN with a dark theme and blue color scheme
- The server automatically switches between HTTP (development) and HTTPS (production) based on `NODE_ENV`
- For production, ensure SSL certificates are generated and the server has read access to `/etc/letsencrypt/live/{domain}/`