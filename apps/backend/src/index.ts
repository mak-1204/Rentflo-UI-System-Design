import express from 'express';
import cors from 'cors';
import { Tenant, PGProperty, Complaint, Lead } from '@stayflo/types';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mock DB Storage
const properties: PGProperty[] = [
  {
    id: 'prop-1',
    ownerId: 'owner-1',
    name: 'Sunrise PG',
    address: 'Koramangala, Bengaluru',
    websiteSlug: 'sunrise-pg',
    websiteSettings: {
      theme: 'dark',
      bannerImages: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5'],
      description: 'Luxury Paying Guest Accommodation for Professionals and Students.',
      coordinates: { lat: 12.9352, lng: 77.6245 }
    }
  }
];

const tenants: Tenant[] = [
  {
    id: 't-1',
    userId: 'u-2',
    pgId: 'prop-1',
    bedId: 'b-101a',
    joinCode: 'SUN101',
    securityDeposit: 10000,
    baseRent: 8500,
    checkInDate: '2026-01-15'
  }
];

const complaints: Complaint[] = [
  {
    id: 'c-1',
    tenantId: 't-1',
    pgId: 'prop-1',
    title: 'Geyser not working in Room 101',
    description: 'The geyser in the bathroom is not heating water since yesterday morning.',
    category: 'electrical',
    priority: 'high',
    status: 'in_progress',
    imageUrls: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a']
  }
];

const leads: Lead[] = [
  {
    id: 'l-1',
    pgId: 'prop-1',
    name: 'Priya Sharma',
    phone: '9876543210',
    email: 'priya@gmail.com',
    preferredSharing: 2,
    moveInDate: '2026-06-15',
    status: 'new',
    source: 'portfolio-web'
  }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth Route
app.post('/api/auth/login', (req, res) => {
  const { phone, code } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }
  // Simplified mock auth
  res.json({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockTokenPayload',
    role: phone.startsWith('9') ? 'tenant' : 'owner'
  });
});

// Property Routes
app.get('/api/properties', (req, res) => {
  res.json(properties);
});

app.get('/api/properties/:slug', (req, res) => {
  const property = properties.find(p => p.websiteSlug === req.params.slug);
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  res.json(property);
});

// Tenant Routes
app.get('/api/tenants', (req, res) => {
  res.json(tenants);
});

app.get('/api/tenants/:id', (req, res) => {
  const tenant = tenants.find(t => t.id === req.params.id);
  if (!tenant) {
    return res.status(404).json({ message: 'Tenant not found' });
  }
  res.json(tenant);
});

// Complaint Routes
app.get('/api/complaints', (req, res) => {
  res.json(complaints);
});

app.post('/api/complaints', (req, res) => {
  const newComplaint: Complaint = {
    id: `c-${complaints.length + 1}`,
    tenantId: req.body.tenantId || 't-1',
    pgId: req.body.pgId || 'prop-1',
    title: req.body.title,
    description: req.body.description,
    category: req.body.category || 'other',
    priority: req.body.priority || 'medium',
    status: 'open',
    imageUrls: req.body.imageUrls || []
  };
  complaints.push(newComplaint);
  res.status(201).json(newComplaint);
});

app.get('/api/leads', (req, res) => {
  res.json(leads);
});

app.post('/api/leads', (req, res) => {
  const newLead: Lead = {
    id: `l-${leads.length + 1}`,
    pgId: req.body.pgId || 'prop-1',
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    preferredSharing: req.body.preferredSharing,
    moveInDate: req.body.moveInDate,
    status: 'new',
    source: 'portfolio-web'
  };
  leads.push(newLead);
  res.status(201).json(newLead);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Stayflo backend API running on http://localhost:${PORT}`);
});
